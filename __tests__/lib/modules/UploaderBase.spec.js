/* eslint-env jest */
jest.mock('../../../lib/core/Request', () => require('../../../_mocks_/Request.js'))
jest.mock('request', () => require('../../../_mocks_/RequestLibrary.js'))

const UploaderBase = require('../../../lib/modules/UploaderBase')

describe('UploaderBase Tests', () => {
  const validToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIzMjUwMzU5MzYwMCIsInN1YiI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJhZG1pbiI6dHJ1ZX0.SRJ8AvhOJyJPfcl5Aqf8-ZiKVoDy72h0RwJQJzx28nI'; // eslint-disable-line

  beforeEach(() => {
    this.uploaderBase = new UploaderBase()
  })
  describe('UploaderBase::abort', () => {
    it('Should throw an error message if baseUploader _abort function is called', function () {
      expect(() => {
        this.uploaderBase.abort()
      }).toThrow()
    })
  })

  describe('UploaderBase::progress', () => {
    it('Should set config.progress to a callback function', () => {
      this.uploaderBase.progress(function (err, res) {
        expect(err).toBeNull()
      })
      expect(typeof this.uploaderBase.config.progress).toBe('function')
    })
  })

  describe('UploaderBase::save', () => {
    it('Should return a promise', () => {
      jest.spyOn(this.uploaderBase, '_createInputRecord').mockImplementation(() => {
        return Promise.resolve(true)
      })

      jest.spyOn(this.uploaderBase, '_initializeInputRecord').mockImplementation(() => {
        return Promise.resolve(true)
      })

      jest.spyOn(this.uploaderBase, '_uploadInputRecord').mockImplementation(() => {
        return Promise.resolve(true)
      })
      this.uploaderBase.save()
    })

    it('Should return a success callback', () => {
      jest.spyOn(this.uploaderBase, '_createInputRecord').mockImplementation(() => {
        return Promise.resolve(true)
      })

      jest.spyOn(this.uploaderBase, '_initializeInputRecord').mockImplementation(() => {
        return Promise.resolve(true)
      })

      jest.spyOn(this.uploaderBase, '_uploadInputRecord').mockImplementation(() => {
        return Promise.resolve(true)
      })

      this.uploaderBase.save((err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
      })
    })

    it('Should return an error callback', () => {
      jest.spyOn(this.uploaderBase, '_createInputRecord').mockImplementation(() => {
        return Promise.resolve(true)
      })

      jest.spyOn(this.uploaderBase, '_initializeInputRecord').mockImplementation(() => {
        return Promise.resolve(true)
      })

      jest.spyOn(this.uploaderBase, '_uploadInputRecord').mockImplementation(() => {
        const error = new Error()
        return Promise.reject(error)
      })

      this.uploaderBase.save((err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
      })
    })
  })

  describe('UploaderBase::pause', () => {
    it('Should throw an error message if baseUploader _abort function is called', () => {
      expect(() => {
        this.uploaderBase.pause()
      }).toThrow()
    })
  })

  describe('UploaderBase::resume', () => {
    it('Should throw an error message if baseUploader _abort function is called', () => {
      expect(() => {
        this.uploaderBase.resume()
      }).toThrow()
    })
  })

  describe('UploaderBase::_abortActiveRequests', () => {
    it('Should throw an error', () => {
      expect(() => {
        this.uploaderBase._abortActiveRequests()
      }).toThrow()
    })
  })

  describe('UploaderBase::_updateProgress', () => {
    it('Should call config.progress with passed in percent and chunkSize', () => {
      this.uploaderBase.config.progress = jest.fn()

      this.uploaderBase._updateProgress(10, 10)
      expect(this.uploaderBase.config.progress).toHaveBeenCalledWith(10, 10)
    })
  })

  describe('UploaderBase::_setProgress', () => {
    it('Should set the progress of an upload', () => {
      jest.spyOn(this.uploaderBase, '_updateProgress').mockImplementation(() => {
        return true
      })
      this.uploaderBase.uploadedBytes = 1
      this.uploaderBase.file = {
        size: 2
      }

      this.uploaderBase._setProgress(1, 3)

      expect(this.uploaderBase._updateProgress).toHaveBeenCalledWith(99, 3)
    })
  })

  describe('UploaderBase::_createInputRecord', () => {
    it('Should resolve the promise if input is already created', (done) => {
      this.uploaderBase.created = true
      this.uploaderBase.input = {
        id: 'test'
      }

      let promise = this.uploaderBase._createInputRecord()
      promise.then((value) => {
        expect(value).toBe('test')
        done()
      })
    })

    it('Should reject the promise if input is aborted', (done) => {
      this.uploaderBase.created = false
      this.uploaderBase.aborted = true

      let promise = this.uploaderBase._createInputRecord()
      promise.then((value) => {
        expect(value).toBeNull()
        done()
      }).catch((err) => {
        expect(err).toBeDefined()
        done()
      })
    })

    it('Should return a promise that calls _createInputRecordSuccess', (done) => {
      this.uploaderBase.created = false
      this.uploaderBase.aborted = true

      let promise = this.uploaderBase._createInputRecord()
      promise.then((value) => {
        expect(value).toBeNull()
        done()
      }).catch((err) => {
        expect(err).toBeDefined()
        done()
      })
    })
  })

  describe('UploaderBase::_createInputRecordSuccess', () => {
    it('Should parse the data and return it', () => {
      let response = {}
      let data = {
        id: 1
      }
      response.data = JSON.stringify(data)

      jest.spyOn(this.uploaderBase, '_updateProgress')
      this.uploaderBase._createInputRecordSuccess(response)

      expect(this.uploaderBase.created).toBeTruthy()
      expect(this.uploaderBase._updateProgress).toHaveBeenCalled()
      expect(this.uploaderBase.input.id).toEqual(1)
    })
  })

  describe('UploaderBase::_initializeInputRecord', () => {
    it('Should reject the promise if uploaded is already aborted', (done) => {
      this.uploaderBase.aborted = true

      let promise = this.uploaderBase._initializeInputRecord()
      promise.then((value) => {
        expect(value).toBeNull()
        done()
      }).catch((err) => {
        expect(err).toBeDefined()
        done()
      })
    })
  })

  describe('UploaderBase::_initializeInputRecordComplete', () => {
    it('Should parse the data and return it', () => {
      let response = {}
      let data = {
        uploadId: 1,
        key: 2
      }
      response.data = JSON.stringify(data)
      this.uploaderBase._initializeInputRecordComplete(response)

      expect(this.uploaderBase.initialized).toBeTruthy()
      expect(this.uploaderBase.uploadId).toEqual(1)
      expect(this.uploaderBase.key).toEqual(2)
    })
  })

  describe('UploaderBase::_completeChunk', () => {
    it('Should update values when chunk is complete', () => {
      this.uploaderBase.uploadedBytes = 1

      let chunk = {
        size: 2,
        complete: false
      }
      let promise = Promise.resolve(true)
      this.uploaderBase._completeChunk(chunk, promise)

      expect(this.uploaderBase.currentChunkRequest).toBeNull()
      expect(this.uploaderBase.uploadedBytes).toEqual(3)
      expect(chunk.complete).toBeTruthy()
    })
  })

  describe('UploaderBase::_uploadInputRecord', () => {
    it('Should throw an error if called from uploaderBase class', () => {
      expect(() => {
        this.uploaderBase._uploadInputRecord()
      }).toThrow()
    })
  })

  describe('UploaderBase::_uploadChunk', () => {
    it('Should return a promise which resolves when the request is complete', (done) => {
      let chunk = {
        partNumber: 1,
        size: 3,
        complete: false
      }
      this.uploaderBase.input = {
        id: 1
      }
      jest.spyOn(this.uploaderBase, '_signChunk').mockImplementation(() => Promise.resolve())
      jest.spyOn(this.uploaderBase, '_sendChunk').mockImplementation(() => Promise.resolve())
      jest.spyOn(this.uploaderBase, '_completeChunk')

      this.uploaderBase._uploadChunk(chunk).then((res) => {
        expect(this.uploaderBase._signChunk).toHaveBeenCalled()
        expect(this.uploaderBase._sendChunk).toHaveBeenCalled()
        expect(this.uploaderBase._completeChunk).toHaveBeenCalled()
        done()
      })
    })
  })

  describe('UploaderBase::_signChunk', () => {
    let chunk
    beforeEach(() => {
      chunk = {
        partNumber: 1,
        size: 3,
        complete: false
      }
      this.uploaderBase.input = {
        id: 1
      }
    })
    it('Should return a the promise that _sendRequest returns', () => {
      const myPromise = Promise.resolve()
      jest.spyOn(this.uploaderBase, '_sendRequest').mockReturnValue({ request: myPromise })
      let result = this.uploaderBase._signChunk(chunk)
      expect(result).toBe(myPromise)
    })

    it('Should call _sendRequest', () => {
      jest.spyOn(this.uploaderBase, '_sendRequest').mockReturnValue({ request: Promise.resolve() })
      this.uploaderBase._signChunk(chunk)
      expect(this.uploaderBase._sendRequest).toHaveBeenCalled()
    })
  })

  describe('UploaderBase::_sendChunk', () => {
    let chunk, response
    beforeEach(() => {
      chunk = {
        size: 3,
        data: 'foo'
      }
      response = {
        data: JSON.stringify({
          url: 'myURL',
          authHeader: 'myAuthHeader',
          dateHeader: 'myDateHeader',
          securityToken: 'mySecurityToken'
        })
      }
    })

    it('Should return a promise', () => {
      let result = this.uploaderBase._sendChunk(chunk, response)
      expect(result).toBeInstanceOf(Promise)
    })
  })

  describe('UploaderBase::_sendRequest', () => {
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
