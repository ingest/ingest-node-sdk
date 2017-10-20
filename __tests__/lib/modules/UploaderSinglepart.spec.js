/* eslint-env jest */
//May not be needed
jest.mock('../../../lib/core/Request')

const UploaderSinglepart = require('../../../lib/modules/UploaderSinglepart')
const Uploader = require('../../../lib/modules/Uploader')

describe('UploaderSinglepart Tests', () => {
  const validToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIzMjUwMzU5MzYwMCIsInN1YiI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJhZG1pbiI6dHJ1ZX0.SRJ8AvhOJyJPfcl5Aqf8-ZiKVoDy72h0RwJQJzx28nI'; // eslint-disable-line

  describe('UploaderSinglepart::pause', () => {
    it('Should change pause to true and call cancel on currentChunkRequest', function (done) {
      const uploader = new UploaderSinglepart({
        api: {host: 'https://api.ingest.info', token: validToken},
        file: {
          name: 'test',
          size: 123,
          type: 'video/mp4',
          data: {} // This can be a stream or a buffer
        }
      })

      const options = {
        pass: true,
        data: {
          test: 'test'
        }
      }
      uploader.currentChunkRequest = uploader._sendRequest(options)
      console.log(uploader.currentChunkRequest)
      uploader.pause()
      done()

      expect(uploader.paused).toBeTruthy()
    })
  })
})
