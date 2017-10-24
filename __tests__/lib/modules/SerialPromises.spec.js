/* eslint-env jest */

const SerialPromises = require('../../../lib/modules/SerialPromises')

describe('Serial Promises Tests', () => {
  const validToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIzMjUwMzU5MzYwMCIsInN1YiI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJhZG1pbiI6dHJ1ZX0.SRJ8AvhOJyJPfcl5Aqf8-ZiKVoDy72h0RwJQJzx28nI'; // eslint-disable-line

  beforeEach(() => {
    this.instance = new SerialPromises()
  })

  describe('SerialPromises::constructor', () => {
    it('Should create a new SerialPromises', () => {
      expect(this.instance).toBeInstanceOf(SerialPromises)
    })
  })

  describe('SerialPromises::getPromise', () => {
    it('Should return the internal promise variable', () => {
      const error = new Error()
      const promise = Promise.reject(error)
      this.instance.promise = promise
      const returned = this.instance.getPromise()
      expect(returned).toBe(promise)

      // Catch the error to avoid error log, this would normally be caught by the caller
      returned.catch(() => {})
    })
  })

  describe('SerialPromises::enqueue', () => {
    it('Should log an error if the queueClosed variable is true', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {})
      this.instance.queueClosed = true
      this.instance.enqueue()
      expect(console.error).toHaveBeenCalled()
    })

    it('Should push its argument to the queue', () => {
      jest.spyOn(this.instance.queue, 'push')
      jest.spyOn(this.instance, '_startNext').mockReturnValue()
      const myFunc = jest.fn()
      this.instance.enqueue(myFunc)
      expect(this.instance.queue.push).toHaveBeenCalledWith(myFunc)
    })

    it('Should call _startNext', () => {
      jest.spyOn(this.instance, '_startNext').mockReturnValue()
      this.instance.enqueue()
      expect(this.instance._startNext).toHaveBeenCalled()
    })
  })

  describe('SerialPromises::closeQueue', () => {
    it('Should set the queueClsoed variable to true', () => {
      this.instance.queueClosed = false
      this.instance.closeQueue()
      expect(this.instance.queueClosed).toBe(true)
    })
  })

  describe('SerialPromises::pause', () => {
    it('Should set the paused variable to true', () => {
      this.instance.paused = false
      this.instance.pause()
      expect(this.instance.paused).toBe(true)
    })
  })

  describe('SerialPromises::resume', () => {
    beforeEach(() => {
      jest.spyOn(this.instance, '_startNext').mockReturnValue()
    })

    it('Should do nothing if not paused', () => {
      this.instance.paused = 0 // Falsy
      this.instance.resume()

      expect(this.instance._startNext).not.toHaveBeenCalled()
      expect(this.instance.paused).toBe(0) // hasn't been set to false
    })

    it('Should do nothing if already complete', () => {
      this.instance.paused = true
      this.instance.complete = true
      this.instance.resume()

      expect(this.instance._startNext).not.toHaveBeenCalled()
      expect(this.instance.paused).toBe(true) // hasn't been set to false
    })

    it('Should set paused to true and call _startNext', () => {
      this.instance.paused = true
      this.instance.resume()

      expect(this.instance._startNext).toHaveBeenCalled()
      expect(this.instance.paused).toBe(false) // hasn't been set to false
    })
  })

  describe('SerialPromises::cancel', () => {
    beforeEach(() => {
      this.instance._resolve = jest.fn()
    })

    it('Should set the complete variable to true', () => {
      this.instance.complete = false
      this.instance.cancel()
      expect(this.instance.complete).toBe(true)
    })

    it('Should set the complete variable to true', () => {
      this.instance.cancel()
      expect(this.instance._resolve).toHaveBeenCalled()
    })
  })

  describe('SerialPromises::_startNext', () => {
    let queuedCallback
    let returnedPromise
    beforeEach(() => {
      returnedPromise = {
        then: jest.fn().mockReturnThis(),
        catch: jest.fn().mockReturnThis()
      }
      queuedCallback = jest.fn().mockReturnValue(returnedPromise)
      jest.spyOn(this.instance.queue, 'shift').mockReturnValue(queuedCallback)
    })

    it('Should do nothing if activePromise is truthy', () => {
      this.instance.activePromise = true
      this.instance._startNext()
      expect(this.instance.queue.shift).not.toHaveBeenCalled()
      expect(this.instance.activePromise).toBe(true) // unchanged
    })

    it('Should do nothing if paused is truthy', () => {
      this.instance.paused = true
      this.instance._startNext()
      expect(this.instance.queue.shift).not.toHaveBeenCalled()
    })

    it('Should do nothing if complete is truthy', () => {
      this.instance.complete = true
      this.instance._startNext()
      expect(this.instance.queue.shift).not.toHaveBeenCalled()
    })

    it('Should set activePromise to the return value of the shifted callback', () => {
      this.instance._startNext()
      expect(this.instance.activePromise).toBe(returnedPromise)
    })

    it('Should call then and catch', () => {
      this.instance._startNext()
      expect(returnedPromise.then).toHaveBeenCalled()
      expect(returnedPromise.catch).toHaveBeenCalled()
    })
  })

  describe('SerialPromises::_onPromiseComplete', () => {
    beforeEach(() => {
      jest.spyOn(this.instance.completedPromises, 'push')
      jest.spyOn(this.instance, '_startNext').mockImplementation(() => {})
      jest.spyOn(this.instance, '_complete').mockImplementation(() => {})
    })

    it('Should do nothing if complete is true', () => {
      this.instance.complete = true
      this.instance._onPromiseComplete()
      expect(this.instance.completedPromises.push).not.toHaveBeenCalled()
      expect(this.instance._startNext).not.toHaveBeenCalled()
      expect(this.instance._complete).not.toHaveBeenCalled()
    })

    it('Should push the active promise into completedPromises and set it to null', () => {
      const myFunc = jest.fn()
      this.instance.activePromise = myFunc
      this.instance._onPromiseComplete()
      expect(this.instance.activePromise).toBeNull()
      expect(this.instance.completedPromises.push).toHaveBeenCalledWith(myFunc)
    })

    it('Should call _startNext if the queue length is non-zero', () => {
      this.instance.queue = [1, 2, 3]
      this.instance._onPromiseComplete()
      expect(this.instance._startNext).toHaveBeenCalled()
      expect(this.instance._complete).not.toHaveBeenCalled()
    })

    it('Should call _continue if the queue is closed', () => {
      this.instance.queueClosed = true
      this.instance._onPromiseComplete()
      expect(this.instance._startNext).not.toHaveBeenCalled()
      expect(this.instance._complete).toHaveBeenCalled()
    })
  })

  describe('SerialPromises::_onPromiseError', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation(() => {})
      this.instance._reject = jest.fn()
    })

    it('Should log its parameter as an error', () => {
      const myError = new Error('my error')
      this.instance._onPromiseError(myError)
      expect(console.error).toHaveBeenCalledWith(myError)
    })

    it('Should call _reject with it\'s parameter', () => {
      const myError = new Error('my error')
      this.instance._onPromiseError(myError)
      expect(this.instance._reject).toHaveBeenCalledWith(myError)
    })

    it('Should set complete to true', () => {
      this.instance._onPromiseError()
      expect(this.instance.complete).toBe(true)
    })
  })

  describe('SerialPromises::_complete', () => {
    beforeEach(() => {
      this.instance._resolve = jest.fn()
    })

    it('Should do nothing if already complete', () => {
      this.instance.complete = 1 // Truthy but not true
      this.instance._complete()
      expect(this.instance.complete).toBe(1)
      expect(this.instance._resolve).not.toHaveBeenCalled()
    })

    it('Should call _resolve with completedPromises', () => {
      const myArray = [1, 2, 'pick up my shoe']
      this.instance.completedPromises = myArray
      this.instance._complete()
      expect(this.instance._resolve).toHaveBeenCalledWith(myArray)
    })

    it('Should set complete to true', () => {
      this.instance._complete()
      expect(this.instance.complete).toBe(true)
    })
  })
})
