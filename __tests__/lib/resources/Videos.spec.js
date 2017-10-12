/* eslint-env jest */
const Videos = require('../../../lib/resources/Videos')

describe('Videos Tests', () => {
  beforeEach(() => {
    this.resource = Videos
    this.spy = jest.spyOn(this.resource, '_sendRequest').mockImplementation((options, callback) => {
      if (typeof callback === 'function') {
        callback(null, true)
      }
    })
    this.errorSpy = jest.spyOn(this.resource, '_handleInputError')
  })

  afterEach(() => {
    this.spy.mockReset()
    this.errorSpy.mockReset()
  })

  describe('Videos:: getAll', () => {
    it('Should call _sendRequest if no headers are passed in', () => {
      this.resource.getAll(null, 'test', (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _sendRequest if no status is passed in', () => {
      this.resource.getAll(null, (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _sendRequest if no callback is passed in', () => {
      this.resource.getAll({}, 'status')
      expect(this.resource._sendRequest).toHaveBeenCalled()
    })

    it('Should call _sendRequest if null status is passed in', () => {
      this.resource.getAll({}, null, (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if status is not a string', () => {
      this.resource.getAll({}, {}, (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Videos:: getVariants', () => {
    it('Should call _sendRequest if valid params are passed in', () => {
      this.resource.getVariants('test', (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if passed in id is not a string', () => {
      this.resource.getVariants({}, (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Videos:: publish', () => {
    it('Should call _sendRequest if valid params are passed in', () => {
      this.resource.publish(['test'], (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if passed in ids are not an array', () => {
      this.resource.publish('test', (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Videos:: count', () => {
    it('Should call _sendRequest if valid params are passed in', () => {
      this.resource.count('test', false, (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _sendRequest if null status is passed in', () => {
      this.resource.count(null, false, (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _sendRequest if permanent is true', () => {
      this.resource.count(null, true, (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _sendRequest if permanent is true and a status is passed in', () => {
      this.resource.count('test', true, (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if passed in status is not a string', () => {
      this.resource.count({}, true, (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Videos:: getThumbnails', () => {
    it('Should call _sendRequest if valid params are passed in', () => {
      this.resource.getThumbnails('test', (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
        expect(res).toBeDefined()
        expect(err).toBeNull()
      })
    })

    it('Should call _handleInputError if passed in id is not a string', () => {
      this.resource.getThumbnails({}, (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Videos:: addExternalThumbnails', () => {
    it('Should call _sendRequest if valid params are passed in', () => {
      this.resource.addExternalThumbnails('testId', ['/sample/image/path'], (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _sendRequest if image is passed in as a string', () => {
      this.resource.addExternalThumbnails('testId', '/sample/image/path', (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if passed in id is not a string', () => {
      this.resource.addExternalThumbnails({}, [], (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if passed in images is not an array or string', () => {
      this.resource.addExternalThumbnails('testId', {}, (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  // TODO: Add in "AddThumbnail" test here when Uploader is completed

  describe('Videos:: deleteThumbnail', () => {
    it('Should call _sendRequest if valid params are passed in', () => {
      this.resource.deleteThumbnail('testId', 'thumbnailId', (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if passed in id is not a string', () => {
      this.resource.deleteThumbnail({}, 'testThumbnailId', (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if passed in thumbnailID is not a string', () => {
      this.resource.deleteThumbnail('testId', {}, (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })
})
