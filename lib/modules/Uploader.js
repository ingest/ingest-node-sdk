'use strict'

const request = require('request')
const RequestWrapper = require('../core/Request')
const Utils = require('../core/Utils')

/**
 * Create a new upload wrapper.  Manages the entire upload of a file.
 * @class
 * @param   {object}  options                   Configuration options to override the defaults.
 * @param   {object}  options.api               A reference to the parent API instance.
 * @param   {object}  options.file              The file to upload.
 * @param   {object}  options.upload            REST endpoint for creating an input.
 * @param   {object}  options.sign              REST endpoint for signing a blob before upload.
 * @param   {object}  options.uploadComplete    REST endpoint to notify the API that the upload is complete.
 * @param   {object}  options.uploadAbort       REST endpoint to abort the upload.
 */
class Uploader {
  /**
   * @constructor
   * @param {object} options      - the options passed in to be uploaded
   */
  constructor (options) {
    this.defaults = {
      api: null,
      file: null,
      upload: '/encoding/inputs/<%=id%>/upload<%=method%>',
      sign: '/encoding/inputs/<%=id%>/upload/sign<%=method%>',
      uploadComplete: '/encoding/inputs/<%=id%>/upload/complete',
      uploadAbort: '/encoding/inputs/<%=id%>/upload/abort<%=method%>',
      uploadMethods: {
        param: '?type=',
        singlePart: 'amazon',
        multiPart: 'amazonMP'
      }
    }

    this.config = Object.assign({}, this.defaults, options)

    this.api = this.config.api
    this.file = this.config.file
    this.method = this._determineUploadMethod(this.file.size)

    this.input = null

    this.uploadId = ''
    this.key = ''

    this.requiredChunkCount = 0
    this.requiredChunkSize = 0

    this.pieces = []
    this.piecesByteLength = 0

    this.chunks = []
    this.chunkPromises = []
    this.chunkCount = 0
    this.chunksCompleted = 0
    this.chunksByteLength = 0

    this.uploadedBytes = 0

    this.aborted = false
    this.paused = false
    this.created = false
    this.initialized = false
    this.uploadComplete = false  // Set to true when all the chunks are uploaded, but before the complete call is made.

    this.multiPartPromise = null
    this.singlePartPromise = null
  }

  /**
   * Register a function to execute when a chunk completes uploading.
   * @param  {Function} callback A callback to execute when progress is made.
   */
  progress (callback) {
    this.config.progress = callback
  };

  /**
   * Create a new input record and upload the files to amazon.
   * @return  {Promise}         A promise which resolves when the new input record is created and uploaded.
   */
  save () {
    return this._createInputRecord()
      .then(this._initializeInputRecord.bind(this))
      .then(this._prepareUpload.bind(this))
  }

  pause () {

  }

  resume () {

  }

  /**
   * Aborts an input upload
   *
   * @return {Promise} A promise which resolves when the request is complete.
   */
  abort () {

  }

  /**
   * Call the progress callback and pass the current progress percentage.
   * @private
   * @param  {number} percent   Current progress percentage.
   * @param  {number} chunkSize Size of chunk processed
   */
  _updateProgress (percent, chunkSize) {
    if (!this.config.progress) {
      return
    }
    this.config.progress(percent, chunkSize)
  };

  /**
   * Calculates progress then calls the update progress function
   * @private
   * @param {*} uploadedBytes - bytes that have been uploaded
   * @param {*} totalBytes    - total bytes of the file
   */
  _setProgress (uploadedBytes, totalBytes) {
    let progress

    // BUGWATCH: if we change this to upload multiple chunks at once this will have to be written
    // other chunks completed data + the current chunk in the request
    progress = (this.uploadedBytes + uploadedBytes) / this.file.size
    progress *= 99
    progress = Math.round(progress)

    this._updateProgress(progress, totalBytes)
  };

  /**
   * Creates an input record for the file
   * @private
   * @return  {Promise}  A promise which resolves when the new input record is created.
   */
  _createInputRecord () {
    // Step 1 Start, Create an input record for the file.
    if (this.created) {
      // If we already did it, don't do it again
      return Utils.promisify(true, this.input.id)
    }

    if (this.aborted) {
      // If this has been aborted, don't do it again.
      return Utils.promisify(false, 'upload aborted')
    }

    return this.api.Inputs.add({
      filename: this.file.name,
      type: this.file.type,
      size: this.file.size
    }).then(this._createInputRecordSuccess.bind(this))
  }

  /**
   * Process the response from creating an input record (end step 1)
   * @private
   * @param  {object}  response - the response to be processed
   * @return {string}           - the file record id
   */
  _createInputRecordSuccess (response) {
    let input = JSON.parse(response.data)

    this.created = true
    this._updateProgress(0, 0)

    // Store the input record.
    this.input = input
    console.log('Input Record Initialized with UUID: ', input.id)

    return input.id
  };

