/* eslist-env jest */

const Resource = require('../../../lib/core/Resource');

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
    it('Should return a callback with the data', () => {

    })

    it('Should return a promise with an error', () => {

    })

    it('Should return a promise', () => {

    })
  })

  describe('Resource::_handleInputError', () => {
    it('Should ...', () => {

    })
  })

  describe('Resource:: getAll', () => {
    it('Should ...', () => {

    })
  })

  describe('Resource:: getById', () => {
    it('Should ...', () => {

    })
  })

  describe('Resource:: getTrashed', () => {
    it('Should ...', () => {

    })
  })

  describe('Resource:: getThumbnails', () => {
    it('Should ...', () => {

    })
  })

  describe('Resource:: add', () => {
    it('Should ...', () => {

    })
  })

  describe('Resource:: update', () => {
    it('Should ...', () => {

    })
  })

  describe('Resource:: _updateResource', () => {
    it('Should ...', () => {

    })
  })

  describe('Resource:: _updateResourceArray', () => {
    it('Should ...', () => {

    })
  })

  describe('Resource:: delete', () => {
    it('Should ...', () => {

    })
  })

  describe('Resource:: permanentDelete', () => {
    it('Should ...', () => {

    })
  })

  describe('Resource:: _deleteResource', () => {
    it('Should ...', () => {

    })
  })

  describe('Resource:: _deleteResourceArray', () => {
    it('Should ...', () => {

    })
  })

  describe('Resource:: search', () => {
    it('Should ...', () => {

    })
  })

  describe('Resource:: count', () => {
    it('Should ...', () => {

    })
  })

  describe('Resource:: trashCount', () => {
    it('Should ...', () => {

    })
  })
})
