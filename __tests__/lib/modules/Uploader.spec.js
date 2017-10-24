/* eslint-env jest */
jest.mock('../../../lib/modules/UploaderSinglepart', () => require('../../../_mocks_/UploaderSinglepart.js'))
jest.mock('../../../lib/modules/UploaderMultipart', () => require('../../../_mocks_/UploaderMultipart.js'))
jest.mock('../../../lib/core/Request', () => require('../../../_mocks_/Request.js'))

const Uploader = require('../../../lib/modules/Uploader')
const UploaderSinglepart = require('../../../lib/modules/UploaderSinglepart')
const UploaderMultipart = require('../../../lib/modules/UploaderMultipart')

describe('Uploader Tests', () => {
  const validToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIzMjUwMzU5MzYwMCIsInN1YiI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJhZG1pbiI6dHJ1ZX0.SRJ8AvhOJyJPfcl5Aqf8-ZiKVoDy72h0RwJQJzx28nI'; // eslint-disable-line

  describe('Uploader::constructor', () => {
    it('Should return an error message if options are not passed in', function () {
      expect(() => {
        const uploader = new Uploader()  // eslint-disable-line no-unused-vars
      }).toThrow()
    })

    it('Should create a new SinglePartUploader', () => {
      const uploader = new Uploader({
        api: {host: 'https://api.ingest.info', token: validToken},
        file: {
          name: 'test',
          size: 123,
          type: 'video/mp4',
          data: {} // This can be a stream or a buffer
        }
      })

      expect(uploader).toBeInstanceOf(UploaderSinglepart)
    })

    it('Should create a new MultiPartUploader', () => {
      const uploader = new Uploader({
        api: {host: 'https://api.ingest.info', token: validToken},
        file: {
          name: 'test',
          size: 123000000,
          type: 'video/mp4',
          data: {} // This can be a stream or a buffer
        }
      })

      expect(uploader).toBeInstanceOf(UploaderMultipart)
    })
  })
})
