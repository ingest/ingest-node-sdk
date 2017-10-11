/* eslint-env jest */
jest.mock('../../../lib/core/Request')

const Resource = require('../../../lib/core/Resource')

describe('Resource Tests', () => {
  beforeEach(() => {
    this.resource = new Resource()
    this.spy = jest.spyOn(this.resource, '_sendRequest')
  })

  afterEach(() => {
    this.spy.mockReset()
  })

  describe('Resource::_sendRequest', () => {
    it('Should return a success callback with the data', () => {
      let options = {
        pass: true,
        data: {
          test: 'test'
        }
      }
      this.resource._sendRequest(options, (err, res) => {
        expect(err).toBeNull()
        expect(res.test).toEqual('test')
      })
    })

    // it('Should return an error callback', () => {
    //   let options = {
    //     pass: true,
    //     data: {
    //       test: 'error'
    //     }
    //   }
    //   this.resource._sendRequest(options, (err, res) => {
    //     console.log(err)
    //     expect(res).toBeNull()
    //     expect(err).toEqual(options.data)
    //   })
    // })

    it('Should return a promise', () => {
      let options = {
        pass: true,
        data: {
          test: 'test'
        }
      }
      let result = this.resource._sendRequest(options)
      expect(result.then).toBeDefined()
    })
  })

  describe('Resource::_handleInputError', () => {
    it('Should return an error callback with the passed in error message', () => {
      let error = 'this is an error message'
      this.resource._handleInputError(error, (err, res) => {
        expect(err).toEqual(error)
        expect(res).toBeNull()
      })
    })

    // it('Should return a rejected promise with the passed in error message', () => {
    //   let error = 'this is an error message'
    //   let result = this.resource._handleInputError(error)
    //   expect(result.then).toBeDefined()
    // })
  })

  describe('Resource:: getAll', () => {
    it('Should call _sendRequest if no headers are passed in', () => {
      this.resource.getAll((err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _sendRequest if null headers are passed in', () => {
      this.resource.getAll(null, (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    // it('Should call _sendRequest if no callback is passed in', () => {
    //   this.resource.getAll(null).then(data => {
    //     expect(this.resource._sendRequest).toHaveBeenCalled()
    //   })
    // })
  })

  describe('Resource:: getById', () => {
    // it('Should call the error handler when no id is passed in', () => {
    //   this.resource.getById().then(data => {
    //     expect(this.resource._handleInputError).toHaveBeenCalled()
    //   })
    // })

    // it('Should call the error handler when id is not a string', () => {
    //   this.resource.getById({}).then(data => {
    //     expect(this.resource._handleInputError).toHaveBeenCalled()
    //   })
    // })

    // it('Should call _sendRequest when id is passed as a string', () => {
    //   this.resource.getById('test').then(data => {
    //     expect(this.resource._sendRequest).toHaveBeenCalled()
    //   })
    // })
  })

  describe('Resource:: getTrashed', () => {
    it('Should call _sendRequest if no headers are passed in', () => {
      this.resource.getTrashed((err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _sendRequest if null headers are passed in', () => {
      this.resource.getTrashed(null, (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    // it('Should call _sendRequest if no callback is passed in', () => {
    //   this.resource.getTrashed(null).then(data => {
    //     expect(this.resource._sendRequest).toHaveBeenCalled()
    //   })
    // })
  })

  describe('Resource:: add', () => {
    // it('Should call the error handler when no resource is passed in', () => {
    //   this.resource.add().then(data => {
    //     expect(this.resource._handleInputError).toHaveBeenCalled()
    //   })
    // })

    // it('Should call the error handler when resource is not an object', () => {
    //   this.resource.add('').then(data => {
    //     expect(this.resource._handleInputError).toHaveBeenCalled()
    //   })
    // })

    // it('Should call _sendRequest when resource is passed as an object', () => {
    //   this.resource.add({test: 'Test Object'}).then(data => {
    //     expect(this.resource._sendRequest).toHaveBeenCalled()
    //   })
    // })
  })

  describe('Resource:: update', () => {
    // it('Should call the error handler when no resource is passed in', () => {
    //   this.resource.update().then(data => {
    //     expect(this.resource._handleInputError).toHaveBeenCalled()
    //   })
    // })

    // it('Should call the error handler when resource is not an object', () => {
    //   this.resource.update('').then(data => {
    //     expect(this.resource._handleInputError).toHaveBeenCalled()
    //   })
    // })

    // it('Should call _sendRequest when resource is passed as an object', () => {
    //   this.resource.update({test: 'Test Object'}).then(data => {
    //     expect(this.resource._updateResource).toHaveBeenCalled()
    //   })
    // })
  })

  describe('Resource:: _updateResource', () => {
    // it('Should call the error handler when no resource is passed in', () => {
    //   this.resource._updateResource().then(data => {
    //     expect(this.resource._handleInputError).toHaveBeenCalled()
    //   })
    // })

    // it('Should call the error handler when resource is not an object', () => {
    //   this.resource._updateResource('').then(data => {
    //     expect(this.resource._handleInputError).toHaveBeenCalled()
    //   })
    // })

    // it('Should call _sendRequest when resource is passed as an object', () => {
    //   this.resource._updateResource({test: 'Test Object'}).then(data => {
    //     expect(this.resource._sendRequest).toHaveBeenCalled()
    //   })
    // })
  })

  describe('Resource:: delete', () => {
    // it('Should call the error handler when no resource is passed in', () => {
    //   this.resource.delete().then(data => {
    //     expect(this.resource._handleInputError).toHaveBeenCalled()
    //   })
    // })

    // it('Should call the error handler when resource is not a string', () => {
    //   this.resource.delete({}).then(data => {
    //     expect(this.resource._handleInputError).toHaveBeenCalled()
    //   })
    // })

    // it('Should call _sendRequest when resource is passed as a string', () => {
    //   this.resource.delete('resource id').then(data => {
    //     expect(this.resource._sendRequest).toHaveBeenCalled()
    //   })
    // })
  })

  describe('Resource:: permanentDelete', () => {
    // it('Should call the error handler when no resource is passed in', () => {
    //   this.resource.permanentDelete().then(data => {
    //     expect(this.resource._handleInputError).toHaveBeenCalled()
    //   })
    // })

    // it('Should call the error handler when resource is not a string', () => {
    //   this.resource.permanentDelete({}).then(data => {
    //     expect(this.resource._handleInputError).toHaveBeenCalled()
    //   })
    // })

    // it('Should call _sendRequest when resource is passed as a string', () => {
    //   this.resource.permanentDelete('resource id').then(data => {
    //     expect(this.resource._sendRequest).toHaveBeenCalled()
    //   })
    // })
  })

  describe('Resource:: _deleteResource', () => {
    // it('Should call the error handler when resource is not a string', () => {
    //   this.resource._deleteResource({}, true).then(data => {
    //     expect(this.resource._handleInputError).toHaveBeenCalled()
    //   })
    // })

    // it('Should call the error handler when permanent is not a boolean', () => {
    //   this.resource._deleteResource('test', 'true').then(data => {
    //     expect(this.resource._handleInputError).toHaveBeenCalled()
    //   })
    // })

    // it('Should call sendRequest when parameters are passed in successfully', () => {
    //   this.resource._deleteResource('test', true).then(data => {
    //     expect(this.resource._sendRequest).toHaveBeenCalled()
    //   })
    // })
  })

  describe('Resource:: search', () => {
    it('Should call _sendRequest if no headers are passed in', () => {
      this.resource.search('input', (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _sendRequest if null headers are passed in', () => {
      this.resource.search('input', null, (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    // it('Should call _sendRequest if no callback is passed in', () => {
    //   this.resource.search('input', null).then(data => {
    //     expect(this.resource._sendRequest).toHaveBeenCalled()
    //   })
    // })

    // it('Should call _handleInputError if no input is passed in', () => {
    //   this.resource.search((err, res) => {
    //     expect(this.resource._handleInputError).toHaveBeenCalled()
    //   })
    // })
  })

  describe('Resource:: count', () => {
    // it('Should call _sendRequest when count function is invoked', () => {
    //   this.resource.count().then(data => {
    //     expect(this.resource._sendRequest).toHaveBeenCalled()
    //   })
    // })
  })

  describe('Resource:: trashCount', () => {
    // it('Should call _sendRequest when trashCount function is invoked', () => {
    //   this.resource.trashCount().then(data => {
    //     expect(this.resource._sendRequest).toHaveBeenCalled()
    //   })
    // })
  })
})
