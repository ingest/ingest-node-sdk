/* eslint-env jest */
jest.mock('../../../lib/core/Request', () => require('../../../_mocks_/Request.js'))

const UploaderSinglepart = require('../../../lib/modules/UploaderSinglepart')
const Inputs = require('../../../lib/resources/Inputs')

describe('UploaderSinglepart Tests', () => {
  const validToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIzMjUwMzU5MzYwMCIsInN1YiI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJhZG1pbiI6dHJ1ZX0.SRJ8AvhOJyJPfcl5Aqf8-ZiKVoDy72h0RwJQJzx28nI'; // eslint-disable-line

  beforeEach(() => {
    this.uploader = new UploaderSinglepart({
      api: { host: 'https://api.ingest.info', token: validToken, Inputs: Inputs },
      file: {
        name: 'test',
        size: 123,
        type: 'video/mp4',
        data: {}
      }
    })
  })

  describe('UploaderSinglepart::pause', () => {
    it('Should change pause to true and call cancel on currentChunkRequest', () => {
      const options = {
        pass: true,
        data: {
          test: 'test'
        }
      }
      this.uploader.currentChunkRequest = this.uploader._sendRequest(options)

      this.uploader.pause()
      expect(this.uploader.paused).toBeTruthy()
    })
  })

  it('Should return if upload is complete', () => {
    this.uploader.uploadComplete = true
    this.uploader.pause()

    expect(this.uploader.paused).toBeFalsy()
  })

  describe('UploaderSinglepart::resume', () => {
    it('Should change pause to false', () => {
      this.uploader.paused = true
      this.uploader.resume()
      expect(this.uploader.paused).toBeFalsy()
    })

    it('Should call _sendSinglePart if there is a single part promise', () => {
      this.uploader.singlePartPromise = new Promise((resolve, reject) => {
        this.uploader.singlePartResolve = resolve
        this.uploader.singlePartReject = reject
      })
      this.uploader.paused = true

      jest.spyOn(this.uploader, '_sendSinglePart').mockImplementation(() => {
        return true
      })

      this.uploader.resume()
      expect(this.uploader.paused).toBeFalsy()
      expect(this.uploader._sendSinglePart).toHaveBeenCalled()
    })
  })

  describe('UploaderSinglepart::abort', () => {
    it('Should abort the active request and call abortComplete when upload is already initialized', () => {
      this.uploader.initialized = true
      this.uploader.aborted = false
      jest.spyOn(this.uploader, '_abortActiveRequests')
      jest.spyOn(this.uploader, '_abortComplete').mockImplementation(() => {
        return true
      })

      this.uploader.abort()
      expect(this.uploader.aborted).toBeTruthy()
      expect(this.uploader._abortActiveRequests).toHaveBeenCalled()
      expect(this.uploader._abortComplete).toHaveBeenCalled()
    })

    it('Should resolve the promise when upload is not initialized', (done) => {
      this.uploader.initialized = false
      this.uploader.created = false
      this.uploader.aborted = false

      let promise = this.uploader.abort()
      promise.then((value) => {
        expect(this.uploader.aborted).toBeTruthy()
        expect(value).toBe(true)
        done()
      })
    })

    it('Should return Inputs.delete when the input has been created but not initialied', () => {
      this.uploader.input = { id: 'my input id' }
      this.uploader.initialized = false
      this.uploader.created = true

      jest.spyOn(this.uploader.api.Inputs, 'delete').mockReturnValue(null)

      this.uploader.abort()

      expect(this.uploader.api.Inputs.delete).toHaveBeenCalledWith(this.uploader.input.id)
    })
  })

  describe('UploaderSinglepart::_uploadInputRecord', () => {
    it('Should upload the single part file and then complete the upload.', () => {
      this.uploader.singlePartPromise = true
      this.uploader.input = {
        id: 'test'
      }

      jest.spyOn(this.uploader, '_uploadSinglepartFile').mockImplementation(() => {
        return new Promise((resolve, reject) => {
          resolve(true)
        })
      })

      jest.spyOn(this.uploader, '_onCompleteUpload')

      this.uploader._uploadInputRecord().then((res) => {
        expect(this.uploader._onCompleteUpload).toHaveBeenCalled()
        expect(this.uploader.singlePartPromise).toBeNull()
        expect(res).toBeDefined()
      }).catch((err) => {
        expect(err).not.toBeDefined()
      })
    })
  })

  describe('UploaderSinglepart::_abortActiveRequests', () => {
    it('Should abort the currentChunk Request', () => {
      const abortFn = jest.fn()
      this.uploader.currentChunkRequest = { abort: abortFn }
      this.uploader.singlePartPromise = 'not null'

      this.uploader._abortActiveRequests()
      expect(abortFn).toHaveBeenCalled()
      expect(this.uploader.currentChunkRequest).toBeNull()
      expect(this.uploader.singlePartPromise).toBeNull()
    })

    it('Should reset singlePartPromise without aborting the currentChunk Request', () => {
      this.uploader.currentChunkRequest = false
      this.uploader.singlePartPromise = 'not null'

      this.uploader._abortActiveRequests()

      expect(this.uploader.currentChunkRequest).not.toBeNull()
      expect(this.uploader.singlePartPromise).toBeNull()
    })
  })

  describe('UploaderSinglepart::_uploadSinglepartFile', () => {
    beforeEach(() => {
      this.uploader.file.data = {
        on: (eventName, callback) => {}
      }
    })

    it('Should populate singlePartPromise, singlepartResolve, and singlePartReject', () => {
      const promise = this.uploader._uploadSinglepartFile()

      expect(this.uploader.singlePartPromise).toBe(promise)
      expect(this.uploader.singlePartPromise).toBeTruthy()
      expect(this.uploader.singlePartResolve).toBeTruthy()
      expect(this.uploader.singlePartReject).toBeTruthy()
    })

    it('Should add listeners to the file.data stream', () => {
      jest.spyOn(this.uploader.file.data, 'on')

      this.uploader._uploadSinglepartFile()

      const calls = this.uploader.file.data.on.mock.calls
      expect(calls.length).toBe(2)
      expect(calls[0][0]).toBe('data')
      expect(calls[1][0]).toBe('end')
    })

    it('Should concatenate the buffers passed to the data callback into file.data', () => {
      jest.spyOn(this.uploader.file.data, 'on')
      jest.spyOn(this.uploader, '_sendSinglePart').mockImplementation(() => {})

      this.uploader._uploadSinglepartFile()

      const calls = this.uploader.file.data.on.mock.calls
      const data = calls[0][1]
      const end = calls[1][1]
      const buf1 = Buffer.alloc(1)
      const buf2 = Buffer.alloc(2)
      const combinedBuffer = Buffer.concat([buf1, buf2])
      data(buf1)
      data(buf2)
      end()
      expect(this.uploader.file.data).toEqual(combinedBuffer)
    })

    it('Should call _sendSinglePart when the end callback is called', () => {
      jest.spyOn(this.uploader.file.data, 'on')
      jest.spyOn(this.uploader, '_sendSinglePart').mockImplementation(() => {})

      this.uploader._uploadSinglepartFile()

      const calls = this.uploader.file.data.on.mock.calls
      const end = calls[1][1]
      end()
      expect(this.uploader._sendSinglePart).toHaveBeenCalled()
    })
  })

  describe('UploaderSinglepart::_sendSinglePart', () => {
    it('Should send the file and resolve the promise', (done) => {
      // Have to assign this to an empty function so we can spy on it.
      this.uploader.singlePartResolve = () => {}
      this.uploader.input = {
        size: 2
      }

      jest.spyOn(this.uploader, '_signChunk').mockImplementation(() => Promise.resolve())
      jest.spyOn(this.uploader, '_sendChunk').mockImplementation(() => Promise.resolve())
      jest.spyOn(this.uploader, '_sendSinglepartComplete').mockImplementation(() => Promise.resolve())
      jest.spyOn(this.uploader, 'singlePartResolve')

      this.uploader._sendSinglePart()

      // Wait a tick to allow promises to resolve
      process.nextTick(() => {
        expect(this.uploader._signChunk).toHaveBeenCalled()
        expect(this.uploader._sendChunk).toHaveBeenCalled()
        expect(this.uploader._sendSinglepartComplete).toHaveBeenCalled()
        expect(this.uploader.singlePartResolve).toHaveBeenCalled()
        done()
      })
    })

    it('Should catch the error and call singlePartReject', (done) => {
      const error = new Error()
      // Have to assign this to an empty function so we can spy on it.
      this.uploader.singlePartResolve = () => {}
      this.uploader.singlePartReject = () => {}
      this.uploader.input = {
        size: 2
      }

      jest.spyOn(this.uploader, '_signChunk').mockImplementation(() => Promise.resolve())
      jest.spyOn(this.uploader, '_sendChunk').mockImplementation(() => Promise.reject(error))
      jest.spyOn(this.uploader, '_sendSinglepartComplete').mockImplementation(() => Promise.resolve())
      jest.spyOn(this.uploader, 'singlePartResolve')
      jest.spyOn(this.uploader, 'singlePartReject')
      jest.spyOn(console, 'error').mockImplementation(() => {
        return 'test'
      })

      this.uploader._sendSinglePart()

      // Wait a tick to allow promises to resolve
      process.nextTick(() => {
        expect(this.uploader._signChunk).toHaveBeenCalled()
        expect(this.uploader._sendChunk).toHaveBeenCalled()
        expect(this.uploader._sendSinglepartComplete).not.toHaveBeenCalled()
        expect(this.uploader.singlePartResolve).not.toHaveBeenCalled()
        expect(this.uploader.singlePartReject).toHaveBeenCalled()
        expect(console.error).toHaveBeenCalled()
        done()
      })
    })
  })
  describe('UploaderSinglepart::_sendSinglepartComplete', () => {
    it('Should upload the single part file and then complete the upload', () => {
      this.uploader.uploadComplete = false
      this.uploader.input = {
        size: 0
      }
      this.uploader.input.size = 2
      this.uploader._sendSinglepartComplete()
      expect(this.uploader.uploadComplete).toBeTruthy()
      expect(this.uploader.uploadedBytes).toEqual(2)
    })
  })
})
