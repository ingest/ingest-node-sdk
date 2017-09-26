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
        all: 'test'
      }
      const resource = new Resource(options)

      expect(resource.config.all).toEqual('test')
    })
  })
})