  /**
   * Initializes an Input for upload
   * @private
   * @return {Promise} A promise which resolves when the request is complete.
   */
  _initializeInputRecord () {
    // Step 2 Start, initializes the input record
    if (this.aborted) {
      return Utils.promisify(false, 'upload aborted')
    }

    const url = Utils.parseTokens(this.config.upload, {
      id: this.input.id,
      method: this.method
    })

    const request = {
      url,
      method: 'POST',
      data: {
        type: this.file.type,
        size: this.file.size
      }
    }

    return this._sendRequest(request).then(this._initializeInputRecordComplete.bind(this))
  };

  /**
   * Store the information returned from the initialize request.
   * @private
   * @param {object} response - the information returned from _initializeInputRecord
   */
  _initializeInputRecordComplete (response) {
    let data = JSON.parse(response.data)

    this.initialized = true

    this.uploadId = data.uploadId
    this.key = data.key

    this.requiredChunkSize = data.pieceSize
    this.requiredChunkCount = data.pieceCount
  };

  /**
   * Setup the upload depending on its type, single or multi part.
   * @private
   * @return {Promise} A promise which resolves when all of the pieces have completed uploading.
   */
  _prepareUpload () {
    let promise

    if (this._shouldBeMultipart(this.file.size)) {
      promise = this._createChunks().then(this._completeMultipartUpload.bind(this))
    } else {
      promise = this._uploadSinglepartFile().then(this._onCompleteUpload.bind(this))
    }

    return promise
  };

  // ================================ Start singlepart stuff =====================

  /**
   * Uploads a singlepart file
   * @returns {Promise} - TODO
   */
  _uploadSinglepartFile () {
    console.log('_uploadSinglepartFile')

    // Create a new promise if one doesn't exist.
    // if (!this.singlePartPromise) {
    let resolveP, rejectP
    this.singlePartPromise = new Promise((resolve, reject) => {
      resolveP = resolve
      rejectP = reject
    })
    // }

    // Convert the stream into a buffer.
    const stream = this.file.data
    const chunks = []

    // For every chunk of data add it to an array
    stream.on('data', chunk => chunks.push(chunk))
    // Combine the chunks into a data buffer and send them
    stream.on('end', () => {
      this.file.data = Buffer.concat(chunks)

      const chunk = {
        data: this.file
      }

      // Broken off the chain, this will allow us to cancel single part uploads without breaking the
      // initial chain.
      this._signChunk(chunk)
        .then(this._sendChunk.bind(this, chunk))
        .then(this._sendSinglepartComplete.bind(this))
        .then(this._updateProgress.bind(this, 100, this.fileRecord.size))
        .then(() => resolveP())
    })

    return this.singlePartPromise
  };

  /**
   * Called when the upload is actually complete
   * @private
   * @return {string} - the fileRecord id
   */
  _onCompleteUpload () {
    // Send the final progress update once the upload is actually complete.
    this._updateProgress(100)

    this.uploadComplete = true
    this.multiPartPromise = null
    this.singlePartPromise = null

    return this.input.id
  };

  /**
   * Update the upload bytes value when a single part file is uploaded.
   * @private
   */
  _sendSinglepartComplete () {
    console.log('_sendSinglepartComplete')
    this.uploadComplete = true
    this.uploadedBytes = this.fileRecord.size
  }

  /**
   * Uploads a multipart file
   * @private
   * TODO: should this say singlepart?
   */
  _uploadSinglepartFileComplete () {
    console.log('_uploadSinglepartFileComplete')
    this.singlePartPromise.resolve(true)
  };

  // ================================ End singlepart stuff =====================

  // ================================ Start multipart / chunk stuff =====================

  /**
   * Break a file into blobs and create a chunk object for each piece.
   * @private
   * @return {Promise} A promise which resolves when all of the pieces have completed uploading.
   */
  _createChunks () {
    // Setup an empty promise we can wait for
    let resolve, reject
    this.multiPartPromise = new Promise((_resolve, _reject) => {
      resolve = _resolve
      reject = _reject
    })

    this.file.data.on('data', this._onFileDataPiece.bind(this))
    this.file.data.on('end', this._onFileDataEnded.bind(this, resolve, reject))

    return this.multiPartPromise
  };

  /**
   * Function invoked on the `data` event of the file.
   * @private
   *
   * @param {Buffer} piece - The piece.
   */
  _onFileDataPiece (piece) {
    this.pieces.push(piece)
    this.piecesByteLength += piece.byteLength

    // Checking if the total accumulated piece byte length is greater than our maximum.
    if (this.piecesByteLength >= this.requiredChunkSize) {
      this.chunkCount++
      this.chunksByteLength += this.piecesByteLength

      let chunk = {
        partNumber: this.chunkCount,
        data: Buffer.concat(this.pieces),
        size: this.piecesByteLength
      }

      // We need to flush out our pieces, we have enough for a full chunk of data.
      this.pieces.length = 0
      this.piecesByteLength = 0

      this.chunks.push(chunk)
      this.chunkPromises.push(this._uploadChunk(chunk))
    }

  }

