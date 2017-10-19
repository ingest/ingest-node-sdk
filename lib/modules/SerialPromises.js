'use strict'

/**
 * This class accepts callbacks (which return promises) and places them in a queue and calls them one by one,
 * allowing pausing or canceling of the overall task inbetween them.
 */
class SerialPromises {
  /**
   * @constructor
   */
  constructor () {
    // State
    this.paused = false
    this.complete = false

    // When the queue will have no more members added, this is set to true.
    this.queueClosed = false

    // Array of callbacks which will return promises when called
    this.queue = []

    // The current promise that is being waited on.
    this.activePromise = null

    // Promises that have already been completed.
    this.completedPromises = []

    // This part sets up the promise that callers will wait on.
    this.resolve = null
    this.reject = null
    this.promise = new Promise((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
    })
  }

  /**
   * Returns the promise that outside callers can listen to
   * @return {Promise} - promise outside callers can listen to
   */
  getPromise () {
    return this.promise
  }

  /**
   * Add a callback (which returns a promise) to the queue.
   * @param {function} callback
   */
  enqueue (callback) {
    if (this.queueClosed) {
      console.error('Attempted to enqueue to a closed queue.')
      return
    }
    this.queue.push(callback)
    this._startNext()
  }

  /**
   * Changes queue to be closed when there are no more chunks to add and queue is empty
   */
  closeQueue () {
    this.queueClosed = true
  }

  /**
   * Pauses the overall task
   */
  pause () {
    console.log('serial promise pause')
    this.paused = true
  }

  /**
   * Resume the overall task
   */
  resume () {
    if (!this.complete && this.paused) {
      console.log('serial promise resume')
      this.paused = false
      this._startNext()
    }
  }

  /**
   * Cancel the overall task
   */
  cancel () {
    console.log('abort')
    this.complete = true
    this._resolve()
  }

  /**
   * Function that begins the next part of the queue if a promise doesn't already exist
   * we aren't paused, or the queue is not already complete
   */
  _startNext () {
    if (this.activePromise || this.paused || this.complete) {
      // Don't start if a promise already exists, or we're paused or complete.
      return
    }
    console.log('starting part ' + this.completedPromises.length)
    const callback = this.queue.shift() // Take from the front of the queue
    this.activePromise = callback() // Turn the callback into a promise

    // Bind to the complete and error states.
    this.activePromise
      .then(this._onPromiseComplete.bind(this))
      .catch(this._onPromiseError.bind(this))
  }

  /**
   * When the current promise is completed try to start the next one.
   * @param {Promise} result
   */
  _onPromiseComplete (result) {
    if (this.complete) {
      return
    }

    console.log('completing part' + this.completedPromises.length)

    // Push the completed promise into the completed array and clear the active promise.
    this.completedPromises.push(this.activePromise)
    this.activePromise = null

    if (this.queue.length !== 0) {
      // If there's something in the queue, start it.

      // Testing - do a 3 second pause between each item in the queue.
      // this.cancel()
      // this.pause()
      // setTimeout(this.resume.bind(this), 3000)

      this._startNext()
    } else if (this.queueClosed) {
      // Otherwise, if the queue is closed, finish the overall task.
      console.log('finishing')
      this._complete()
    }
  }

  /**
   * Handles the promise error case, rejecting the promise.
   * @param {*} error
   */
  _onPromiseError (error) {
    console.error(error)
    this._reject(error)
    this.complete = true
  }

  /**
   * Completes the overall task, resolving the promise.
   */
  _complete () {
    if (!this.complete) {
      this.complete = true
      this._resolve(this.completedPromises)
    }
  }
}

module.exports = SerialPromises
