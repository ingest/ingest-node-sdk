/* eslint-env jest */
jest.mock('../../../lib/core/Request', () => require('../../../_mocks_/Request.js'))

const UploaderMultipart = require('../../../lib/modules/UploaderMultipart')
const SerialPromises = require('../../../lib/modules/SerialPromises')

describe('UploaderMultipart Tests', () => {
  const validToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIzMjUwMzU5MzYwMCIsInN1YiI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJhZG1pbiI6dHJ1ZX0.SRJ8AvhOJyJPfcl5Aqf8-ZiKVoDy72h0RwJQJzx28nI'; // eslint-disable-line
  beforeEach(() => {
    this.uploader = new UploaderMultipart({
      api: {host: 'https://api.ingest.info', token: validToken},
      file: {
        name: 'test',
        size: 123000000,
        type: 'video/mp4',
        data: {}
      }
    })
  })

  describe('UploaderMultipart::pause', () => {
    it('Should return if upload is complete', () => {
      this.uploader.uploadComplete = true
      this.uploader.pause()

      expect(this.uploader.paused).toBeFalsy()
    })

    it('Should pause if upload is not yet complete', () => {
      this.uploader.uploadComplete = false
      this.uploader.paused = false
      this.uploader.serialPromise = new SerialPromises()
      jest.spyOn(this.uploader.serialPromise, 'pause')

      this.uploader.pause()

      expect(this.uploader.paused).toBeTruthy()
      expect(this.uploader.serialPromise.pause).toHaveBeenCalled()
    })

    it('Should log an error if upload is not complete but there is no serialPromise to pause', () => {
      this.uploader.paused = false
      this.uploader.serialPromise = null

      jest.spyOn(console, 'error').mockImplementation(() => {
        return 'test'
      })

      this.uploader.pause()

      expect(this.uploader.paused).toBeTruthy()
      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('UploaderMultipart::resume', () => {
    it('Should change pause to false but throw an error', () => {
      this.uploader.paused = true
      jest.spyOn(console, 'error').mockImplementation(() => {
        return 'test'
      })
      this.uploader.resume()
      expect(this.uploader.paused).toBeFalsy()
      expect(console.error).toHaveBeenCalled()
    })

    it('Should change pause to false and resume the upload', () => {
      this.uploader.paused = true
      this.uploader.serialPromise = new SerialPromises()

      jest.spyOn(this.uploader.serialPromise, 'resume')
      this.uploader.resume()

      expect(this.uploader.paused).toBeFalsy()
      expect(this.uploader.serialPromise.resume).toHaveBeenCalled()
    })
  })

  describe('UploaderMultipart::_initializeInputRecordComplete', () => {
    it('Should the required chunk size and count', () => {
      let response = {}
      let data = {
        pieceSize: 1,
        pieceCount: 2
      }
      response.data = JSON.stringify(data)
      this.uploader._initializeInputRecordComplete(response)
      expect(this.uploader.requiredChunkSize).toEqual(1)
      expect(this.uploader.requiredChunkCount).toEqual(2)
    })
  })

  describe('UploaderMultipart::_uploadInputRecord', () => {
    it('Should upload the multi part file and then complete the upload.', () => {
      this.uploader.input = {
        id: 'test'
      }

      this.uploader.uploadId = 'test'
      jest.spyOn(this.uploader, '_createChunks').mockImplementation(() => {
        return new Promise((resolve, reject) => {
          resolve(true)
        })
      })

      jest.spyOn(this.uploader, '_sendRequest').mockImplementation(() => {
        let result = {
          request: new Promise((resolve, reject) => { resolve(true) })
        }
        return result
      })

      jest.spyOn(this.uploader, '_completeMultipartUpload')

      this.uploader._uploadInputRecord().then((res) => {
        expect(this.uploader._completeMultipartUpload).toHaveBeenCalled()
        expect(res).toBeDefined()
      }).catch((err) => {
        expect(err).not.toBeDefined()
      })
    })
  })

  describe('UploaderMultipart::abort', () => {
    it('Should resolve the promise if the input is not yet initialized', () => {
      this.uploader.aborted = false
      this.uploader.initialized = false
      this.uploader.created = false
      this.uploader.abort()

      expect(this.uploader.aborted).toBeTruthy()
      // TODO expect to resolve promise here
    })

    it('Should delete created input record if its already been created', () => {
      this.uploader.aborted = false
      this.uploader.initialized = false
      this.uploader.created = true

      jest.spyOn(this.uploader, '_abortComplete').mockImplementation(() => {
        return true
      })
      this.uploader.abort()

      expect(this.uploader.aborted).toBeTruthy()
      expect(this.uploader._abortComplete).toHaveBeenCalled()
    })

    it('Should cancel the serial promise then send the request to abort', () => {
      this.uploader.aborted = false
      this.uploader.initialized = true
      this.uploader.serialPromise = new SerialPromises()

      this.uploader.input = {
        id: 'testId'
      }
      this.uploader.uploadId = 'testUploadId'

      jest.spyOn(this.uploader, '_sendRequest').mockImplementation(() => {
        let result = {
          request: new Promise((resolve, reject) => { resolve(true) })
        }

        return result
      })

      jest.spyOn(this.uploader, '_abortComplete').mockImplementation(() => {
        return new Promise((resolve, reject) => { resolve(true) })
      })

      this.uploader.abort().then((res) => {
        expect(this.uploader._abortComplete).toHaveBeenCalled()
        expect(res).toBeDefined()
      }).catch((err) => {
        expect(err).not.toBeDefined()
      })

      expect(this.uploader.aborted).toBeTruthy()
    })
  })

  describe('UploaderMultipart::_completeChunk', () => {
    it('Should complete the chunk and change uploadComplete to true', () => {
      this.uploader.chunksCompleted = 1
      this.uploader.chunksComplete = 2
      this.uploader.requiredChunkCount = 2
      this.uploader.uploadComplete = false

      let chunk = {
        complete: false,
        size: 3
      }
      let promise = Promise.resolve(true)

      this.uploader._completeChunk(chunk, promise)

      expect(this.uploader.uploadComplete).toBeTruthy()
      expect(this.uploader.chunksCompleted).toEqual(2)
    })

    it('Should not change uploadComplete to true if upload is notyet complete', () => {
      this.uploader.chunksCompleted = 1
      this.uploader.chunksComplete = 2
      this.uploader.requiredChunkCount = 4
      this.uploader.uploadComplete = false

      let chunk = {
        complete: false,
        size: 3
      }
      let promise = Promise.resolve(true)

      this.uploader._completeChunk(chunk, promise)

      expect(this.uploader.uploadComplete).toBeFalsy()
      expect(this.uploader.chunksCompleted).toEqual(2)
    })
  })

  describe('UploaderMultipart::_abortActiveRequests', () => {
    it('Should abort the current chunk request', () => {
      const abortFn = jest.fn()

      this.uploader.serialPromise = null
      this.uploader.currentChunkRequest = { abort: abortFn }

      this.uploader._abortActiveRequests()

      expect(abortFn).toHaveBeenCalled()
      expect(this.uploader.currentChunkRequest).toBeNull()
    })

    it('Should cancel the serial promise', () => {
      const abortFn = jest.fn()

      this.uploader.serialPromise = {cancel: abortFn}
      this.uploader.currentChunkRequest = null

      this.uploader._abortActiveRequests()

      expect(abortFn).toHaveBeenCalled()
      expect(this.uploader.serialPromise).toBeNull()
    })
  })

  describe('UploaderMultipart::_onFileDataPiece', () => {
    it('Should add the piece to the pieces array and flush the pieces to chunk', () => {
      let piece = {
        byteLength: 1
      }
      this.uploader.piecesByteLength = 1
      this.uploader.pieces = []
      this.uploader.requiredChunkSize = 1
      this.uploader.serialPromise = new SerialPromises()

      jest.spyOn(this.uploader, '_flushPiecesToChunk').mockImplementation(() => {
        return true
      })

      this.uploader._onFileDataPiece(piece)
      expect(this.uploader.pieces.length).toEqual(1)
      expect(this.uploader.piecesByteLength).toEqual(2)
      expect(this.uploader._flushPiecesToChunk).toHaveBeenCalled()
    })

    it('Should add the piece to the pieces array', () => {
      let piece = {
        byteLength: 1
      }
      this.uploader.piecesByteLength = 1
      this.uploader.pieces = []
      this.uploader.requiredChunkSize = 3
      this.uploader.serialPromise = new SerialPromises()

      jest.spyOn(this.uploader, '_flushPiecesToChunk')

      this.uploader._onFileDataPiece(piece)
      expect(this.uploader.pieces.length).toEqual(1)
      expect(this.uploader.piecesByteLength).toEqual(2)
      expect(this.uploader._flushPiecesToChunk).not.toHaveBeenCalled()
    })
  })

  describe('UploaderMultipart::_onFileDataEnded', () => {
    it('Should flush pieces to chunk and close the queue', () => {
      this.uploader.pieces = [
        'test'
      ]
      this.uploader.serialPromise = new SerialPromises()

      jest.spyOn(this.uploader, '_flushPiecesToChunk').mockImplementation(() => {
        return true
      })

      jest.spyOn(this.uploader.serialPromise, 'closeQueue')

      this.uploader._onFileDataEnded()
      expect(this.uploader._flushPiecesToChunk).toHaveBeenCalled()
      expect(this.uploader.serialPromise.closeQueue).toHaveBeenCalled()
    })

    it('Should close the queue without flushing chunks if no serialPromise', () => {
      this.uploader.pieces = []
      this.uploader.serialPromise = new SerialPromises()

      jest.spyOn(this.uploader, '_flushPiecesToChunk')
      jest.spyOn(this.uploader.serialPromise, 'closeQueue')

      this.uploader._onFileDataEnded()
      expect(this.uploader._flushPiecesToChunk).not.toHaveBeenCalled()
      expect(this.uploader.serialPromise.closeQueue).toHaveBeenCalled()
    })
  })

  describe('UploaderMultipart::_flushPiecesToChunk', () => {
    beforeEach(() => {
      this.uploader.serialPromise = {
        enqueue: jest.fn()
      }
    })

    it('Should increment chunkCount and chunksByteLength', () => {
      this.uploader.piecesByteLength = 42
      this.uploader._flushPiecesToChunk()
      expect(this.uploader.chunkCount).toBe(1)
      expect(this.uploader.chunksByteLength).toBe(42)
    })

    it('Should reset pieces and piecesByteLength', () => {
      this.uploader.piecesByteLength = 42
      this.uploader.pieces = [Buffer.alloc(2), Buffer.alloc(2)]
      this.uploader._flushPiecesToChunk()
      expect(this.uploader.piecesByteLength).toBe(0)
      expect(this.uploader.pieces.length).toBe(0)
    })

    it('Should push a chunk to chunks', () => {
      this.uploader._flushPiecesToChunk()
      expect(this.uploader.chunks.length).toBe(1)
    })

    it('Should call serialPromises enqueue', () => {
      this.uploader._flushPiecesToChunk()
      expect(this.uploader.serialPromise.enqueue).toHaveBeenCalled()
    })
  })

  describe('UploaderMultipart::_createChunks', () => {
    beforeEach(() => {
      this.uploader.file.data = {
        on: (eventName, callback) => {}
      }
    })

    it('Should set serialPromise to a new SerialPromise', () => {
      this.uploader._createChunks()
      expect(this.uploader.serialPromise).toBeInstanceOf(SerialPromises)
    })

    it('Should add listeners to the file.data stream', () => {
      jest.spyOn(this.uploader.file.data, 'on')

      this.uploader._createChunks()

      const calls = this.uploader.file.data.on.mock.calls
      expect(calls.length).toBe(2)
      expect(calls[0][0]).toBe('data')
      expect(calls[1][0]).toBe('end')
    })

    it('Should return a promise', () => {
      let result = this.uploader._createChunks()
      expect(result).toBeInstanceOf(Promise)
    })
  })
})
