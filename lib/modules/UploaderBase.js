'use strict'

const request = require('request')
const RequestWrapper = require('../core/Request')
const Utils = require('../core/Utils')

/**
 * Create a base upload wrapper.  Manages the upload of a file.
 * @class
 * @param   {object}  options                   Configuration options to override the defaults.
 * @param   {object}  options.api               A reference to the parent API instance.
 * @param   {object}  options.file              The file to upload.
 * @param   {object}  options.upload            REST endpoint for creating an input.
 * @param   {object}  options.sign              REST endpoint for signing a blob before upload.
 * @param   {object}  options.uploadComplete    REST endpoint to notify the API that the upload is complete.
 * @param   {object}  options.uploadAbort       REST endpoint to abort the upload.
 */
class UploaderBase {
  /**
   * @constructor
   * @param {object} options      - the options passed in to be uploaded
   */
  constructor(options) {
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
    this.method = this._getUploadMethod()

    this.input = null

    this.uploadId = ''
    this.key = ''

    this.uploadedBytes = 0

    this.aborted = false
    this.paused = false
    this.created = false
    this.initialized = false
    this.uploadComplete = false

    this.pauseCount = 0

    // The request object for the chunk that is currently uploading
    this.currentChunkRequest = null
  }

  /**
   * Aborts an input upload
   *
   * @return {Promise} A promise which resolves when the request is complete.
   */
  abort() { }

  /**
   * Register a function to execute when a chunk completes uploading.
   * @param  {Function} callback A callback to execute when progress is made.
   */
  progress(callback) {
    this.config.progress = callback
  }

  /**
   * Create a new input record and upload the files to Amazon.
   * @return  {Promise} A promise which resolves when the new input record is created and uploaded.
   */
  save() {
    return this._createInputRecord()
      .then(this._initializeInputRecord.bind(this))
      .then(this._uploadInputRecord.bind(this))
  }

  /**
   * Abstract method to pause an input record upload
   * @abstract
   */
  pause() {
    throw new Error('pause unimplemented')
  }

  /**
   * Abstract method to resume an input record upload
   * @abstract
   */
  resume() {
    throw new Error('resume unimplemented')
  }

  /**
   * @abstract
   */
  _abortActiveRequests() {
    throw new Error('_abortActiveRequests unimplemented')
  }

  /**
   * Delete the input that was created when upload is aborted
   * @private
   * @return {Promise} A promise which resolves when the request is complete.
   */
  _abortComplete() {
    return this.api.Inputs.delete(this.input.id)
  }

  /**
   * Call the progress callback and pass the current progress percentage.
   * @private
   * @param  {number} percent   Current progress percentage.
   * @param  {number} chunkSize Size of chunk processed
   */
  _updateProgress(percent, chunkSize) {
    if (!this.config.progress) {
      return
    }
    this.config.progress(percent, chunkSize)
  }

  /**
   * Calculates progress then calls the update progress function
   * @private
   * @param {number} uploadedBytes - bytes that have been uploaded
   * @param {number} totalBytes    - total bytes of the file
   */
  _setProgress(uploadedBytes, totalBytes) {
    let progress

    // BUGWATCH: if we change this to upload multiple chunks at once this will have to be written
    // other chunks completed data + the current chunk in the request
    progress = (this.uploadedBytes + uploadedBytes) / this.file.size
    progress *= 99
    progress = Math.round(progress)

    this._updateProgress(progress, totalBytes)
  }

  /**
   * Creates an input record for the file
   * @private
   * @return  {Promise}  A promise which resolves when the new input record is created.
   */
  _createInputRecord() {
    if (this.created) {
      // If we already created the input record, don't do it again
      return Promise.resolve(this.input.id)
    }

    if (this.aborted) {
      // If upload has been aborted, don't create input record
      return Promise.reject('Upload Aborted')
    }

    return this.api.Inputs.add({
      filename: this.file.name,
      type: this.file.type,
      size: this.file.size
    }).then(this._createInputRecordSuccess.bind(this))
  }