  /**
   * Function invoked on the `end` event of the file.
   * @private
   */
  _onFileDataEnded (resolve, reject) {
    if (this.pieces.length) {
      // We need to flush this, as we need to make the final chunk.
      this.chunkCount++
      this.chunksByteLength += this.piecesByteLength

      let chunk = {
        partNumber: this.chunkCount,
        data: Buffer.concat(this.pieces),
        size: this.piecesByteLength
      }

      this.pieces.length = 0
      this.piecesByteLength = 0

      this.chunks.push(chunk)
      this.chunkPromises.push(this._uploadChunk(chunk))
    }

    Promise.all(this.chunkPromises).then(resolve, reject)
  }

  /**
   * Create a promise chain for each chunk to be uploaded.
   * @private
   * @return {Promise} A promise which resolves when the request is complete.
   */
  _uploadChunk (chunk) {
    return this._signChunk(chunk)
      .then(this._sendChunk.bind(this, chunk))
      .then(this._completeChunk.bind(this, chunk))
  }

  /**
   * Sends a request to sign a chunk
   * @private
   * @param {object} chunk - the chunk to be signed
   */
  _signChunk (chunk) {
    const url = Utils.parseTokens(this.config.sign, {
      id: this.input.id,
      method: this.method
    })

    const request = {
      url,
      method: 'POST',
      headers: {},
      data: {
        partNumber: chunk.partNumber,
        uploadId: this.uploadId,
        contentType: 'application/octet-stream'
      }
    }

    return this._sendRequest(request)
  };

  /**
   * Receives signed response and sets correct headers then sends the chunk
   * @private
   * @param   {object}  chunk   - th eupload with data attached
   * @param   {object}  response - the signed response
   * @returns {Promise}          - a promise which resolves when chunk is sent successfully
   */
  _sendChunk (chunk, response) {
    // Step 4 and 5
    let headers = {}

    // Parse the signed chunk response
    let responseData = JSON.parse(response.data)

    // Set the proper headers to send with the file.
    headers['Content-Type'] = 'application/octet-stream'
    headers['Content-Length'] = chunk.size,
    headers['authorization'] = responseData.authHeader
    headers['x-amz-date'] = responseData.dateHeader
    headers['x-amz-security-token'] = responseData.securityToken

    const options = {
      url: responseData.url,
      method: 'PUT',
      headers,
      body: chunk.data
    }

    return new Promise((resolve, reject) => {
      return request(options, (error, response, body) => {
        if (error) {
          return reject(error)
        } else {
          return resolve(response)
        }
      })
    })
  };

  /**
   * Processes the response from _sendChunk
   * @private
   * @param {object}  chunk   - the chunk resolved
   * @param {Promise} promise - the resolved promise from _sendChunk
   */
  _completeChunk (chunk, promise) {
    this.chunksCompleted++
    chunk.complete = true
    this.uploadedBytes += chunk.size

    // Upload is complete.
    if (this.chunksComplete === this.requiredChunkCount) {
      this.uploadComplete = true
    }
  };

  /**
   * Send a request to the server letting it know we have completed the upload.
   * @private
   * @return {Promise} - resolves when send request is complete
   */
  _completeMultipartUpload () {
    // step 7
    // Early return so we don't process any of the complete information on an aborted upload.
    if (this.aborted) {
      return Utils.promisify(false, 'Upload Aborted.')
    }

    const tokens = {
      id: this.input.id
    }

    const url = Utils.parseTokens(this.config.uploadComplete, tokens)

    const request = {
      url,
      method: 'POST',
      data: {
        uploadId: this.uploadId
      }
    }

    return this._sendRequest(request)
      .then(this._onCompleteUpload.bind(this))
  };

  // ================================ end multipart / chunk stuff =====================

  // ======= util functions ==============
  _determineUploadMethod (size) {
    let signing = this.config.uploadMethods.param

    if (this._shouldBeMultipart(this.file.size)) {
      signing += this.config.uploadMethods.multiPart
    } else {
      signing += this.config.uploadMethods.singlePart
    }

    return signing
  }

  /**
   * Determines if the file should be sent as multiple parts of a single part.
   * @private
   *
   * @param {number} size - The filesize to check.
   */
  _shouldBeMultipart (size) {
    return size > (5 * 1024 * 1024)
  };

  /**
   * Sends a request and returns a callback if provided otherwise returns a promise
   * @private
   * @param {object}          options  - The options to attach to the request
   * @param {Function}        callback - Callback to be called when the request is complete.
   *
   * @return {function|Promise}        - Calls a callback if one was provide, otherwise returns a promise
   */
  _sendRequest (options, callback) {
    const useCallback = typeof (callback) === 'function'

    const promise = new RequestWrapper(options)
    if (useCallback) {
      return promise.then(data => {
        return callback(null, data)
      }).catch(error => {
        return callback(error, null)
      })
    }

    return promise
  }
}

module.exports = Uploader
