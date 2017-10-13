'use strict'

const Request = require('../core/Request')
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
      file: null, // This can be a stream or a buffer,
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

    this.chunks = []
    this.chunkSize = 0
    this.chunkCount = 0
    this.chunksComplete = 0
    this.uploadedBytes = 0

    this.aborted = false
    this.paused = false
    this.created = false
    this.initialized = false

    // Set to true when all the chunks are uploaded, but before the complete call is made.
    this.uploadComplete = false

    this.fileRecord = {
      filename: this.file.name,
      type: this.file.type,
      size: this.file.size, // in bytes
      method: this._checkMultipart(this.file),
      contentType: 'application/octet-stream'
    }
  }

  /**
   * Register a function to execute when a chunk completes uploading.
   * @param  {Function} callback A callback to execute when progress is made.
   */
  progress (callback) {
    this.config.progress = callback.bind(this)
  };

  /**
   * Create a new input record and upload the files to amazon.
   * @return  {Promise}         A promise which resolves when the new input record is created and uploaded.
   */
  save () {
    // this._convertBufferToStream(this.file)
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
    this.config.progress.call(this, percent, chunkSize)
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
    progress = (this.uploadedBytes + uploadedBytes) / this.fileRecord.size
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
    console.log('_createInputRecord')
    if (this.created) {
      // If we already did it, don't do it again
      return Utils.promisify(true, this.fileRecord.id)
    }

    if (this.aborted) {
      // If this has been aborted, don't do it again.
      return Utils.promisify(false, 'upload aborted')
    }

    // Actually make the call.
    return this.api.Inputs.add(this.fileRecord)
      .then(this._createInputRecordSuccess.bind(this))
  }

  /**
   * Process the response from creating an input record (end step 1)
   * @private
   * @param  {object}  response - the response to be processed
   * @return {string}           - the file record id
   */
  _createInputRecordSuccess (response) {
    console.log('_createInputRecordSuccess')
    this.created = true
    this._updateProgress(0, 0)
    // Store the input record.
    this.input = JSON.parse(response.data)
    this.fileRecord.id = this.input.id
    console.log(this.fileRecord.id)
    return this.fileRecord.id
  };

  /**
   * Initializes an Input for upload
   * @private
   * @return {Promise} A promise which resolves when the request is complete.
   */
  _initializeInputRecord () {
    // Step 2 Start, initializes the input record
    console.log('_initializeInputRecord')
    if (this.aborted) {
      return Utils.promisify(false, 'upload aborted')
    }

    let signing = ''

    // Set the signing method.
    if (!this.fileRecord.method) {
      console.log('singlePart')
      signing = this.config.uploadMethods.param + this.config.uploadMethods.singlePart
    } else {
      console.log('multiPart')
      signing = this.config.uploadMethods.param + this.config.uploadMethods.multiPart
    }

    const tokens = {
      id: this.fileRecord.id,
      method: signing
    }

    const url = Utils.parseTokens(this.config.upload, tokens)

    const request = {
      url,
      method: 'POST',
      data: this.fileRecord
    }

    return this._sendRequest(request).then(this._initializeInputRecordComplete.bind(this))
  };

  /**
   * Store the information returned from the initialize request.
   * @private
   * @param {object} response - the information returned from _initializeInputRecord
   */
  _initializeInputRecordComplete (response) {
    // Step 2 end
    console.log('_initializeInputRecordComplete')
    response.data = JSON.parse(response.data)
    this.initialized = true
    this.fileRecord.key = response.data.key
    this.fileRecord.uploadId = response.data.uploadId
    this.chunkSize = response.data.pieceSize
    this.chunkCount = response.data.pieceCount

    console.log('chunk size: ' + this.chunkSize)
    console.log('chunk count: ' + this.chunkCount)
  };

  /**
   * Setup the upload depending on its type, single or multi part.
   * @private
   * @return {Promise} A promise which resolves when all of the pieces have completed uploading.
   */
  _prepareUpload () {
    if (!this.fileRecord.method) {
      console.log('singlepart prepare')
      // Singlepart.
      return this._uploadSinglepartFile()
        .then(this._onCompleteUpload.bind(this))
    }

    // Multipart.
    console.log('multipart')
    return this._createChunks()
      .then(() => {
        console.log('create chunks resolved!')
        this._completeMultipartUpload()
      })
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
    console.log('_onCompleteUpload')
    // Send the final progress update once the upload is actually complete.
    this._updateProgress(100)

    this.uploadComplete = true
    this.multiPartPromise = null
    this.requestPromise = null
    this.singlePartPromise = null
    return this.fileRecord.id
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
    console.log('_createChunks')
    let i
    let blob
    let chunk
    let start
    let end
    let chunkPromises = []

    if (this.aborted) {
      return Promise.reject('upload aborted')
    }

    // Setup an empty promise we can wait for
    let resolveP, rejectP
    this.multiPartPromise = new Promise((resolve, reject) => {
      resolveP = resolve
      rejectP = reject
    })

    let chunkIndex = 0
    // As data comes in. build a chunk that is 5mb, when it reaches 5mb, send it and start a new chunk.
    this.file.data.on('data', (streamChunk) => {
      // Create a new chunk if needed
      if (chunk === null || chunk === undefined) {
        chunkIndex += 1

        chunk = {
          partNumber: chunkIndex,
          data: null, // will be defined when this is completely downloaded
          pieces: [],
          size: 0 // Running total of piece sizes.
        }
      }

      // Process the data from the stream
      chunk.pieces.push(streamChunk)
      chunk.size += streamChunk.byteLength

      // console.log('running size: ' + chunk.size)

      // Once the total size of the pieces is greater than the recommended chunk size, combine them and send the chunk
      if (chunk.size >= this.chunkSize) {
        chunk.data = Buffer.concat(chunk.pieces)
        console.log(chunk.data.byteLength);
        console.log(`part: ${chunk.partNumber}, size: ${chunk.size}`);
        delete chunk.pieces
        delete chunk.size
        this.chunks.push(chunk)

        // Call upload chunk and add it to our array of promises
        chunkPromises.push(this._uploadChunk(chunk))
        chunk = null
      }
    })
    // When the data is finished resolve the promise.
    this.file.data.on('end', () => {
      // Add the last chunk if it exists and hasn't been sent
      if (chunk) {
        console.log('ending chunk sent')
        //TODO: this line was causing it to be double in size at 20mb
        chunk.data = Buffer.concat(chunk.pieces)
        console.log(chunk.data.byteLength);
        console.log(`part: ${chunk.partNumber}, size: ${chunk.size}`);
        delete chunk.pieces
        delete chunk.size
        this.chunks.push(chunk)
        chunkPromises.push(this._uploadChunk(chunk))
        chunk = null
      }

      this.chunkCount = chunkIndex

      // Wait for all the chunks to finish, then resolve the promise.
      Promise.all(chunkPromises).then(resolveP).catch(rejectP)
    })

    // If small tiny chunks are okay, uncomment this. and comment out above
    // let chunkIndex = 0
    // // Add each data chunk as a promise as it comes in, these may be smaller that 5mb, which might mean it needs to be changed to read 5mb chunks at a time.
    // this.file.data.on('data', (streamChunk) => {
    //   console.log(chunkIndex);
    //   chunkIndex += 1

    //   chunk = {
    //     partNumber: chunkIndex,
    //     data: blob
    //   }

    //   this.chunks.push(chunk)

    //   // This is the same, except for the call part.
    //   chunkPromises.push(this._uploadChunk.bind(this, chunk).call())
    // })
    // When the data is finished resolve the promise.
    // this.file.data.on('end', () => {
    //   console.log('data end')

    //   // Wait for all the chunks to finish, then resolve the promise.
    //   Promise.all(chunkPromises).then(resolveP).catch(rejectP)
    // })

    // Store a reference for pausing and resuming.
    return this.multiPartPromise
  };

  /**
   * Create a promise chain for each chunk to be uploaded.
   * @private
   * @return {Promise} A promise which resolves when the request is complete.
   */
  _uploadChunk (chunk) {
    console.log('_uploadChunk')
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
    console.log('_signChunk')
    let signing = ''
    let headers = {}

    // Set the part number for the current chunk.
    if (chunk.partNumber) {
      this.fileRecord.partNumber = chunk.partNumber
    }

    headers['Content-Type'] = 'multipart/form-data'

    if (!this.fileRecord.method) {
      signing = this.config.uploadMethods.param + this.config.uploadMethods.singlePart
    }
    // else {
    //   // I think this should be here ?
    //   signing = this.config.uploadMethods.param + this.config.uploadMethods.multiPart
    // }

    const url = Utils.parseTokens(this.config.sign, {
      id: this.fileRecord.id,
      method: signing
    })

    const request = {
      url,
      method: 'POST',
      headers,
      data: this.fileRecord
    }

    // console.log(request)

    return this._sendRequest(request)
  };

  /**
   * Receives signed response and sets correct headers then sends the chunk
   * @private
   * @param   {object}  upload   - th eupload with data attached
   * @param   {object}  response - the signed response
   * @returns {Promise}          - a promise which resolves when chunk is sent successfully
   */
  _sendChunk (upload, response) {
    // Step 4 and 5
    console.log('_sendChunk')
    let headers = {}

    // Parse the signed chunk response
    let responseData = JSON.parse(response.data)

    // Set the proper headers to send with the file.
    headers['Content-Type'] = this.fileRecord.contentType
    headers['Content-Length'] = this.fileRecord.size

    headers.authorization = responseData.authHeader
    headers['x-amz-date'] = responseData.dateHeader
    headers['x-amz-security-token'] = responseData.securityToken

    console.log(responseData.url)

    // console.log(upload.data.toString());

    //console.log(Buffer.isBuffer(upload.data));

    //console.log(upload.data.toString('ascii'));

    const request = {
      url: responseData.url,
      method: 'PUT',
      headers,
      data: upload.data, // This may need to be changed to upload.data.data, or upload.data.data may need to be converted to a string with .toString
      ignoreAcceptHeader: true,
      requestProgress: this._setProgress.bind(this)
    }

    this.requestPromise = this._sendRequest(request)

    this.requestPromise.catch(err => {
      console.log('request err')
      console.log(JSON.stringify(err))
    })

    return this.requestPromise
  };

  /**
   * Processes the response from _sendChunk
   * @private
   * @param {object}  chunk   - the chunk resolved
   * @param {Promise} promise - the resolved promise from _sendChunk
   */
  _completeChunk (chunk, promise) {
    console.log('complete chunk ' + (this.chunksComplete + 1) + ' of ' + this.chunkCount)

    this.chunksComplete++
    chunk.complete = true
    // this.uploadedBytes += chunk.data.size

    // Upload is complete.
    if (this.chunksComplete === this.chunkCount) {
      console.log('marking upload complete')
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
    console.log('_completeMultipartUpload')
    // Early return so we don't process any of the complete information on an aborted upload.
    if (this.aborted) {
      return Utils.promisify(false, 'Upload Aborted.')
    }

    const tokens = {
      id: this.fileRecord.id
    }

    const url = Utils.parseTokens(this.config.uploadComplete, tokens)

    const request = {
      url,
      method: 'POST',
      data: this.fileRecord
    }

    // return this.sendRequest(options, callback)
    return this._sendRequest(request)
            .then(this._onCompleteUpload.bind(this))
  };

  // ================================ end multipart / chunk stuff =====================

  // ======= util functions ==============

  /**
   * Checks if the file is a buffer (a normal file) and converts it to a stream if it is.
   * @private
   * @param {object} - the file object used to convert buffer to stream
   */
  _convertBufferToStream (file) {
    //console.log('HELLLLLOOOOOOOOO', Buffer.isBuffer(file.data))
    if (Buffer.isBuffer(file.data)) {
      // Make a new empty stream
      let stream = new stream.PassThrough()
      // Add our buffer file data to the stream
      stream.end(file.data)
      // Replace the file object with the new stream.
      file.data = stream
    }
  }

  /**
   * Determines if the file should be sent as multiple parts of a single part.
   * @private
   * @param {object} file - the file being checked
   */
  _checkMultipart (file) {
    if (!file) {
      throw new Error('Upload::_checkMultipart - A file object is required.')
    }

    return file.size > (5 * 1024 * 1024)
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

    const promise = new Request(options)
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
