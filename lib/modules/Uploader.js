'use strict'

const UploaderMultipart = require('./UploaderMultipart')
const UploaderSinglepart = require('./UploaderSinglepart')

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
    if (!options || !options.file || !options.file.size) {
      throw new Error('File size must be provided for the Ingest Uploader')
    }

    if (this._shouldBeMultipart(options.file.size)) {
      return new UploaderMultipart(options)
    } else {
      return new UploaderSinglepart(options)
    }
  }

  /**
   * Determines if the file should be sent as multiple parts of a single part.
   * @private
   *
   * @param {number} size - The filesize to check.
   */
  _shouldBeMultipart (size) {
    return size > (5 * 1024 * 1024)
  }
}

module.exports = Uploader
