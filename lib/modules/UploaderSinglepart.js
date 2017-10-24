'use strict'

const UploaderBase = require('./UploaderBase')

/**
 * Create a new singlepart upload wrapper.  Manages the entire upload of a file.
 * @class
 * @param   {object}  options                   Configuration options to override the defaults.
 * @param   {object}  options.api               A reference to the parent API instance.
 * @param   {object}  options.file              The file to upload.
 * @param   {object}  options.upload            REST endpoint for creating an input.
 * @param   {object}  options.sign              REST endpoint for signing a blob before upload.
 * @param   {object}  options.uploadComplete    REST endpoint to notify the API that the upload is complete.
 * @param   {object}  options.uploadAbort       REST endpoint to abort the upload.
 */
class UploaderSinglepart extends UploaderBase {
  /**
   * @constructor
   * @param {object} options      - the options passed in to be uploaded
   */
  constructor (options) {
    super(options)

    this.singlePartPromise = null
    this.singlePartResolve = null
    this.singlePartReject = null

    this.pauseCount = 0
  }

  /** --------------------- Overrides --------------------- **/

  /**
   * Pause an input record
   * @override
   * @return  {Promise}         A promise which resolves when the input record is paused.
   */
  pause () {
    // Return early if the upload portion is complete.
    if (this.uploadComplete) {
      return
    }

    this.paused = true
    this.currentChunkRequest.cancel()
  }

  /**
   * Overrides the resume method in the UploaderBase Class
   * @override
   * @return  {Promise}  A promise which resolves when the input record is paused.
   */
  resume () {
    this.paused = false

    if (this.singlePartPromise) {
      this._sendSinglePart()
    }
  }

  /**
   * Overrides the _uploadInputRecord in UploaderBase
   *
   * @override
   * @private
   * @return {Promise} A promise which resolves when all of the pieces have completed uploading.
   */
  _uploadInputRecord () {
    return this._uploadSinglepartFile().then(this._onCompleteUpload.bind(this))
  }

  /**
   * Overrides the UploaderBase class _onCompleteUpload method
   * to set singlePartPromise to null after upload is complete
   *
   * @override
   * @private
   * @return {Function} - calls the UploaderBase _onCompleteUpload
   */
  _onCompleteUpload () {
    this.singlePartPromise = null
    return super._onCompleteUpload()
  }

  /**
   * Overrides the abstract _getUploadMethod in the UploaderBase class
   * to add the appropriate endings for singlepart uploads
   * @param {number} size
   */
  _getUploadMethod (size) {
    return this.config.uploadMethods.param + this.config.uploadMethods.singlePart
  }

  /**
   * @override
   */
  _abortActiveRequests () {
    if (this.currentChunkRequest) {
      this.currentChunkRequest.abort()
      this.currentChunkRequest = null
    }
    this.singlePartPromise = null
  }

  /**
   * Aborts a singlepart input upload
   *
   * @return {Promise} A promise which resolves when the request is complete.
   */
  abort () {
    this.aborted = true

    // If initialize hasn't been called yet, don't abort because upload doesn't exist yet
    if (!this.initialized) {
      // If the input has been created return early with a
      // promise to delete the created input record.
      if (this.created) {
        return this.api.Inputs.delete(this.input.id)
      }

      // Resolve as a successful promise. This case would be fulfilled when an upload
      // has been created but save() hasn't yet been called.
      return Promise.resolve(true)
    }

    // Do an aborting action for any requests
    this._abortActiveRequests()

    return this._abortComplete()
  }

  /** ----------------------------- Start singlepart specific methods ---------------------------- */

  /**
   * Uploads a singlepart file
   * @private
   * @returns {Promise}
   */
  _uploadSinglepartFile () {
    // Create a new promise if one doesn't exist.
    this.singlePartPromise = new Promise((resolve, reject) => {
      this.singlePartResolve = resolve
      this.singlePartReject = reject
    })

    // Convert the stream into a buffer.
    const stream = this.file.data
    const chunks = []

    // For every chunk of data add it to an array
    stream.on('data', chunk => chunks.push(chunk))
    // Combine the chunks into a data buffer and send them
    stream.on('end', () => {
      this.file.data = Buffer.concat(chunks)
      this._sendSinglePart()
    })

    return this.singlePartPromise
  }

  /**
   * Sends the file, resolving the singlePartPromise when it's done
   */
  _sendSinglePart () {
    // This allows us to cancel singlepart uploads without breaking the initial chain.
    this._signChunk(this.file)
      .then((response) => {
        return this._sendChunk(this.file, response)
      })
      .then(this._sendSinglepartComplete.bind(this))
      .then(this._updateProgress.bind(this, 100, this.input.size))
      .then(() => this.singlePartResolve())
      .catch((err) => {
        this.singlePartReject(err)
        console.error(err)
      })
  }

  /**
   * Update the upload bytes value when a single part file is uploaded.
   * @private
   */
  _sendSinglepartComplete () {
    this.uploadComplete = true
    this.uploadedBytes = this.input.size
  }

  /**
   * Resolves singlePartPromise when the upload is complete
   * @private
   */
  _uploadSinglepartFileComplete () {
    this.singlePartPromise.resolve(true)
  }
}

module.exports = UploaderSinglepart
