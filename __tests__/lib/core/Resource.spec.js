/* eslint-env jest */
jest.mock('../../../lib/core/Request')

const Resource = require('../../../lib/core/Resource')

describe('Resource Tests', () => {
  describe('Resource::constructor', () => {
    it('Should have a config object upon creation', () => {
      const resource = new Resource()

      const config = {
        all: '/<%=resource%>',
        byId: '/<%=resource%>/<%=id%>',
        thumbnails: '/<%=resource%>/<%=id%>/thumbnails',
        trash: '/<%=resource%>?filter=trashed',
        deleteMethods: { permanent: '?permanent=1' },
        search: '/<%=resource%>?search=<%=input%>',
        resource: null
      }
      expect(resource.config).toEqual(config)
    })

    it('Should accept options as a parameter if passed in', () => {
      const options = {
        test: 'test'
      }
      const resource = new Resource(options)

      expect(resource.config.test).toEqual('test')
    })
  })

  describe('Resource::_sendRequest', () => {
    it('Should return a success callback with the data', () => {
      let options = {
        pass: true,
        data: {
          test: 'test'
        }
      }
      let resource = new Resource()
      resource._sendRequest(options, function (err, res) {
        expect(err).toBeNull()
        expect(res.test).toEqual('test')
      })
    })

    it('Should return an error callback', () => {
      let options = {
        pass: true,
        data: {
          test: 'error'
        }
      }
      let resource = new Resource()
      resource._sendRequest(options, function (err, res) {
        expect(res).toBeNull()
        expect(err.test).toEqual('error')
      })
    })

    it('Should return a promise', () => {
      let resource = new Resource()
      let result = resource._sendRequest()
      expect(result.then).toBeDefined()
    })
  })

  describe('Resource::_handleInputError', () => {
    it('Should return an error callback with the passed in error message', () => {
      const resource = new Resource()
      let error = 'this is an error message'
      resource._handleInputError(error, function (err, res) {
        expect(err).toEqual(error)
        expect(res).toBeNull()
      })
    })

    it('Should return a rejected promise with the passed in error message', () => {
      const resource = new Resource()
      let error = 'this is an error message'
      let result = resource._handleInputError(error)
      expect(result.then).toBeDefined()
    })
  })

  describe('Resource:: getAll', () => {
    it('Should call _sendRequest if no headers are passed in', () => {
      let resource = new Resource()
      resource.getAll(function (err, res) {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _sendRequest if null headers are passed in', () => {
      let resource = new Resource()
      resource.getAll(null, function (err, res) {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _sendRequest if no callback is passed in', () => {
      let resource = new Resource()
      resource.getAll(null).then(data => {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })
  })

  describe('Resource:: getById', () => {
    it('Should call the error handler when no id is passed in', () => {
      let resource = new Resource()
      resource.getById().then(data => {
        expect(resource._handleInputError).toHaveBeenCalled()
      })
    })

    it('Should call the error handler when id is not a string', () => {
      let resource = new Resource()
      resource.getById({}).then(data => {
        expect(resource._handleInputError).toHaveBeenCalled()
      })
    })

    it('Should call _sendRequest when id is passed as a string', () => {
      let resource = new Resource()
      resource.getById('test').then(data => {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })
  })

  describe('Resource:: getTrashed', () => {
    it('Should call _sendRequest if no headers are passed in', () => {
      let resource = new Resource()
      resource.getTrashed(function (err, res) {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _sendRequest if null headers are passed in', () => {
      let resource = new Resource()
      resource.getTrashed(null, function (err, res) {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _sendRequest if no callback is passed in', () => {
      let resource = new Resource()
      resource.getTrashed(null).then(data => {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })
  })

  describe('Resource:: add', () => {
    it('Should call the error handler when no resource is passed in', () => {
      let resource = new Resource()
      resource.add().then(data => {
        expect(resource._handleInputError).toHaveBeenCalled()
      })
    })

    it('Should call the error handler when resource is not an object', () => {
      let resource = new Resource()
      resource.add('').then(data => {
        expect(resource._handleInputError).toHaveBeenCalled()
      })
    })

    it('Should call _sendRequest when resource is passed as an object', () => {
      let resource = new Resource()
      resource.add({test: 'Test Object'}).then(data => {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })
  })

  describe('Resource:: update', () => {
    it('Should call the error handler when no resource is passed in', () => {
      let resource = new Resource()
      resource.update().then(data => {
        expect(resource._handleInputError).toHaveBeenCalled()
      })
    })

    it('Should call the error handler when resource is not an object', () => {
      let resource = new Resource()
      resource.update('').then(data => {
        expect(resource._handleInputError).toHaveBeenCalled()
      })
    })

    it('Should call _sendRequest when resource is passed as an object', () => {
      let resource = new Resource()
      resource.update({test: 'Test Object'}).then(data => {
        expect(resource._updateResource).toHaveBeenCalled()
      })
    })
  })

  describe('Resource:: _updateResource', () => {
    it('Should call the error handler when no resource is passed in', () => {
      let resource = new Resource()
      resource._updateResource().then(data => {
        expect(resource._handleInputError).toHaveBeenCalled()
      })
    })

    it('Should call the error handler when resource is not an object', () => {
      let resource = new Resource()
      resource._updateResource('').then(data => {
        expect(resource._handleInputError).toHaveBeenCalled()
      })
    })

    it('Should call _sendRequest when resource is passed as an object', () => {
      let resource = new Resource()
      resource._updateResource({test: 'Test Object'}).then(data => {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })
  })

  describe('Resource:: delete', () => {
    it('Should call the error handler when no resource is passed in', () => {
      let resource = new Resource()
      resource.delete().then(data => {
        expect(resource._handleInputError).toHaveBeenCalled()
      })
    })

    it('Should call the error handler when resource is not a string', () => {
      let resource = new Resource()
      resource.delete({}).then(data => {
        expect(resource._handleInputError).toHaveBeenCalled()
      })
    })

    it('Should call _sendRequest when resource is passed as a string', () => {
      let resource = new Resource()
      resource.delete('resource id').then(data => {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })
  })

  describe('Resource:: permanentDelete', () => {
    it('Should call the error handler when no resource is passed in', () => {
      let resource = new Resource()
      resource.permanentDelete().then(data => {
        expect(resource._handleInputError).toHaveBeenCalled()
      })
    })

    it('Should call the error handler when resource is not a string', () => {
      let resource = new Resource()
      resource.permanentDelete({}).then(data => {
        expect(resource._handleInputError).toHaveBeenCalled()
      })
    })

    it('Should call _sendRequest when resource is passed as a string', () => {
      let resource = new Resource()
      resource.permanentDelete('resource id').then(data => {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })
  })

  describe('Resource:: _deleteResource', () => {
    it('Should call the error handler when resource is not a string', () => {
      let resource = new Resource()
      resource._deleteResource({}, true).then(data => {
        expect(resource._handleInputError).toHaveBeenCalled()
      })
    })

    it('Should call the error handler when permanent is not a boolean', () => {
      let resource = new Resource()
      resource._deleteResource('test', 'true').then(data => {
        expect(resource._handleInputError).toHaveBeenCalled()
      })
    })

    it('Should call sendRequest when parameters are passed in successfully', () => {
      let resource = new Resource()
      resource._deleteResource('test', true).then(data => {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })
  })

  describe('Resource:: search', () => {
    it('Should call _sendRequest if no headers are passed in', () => {
      let resource = new Resource()
      resource.search('input', function (err, res) {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _sendRequest if null headers are passed in', () => {
      let resource = new Resource()
      resource.search('input', null, function (err, res) {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _sendRequest if no callback is passed in', () => {
      let resource = new Resource()
      resource.search('input', null).then(data => {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if no input is passed in', () => {
      let resource = new Resource()
      resource.search(function (err, res) {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })
  })

  describe('Resource:: count', () => {
    it('Should call _sendRequest when count function is invoked', () => {
      let resource = new Resource()
      resource.count().then(data => {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })
  })

  describe('Resource:: trashCount', () => {
    it('Should call _sendRequest when trashCount function is invoked', () => {
      let resource = new Resource()
      resource.trashCount().then(data => {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })
  })
})
