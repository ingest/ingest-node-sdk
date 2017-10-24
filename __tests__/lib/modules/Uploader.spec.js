/* eslint-env jest */
jest.mock('../../../lib/core/Request')

const Uploader = require('../../../lib/modules/Uploader')

describe('Uploader Tests', () => {
  const validToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIzMjUwMzU5MzYwMCIsInN1YiI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJhZG1pbiI6dHJ1ZX0.SRJ8AvhOJyJPfcl5Aqf8-ZiKVoDy72h0RwJQJzx28nI'; // eslint-disable-line

  beforeEach(() => {
    this.uploader = new Uploader({
      api: {host: 'https://api.ingest.info', token: this.validToken},
      file: {
        name: 'test',
        size: 123,
        type: 'video/mp4',
        data: {} // This can be a stream or a buffer
      }
    })

    this.spy = jest.spyOn(this.uploader, '_sendRequest').mockImplementation(() => {
      return true
    })
  })

  afterEach(() => {
    this.spy.mockReset()
  })

  describe('Uploader::progress', () => {
    it('Should call a callback function to execute when progress is made', () => {
      this.uploader.progress(function (err, res) {
        // TODO: need to add a real test here
        expect(err).toBeNull()
        expect(true).toBeTruthy
      })
    })
  })
})
