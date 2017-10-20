/* eslint-env jest */
//May not be needed
jest.mock('../../../lib/core/Request')
// jest.mock('../../../lib/modules/UploaderSinglepart')
// jest.mock('../../../lib/modules/UploaderMultipart')

const UploaderBase = require('../../../lib/modules/UploaderBase')

describe('UploaderBase Tests', () => {
  const validToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIzMjUwMzU5MzYwMCIsInN1YiI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJhZG1pbiI6dHJ1ZX0.SRJ8AvhOJyJPfcl5Aqf8-ZiKVoDy72h0RwJQJzx28nI'; // eslint-disable-line

  describe('UploaderBase::abort', () => {
    it('Should throw an error message if baseUploader _abort function is called', function () {
      const uploaderBase = new UploaderBase()
      expect(() => {
        uploaderBase.abort()
      }).toThrow();
    })
  })

  describe('UploaderBase::progress', () => {
    it('Should set config.progress to a callback function', function () {
      const uploaderBase = new UploaderBase()
      uploaderBase.progress(function(err, res) {})
      expect(typeof uploaderBase.config.progress).toBe('function')
    })
  })

  describe('UploaderBase::pause', () => {
    it('Should throw an error message if baseUploader _abort function is called', function () {
      const uploaderBase = new UploaderBase()
      expect(() => {
        uploaderBase.pause()
      }).toThrow();
    })
  })

  describe('UploaderBase::resume', () => {
    it('Should throw an error message if baseUploader _abort function is called', function () {
      const uploaderBase = new UploaderBase()
      expect(() => {
        uploaderBase.resume()
      }).toThrow();
    })
  })

  describe('UploaderBase::_sendRequest', () => {
    beforeEach(() => {
      this.uploaderBase = new UploaderBase()
    })
    it('Should return a success callback with the data', () => {
      let options = {
        pass: true,
        data: {
          test: 'test'
        }
      }
      this.uploaderBase._sendRequest(options, (err, res) => {
        expect(err).toBeNull()
        expect(res.test).toEqual('test')
      })
    })

    it('Should return an error callback', () => {
      let options = {
        pass: false,
        data: {
          test: 'error'
        }
      }
      this.uploaderBase._sendRequest(options, (err, res) => {
        expect(res).toBeNull()
        expect(err).toEqual(options.data)
      })
    })

    it('Should return a promise', () => {
      let options = {
        pass: true,
        data: {
          test: 'test'
        }
      }
      let result = this.uploaderBase._sendRequest(options)
      expect(result.request.then).toBeDefined()
    })
  })

})
