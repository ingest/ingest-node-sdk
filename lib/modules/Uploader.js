'use strict'

const Request = require('../core/Request')
const Utils = require('../core/Utils')

class Uploader {
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

  // Register A callback to execute when progress is made.
  progress (callback) {
    this.config.progress = callback.bind(this)
  };

  save () {
    this._convertBufferToStream(this.file)
    return this._createInputRecord()
      .then(this._initializeInputRecord.bind(this))
      .then(this._prepareUpload.bind(this))
  }

  pause () {

  }

  resume () {

  }

  abort () {

  }

  _updateProgress (percent, chunkSize) {
    if (!this.config.progress) {
      return
    }
    this.config.progress.call(this, percent, chunkSize)
  };

  _setProgress (uploadedBytes, totalBytes) {
    let progress

    // BUGWATCH: if we change this to upload multiple chunks at once this will have to be written
    // other chunks completed data + the current chunk in the request
    progress = (this.uploadedBytes + uploadedBytes) / this.fileRecord.size
    progress *= 99
    progress = Math.round(progress)

    this._updateProgress(progress, totalBytes)
  };

  // Copied from js sdk
  // Step 1 Start, Create an input record for the file.
  _createInputRecord () {
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

  // Copied from js sdk
  // Step 1 End, Process the response from creating the input record.
  _createInputRecordSuccess (response) {
    console.log('_createInputRecordSuccess')
    this.created = true
    this._updateProgress(0, 0)
    // Store the input record.
    console.log(response.data)
    this.input = JSON.parse(response.data)
    this.fileRecord.id = this.input.id
    console.log(this.fileRecord.id)
    return this.fileRecord.id
  };

  // Mostly copied from js sdk
  // Step 2 Start, initializes the input record
  _initializeInputRecord () {
    console.log('_initializeInputRecord')
    if (this.aborted) {
      return Utils.promisify(false, 'upload aborted')
    }

    let signing = ''

    // Set the signing method.
    if (!this.fileRecord.method) {
      console.log('singlePart')
      signing = this.config.uploadMethods.param + this.config.uploadMethods.singlePart
    } else { // This wasn't there, but I think it should be, might need to be added later.
      console.log('multiPart')
      signing = this.config.uploadMethods.param + this.config.uploadMethods.multiPart
    }

    const tokens = {
      id: this.fileRecord.id,
      method: signing
    }

    const url = Utils.parseTokens(this.config.upload, tokens)

    console.log(url)

    const request = {
      url,
      method: 'POST',
      data: this.fileRecord
    }

    return this._sendRequest(request).then(this._initializeInputRecordComplete.bind(this))
  };

  // Step 2 end, deals with the return data from the initialization of the input record
  _initializeInputRecordComplete (response) {
    console.log('_initializeInputRecordComplete')
    this.initialized = true
    this.fileRecord.key = response.data.key
    this.fileRecord.uploadId = response.data.uploadId
    this.chunkSize = response.data.pieceSize
    this.chunkCount = response.data.pieceCount
  };

  // Mostly copied from js sdk
  _prepareUpload () {
    if (!this.fileRecord.method) {
      console.log('singlepart prepare')
      // Singlepart.
      return this._uploadSinglepartFile()
        .then(this._onSinglePartCompleteUpload.bind(this))
    }

    // Multipart.
    console.log('multipart')
    return this._createChunks()
      .then(this._completeMultipartUpload.bind(this))
  };

  // ================================ Start singlepart stuff =====================

  // Uploads a singlepart file
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

    // Have to convert the stream into a buffer.
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

  _onSinglePartCompleteUpload () {
    console.log('_onSinglePartCompleteUpload')
    // Send the final progress update once the upload is actually complete.
    this._updateProgress(100)

    this.uploadComplete = true
    this.multiPartPromise = null
    this.requestPromise = null
    this.singlePartPromise = null
    return this.fileRecord.id
  };

  _sendSinglepartComplete () {
    console.log('_sendSinglepartComplete')
    this.uploadComplete = true
    this.uploadedBytes = this.fileRecord.size
  }

  // Uploads a multipart file
  _uploadSinglepartFileComplete () {
    console.log('_uploadSinglepartFileComplete')
    this.singlePartPromise.resolve(true)
  };

  // ================================ End singlepart stuff =====================

  // ================================ Start multipart / chunk stuff =====================

  _createChunks () {
    console.log('_createChunks')
    let i, blob, chunk, start, end,
      chunkPromises = []

    if (this.aborted) {
      this.abort()
      return Promise.reject('upload aborted')
    }

    let chunkIndex = 0

    // Add each data chunk as a promise as it comes in, these may be smaller that 5mb, which might mean it needs to be changed to read 5mb chunks at a time.
    this.file.data.on('data', (streamChunk) => {
      console.log(chunkIndex)
      chunkIndex += 1

      chunk = {
        partNumber: chunkIndex,
        data: blob
      }

      this.chunks.push(chunk)

      // This is the same, except for the call part.
      chunkPromises.push(this._uploadChunk.bind(this, chunk).call())
    })

    // Setup an empty promise we can wait for
    let resolveP, rejectP
    this.multiPartPromise = new Promise((resolve, reject) => {
      resolveP = resolve
      rejectP = reject
    })

    // When the data is finished resolve the promise.
    this.file.data.on('end', () => {
      console.log('data end')

      // Wait for all the chunks to finish, then resolve the promise.
      Promise.all(chunkPromises).then(resolveP).catch(rejectP)
    })

    console.log(2)

    // Store a reference for pausing and resuming.
    return this.multiPartPromise
  };

  // Copied from js sdk
  _uploadChunk (chunk) {
    console.log('_uploadChunk')
    return this._signChunk(chunk)
      .then(this._sendChunk.bind(this, chunk))
      .then(this._completeChunk.bind(this, chunk))
  }

  // Step 3 sends request to get sign for chunk
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
    } else {
      // This is new, I think it should be here
      signing = this.config.uploadMethods.param + this.config.uploadMethods.multiPart
    }

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

    console.log(request.url)

    return this._sendRequest(request)
  };

  // Step 4 and 5, Receives sign response and sets correct headers then sends the chunk
  _sendChunk (upload, response) {
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

  // Process the response from _sendChunk
  _completeChunk (chunk, promise) {
    console.log('complete chunk')
    this.chunksComplete++
    chunk.complete = true
    this.uploadedBytes += chunk.data.size

    // Upload is complete.
    if (this.chunksComplete === this.chunkCount) {
      this.uploadComplete = true
    }

    // Resolve the promise.
    promise(true, [])
  };

  // Step 7, Send a request to the server letting them know we have completed the upload.
  _completeMultipartUpload () {
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
   */
  _convertBufferToStream (file) {
    if (Buffer.isBuffer(file.data)) {
      // Make a new empty stream
      let stream = new stream.PassThrough()
      // Add our buffer file data to the stream
      stream.end(file.data)
      // Replace the file object with the new stream.
      file.data = stream
    }
  }

  // Determines if the file should be sent as multiple parts of a single part.
  _checkMultipart (file) {
    if (!file) {
      throw new Error('Upload::_checkMultipart - A file object is required.')
    }

    return file.size > (5 * 1024 * 1024)
  };

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