  /**
   * Process the response from successfully creating an input record
   * @private
   * @param  {object}  response - the response to be processed
   * @return {string}           - the file record id
   */
  _createInputRecordSuccess(response) {
    let input = JSON.parse(response.data)

    this.created = true
    this._updateProgress(0, 0)

    // Store the input record.
    this.input = input

    return input.id
  }

  /**
   * Initializes an input record for upload
   * @private
   * @return {Promise} A promise which resolves when the request is complete.
   */
  _initializeInputRecord() {
    // Step 2 Start, initializes the input record
    if (this.aborted) {
      return Promise.reject('Upload Aborted')
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

    return this._sendRequest(request).request.then(this._initializeInputRecordComplete.bind(this))
  }

  /**
   * Store the information returned from the initialize request.
   * @private
   * @param {object} response - the information returned from _initializeInputRecord
   * @returns {object} - the parsed response data
   */
  _initializeInputRecordComplete(response) {
    const data = JSON.parse(response.data)

    this.initialized = true
    this.uploadId = data.uploadId
    this.key = data.key

    return data
  }

  /**
   * Abstract method that throws an error if unsuccessful
   * @abstract
   * @private
   */
  _uploadInputRecord() {
    throw new Error('_uploadInputRecord unimplemented')
  }

  /** ------------------------------- Singlepart upload methods ------------------------------- **/

  /**
   * Called when the upload is complete
   * @private
   * @return {string} - the fileRecord id
   */
  _onCompleteUpload() {
    // Send the final progress update once the upload is actually complete.
    this._updateProgress(100)
    this.uploadComplete = true
    return this.input.id
  }

  /** --------------------- Chunk sending for Multipart/Singlepart Uploads --------------------- **/

  /**
   * Create a promise chain for each chunk to be uploaded.
   * @private
   * @return {Promise} A promise which resolves when the request is complete.
   */
  _uploadChunk(chunk) {
    return this._signChunk(chunk)
      .then(this._sendChunk.bind(this, chunk))
      .then(this._completeChunk.bind(this, chunk))
  }

  /**
   * Sends a request to sign a chunk
   * @private
   * @param {object} chunk - the chunk to be signed
   */
  _signChunk(chunk) {
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

    this.currentChunkRequest = this._sendRequest(request)

    return this.currentChunkRequest.request
  }

  /**
   * Receives signed response and sets correct headers then sends the chunk
   * @private
   * @param   {object}  chunk   - th eupload with data attached
   * @param   {object}  response - the signed response
   * @returns {Promise}          - a promise which resolves when chunk is sent successfully
   */
  _sendChunk(chunk, response) {
    let headers = {}

    // Parse the signed chunk response
    let responseData = JSON.parse(response.data)

    // Set the proper headers to send with the file.
    headers['Content-Type'] = 'application/octet-stream'
    headers['Content-Length'] = chunk.size
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
      // Store the request so it can be aborted if needed
      this.currentChunkRequest = request(options, (error, response, body) => {
        if (error) {
          return reject(error)
        } else {
          return resolve(response)
        }
      })
    })
  }

  /**
   * Processes the response from _sendChunk
   * @private
   * @param {object}  chunk   - the chunk resolved
   * @param {Promise} promise - the resolved promise from _sendChunk
   */
  _completeChunk(chunk, promise) {
    chunk.complete = true
    this.currentChunkRequest = null
    this.uploadedBytes += chunk.size
  }

  /** --------------------------- Util Functions --------------------------- **/

  /**
   * @abstract
   * @param {number} size
   */
  _getUploadMethod(size) {
    throw new Error('_getUploadMethod not implemented')
  }

  /**
   * Sends a request and returns a callback if provided otherwise returns a promise
   * @private
   * @param {object}          options  - The options to attach to the request
   * @param {Function}        callback - Callback to be called when the request is complete.
   *
   * @return {function|Promise}        - Calls a callback if one was provide, otherwise returns a promise
   */
  _sendRequest(options, callback) {
    const useCallback = typeof (callback) === 'function'

    const promise = new RequestWrapper(options)

    if (useCallback) {
      return promise.request.then(data => {
        return callback(null, data)
      }).catch(error => {
        return callback(error, null)
      })
    }

    return promise
  }
}

module.exports = UploaderBase
