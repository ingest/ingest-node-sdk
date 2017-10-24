'use strict'

const Utils = require('../core/Utils')
const SerialPromises = require('./SerialPromises')
const UploaderBase = require('./UploaderBase')

/**
 * Create a Multipart Upload wrapper to manage multipart uploads
 * @class
 * @param   {object}  options                   Configuration options to override the defaults.
 * @param   {object}  options.api               A reference to the parent API instance.
 * @param   {object}  options.file              The file to upload.
 * @param   {object}  options.upload            REST endpoint for creating an input.
 * @param   {object}  options.sign              REST endpoint for signing a blob before upload.
 * @param   {object}  options.uploadComplete    REST endpoint to notify the API that the upload is complete.
 * @param   {object}  options.uploadAbort       REST endpoint to abort the upload.
 */
class UploaderMultipart extends UploaderBase {
  /**
   * @constructor
   * @param {object} options      - the options passed in to the upload
   */
  constructor (options) {
    // calls the constructor of the UploaderBase class
    super(options)

    this.requiredChunkCount = 0
    this.requiredChunkSize = 0

    this.pieces = []
    this.piecesByteLength = 0

    this.chunks = []
    this.chunkPromises = []
    this.chunkCount = 0
    this.chunksCompleted = 0
    this.chunksByteLength = 0

    this.serialPromise = null
  }

  /* --------------------------------- Overrides ------------------------------ */

  /**
   * Overrides the UploaderBase pause method to pause a multipart input record
   * @override
   */
  pause () {
    // Return early if the upload portion is complete.
    if (this.uploadComplete) {
      return
    }

    this.paused = true

    // Is there a multipart upload
    if (this.serialPromise) {
      // Pause the series if its a multipart upload.
      this.serialPromise.pause()
    }
  }

  /**
   * Overrides the UploaderBase pause method to pause a multipart input record
   * @override
   */
  resume () {
    this.paused = false

    if (this.serialPromise) {
      this.serialPromise.resume()
    } else {
      console.error('Cannot resume multipart')
    }
  }

  /**
   * Overrides the _initializeInputRecordComplete of the UploaderBase classe
   * to store the information returned from the initialize request for multipart
   * upload
   * @override
   * @private
   * @param {object} response - the information returned from _initializeInputRecord
   */
  _initializeInputRecordComplete (response) {
    const data = super._initializeInputRecordComplete(response)

    this.requiredChunkSize = data.pieceSize
    this.requiredChunkCount = data.pieceCount
  }

  /**
   *  Overrides _uploadInputRecord in UploaderBase class to
   * setup the upload for multi part
   * @override
   * @private
   * @return {Promise} A promise which resolves when all of the pieces have completed uploading.
   */
  _uploadInputRecord () {
    return this._createChunks().then(this._completeMultipartUpload.bind(this))
  }

  /**
   * Overrides the _onCompleteUpload in the UploaderBase class to
   * reset serialPromise to null when the multipart upload is complete
   * @override
   * @private
   * @return {string} - The base class version of _onCompleteUpload
   */
  _onCompleteUpload () {
    this.serialPromise = null
    return super._onCompleteUpload()
  }

  /**
   * Overrides the _completeChunk method in the UploaderBase class to
   * increment the counter for chunks uploaded
   * @override
   * @private
   * @param {object}  chunk   - the chunk resolved
   * @param {Promise} promise - the resolved promise from _sendChunk
   */
  _completeChunk (chunk, promise) {
    super._completeChunk(chunk, promise)
    this.chunksCompleted++
    // Upload is complete.
    if (this.chunksComplete === this.requiredChunkCount) {
      this.uploadComplete = true
    }
  }

  /**
   * Overrides the abstract _getUploadMethod in the UploaderBase class
   * to add the appropriate endings for multipart uploads
   * @param {number} size
   */
  _getUploadMethod (size) {
    return this.config.uploadMethods.param + this.config.uploadMethods.multiPart
  }

  /**
   * @override
   */
  _abortActiveRequests () {
    if (this.serialPromise) {
      this.serialPromise.cancel()
      this.serialPromise = null
    }

    if (this.currentChunkRequest) {
      this.currentChunkRequest.abort()
      this.currentChunkRequest = null
    }
  }

  /**
   * Aborts a multipart input upload
   *
   * @return {Promise} A promise which resolves when the request is complete.
   */
  abort () {
    let url
    let tokens
    let request

    this.aborted = true

    // If initialize hasn't been called yet we don't need to abort because upload doesn't exist yet
    if (!this.initialized) {
      if (this.created) {
        // If the input has been created return early with a
        // promise to delete the created input record.
        return this.api.Inputs.delete(this.input.id)
      }

      // Resolve as a successful promise. This case would be fulfilled when an upload
      // has been created but save() hasn't yet been called.
      return Promise.resolve()
    }

    if (this.serialPromise) {
      this.serialPromise.cancel()
      this.serialPromise = null
    }

    tokens = {
      id: this.input.id,
      method: ''
    }

    let data = {
      uploadId: this.uploadId
    }

    url = Utils.parseTokens(this.config.uploadAbort, tokens)

    request = {
      url,
      method: 'POST',
      data: data
    }

    return this._sendRequest(request).request
      .then(this._abortComplete.bind(this))
  }

  /** ----------------------------- Start multipart specific methods ---------------------------- */

  /**
   * Break a file into blobs and create a chunk object for each piece.
   * @private
   * @return {Promise} A promise which resolves when all of the pieces have completed uploading.
   */
  _createChunks () {
    // Setup an empty promise we can wait for
    this.serialPromise = new SerialPromises()

    this.file.data.on('data', this._onFileDataPiece.bind(this))
    this.file.data.on('end', this._onFileDataEnded.bind(this))

    return this.serialPromise.getPromise()
  }

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
      this._flushPiecesToChunk()
    }
  }

  /**
   * Function invoked on the `end` event of the file.
   * @private
   */
  _onFileDataEnded () {
    if (this.pieces.length) {
      // We need to flush this, as we need to make the final chunk.
      this._flushPiecesToChunk()
    }

    // We are done adding callbacks, close the queue
    this.serialPromise.closeQueue()
  }

  /**
   * The total accumulated piece byte length is greater than our maximum
   * so we push the chunk
   * @private
   */
  _flushPiecesToChunk () {
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

    // Add the callback to the queue.
    this.serialPromise.enqueue(this._uploadChunk.bind(this, chunk))
  }

  /**
   * Send a request to the server letting it know we have completed the multipart upload.
   * @private
   * @return {Promise} - resolves when send request is complete
   */
  _completeMultipartUpload () {
    // Early return so we don't process any of the complete information on an aborted upload.
    if (this.aborted) {
      const error = new Error('Upload Aborted')
      return Promise.reject(error)
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

    return this._sendRequest(request).request
      .then(this._onCompleteUpload.bind(this))
  }
}

module.exports = UploaderMultipart
