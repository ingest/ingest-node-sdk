/* eslint-env jest */
jest.mock('../../../lib/core/Request')

const Videos = require('../../../lib/resources/Videos')

describe('Videos Tests', () => {
  beforeEach(() => {
    this.resource = Videos
    this.spy = jest.spyOn(this.resource, '_sendRequest')
  })

  afterEach(() => {
    this.spy.mockReset()
  })

  describe('Videos:: getAll', () => {
    it('Should call _sendRequest if no headers are passed in', () => {
      this.resource.getAll(null, 'test', (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _sendRequest if null headers are passed in', () => {
      this.resource.getAll(null, (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _sendRequest if no callback is passed in', () => {
      jest.spyOn(this.resource, '_sendRequest')
      this.resource.getAll({}, 'status')
      expect(this.resource._sendRequest).toHaveBeenCalled()
    })

    it('Should call _sendRequest if no status is passed in', () => {
      this.resource.getAll({}, null, (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if status is not a string', () => {
      jest.spyOn(this.resource, '_handleInputError')

      this.resource.getAll({}, {}, (err, res) => {
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Videos:: getVariants', () => {
    it('Should call _sendRequest if valid params are passed in', () => {
      this.resource.getVariants('test', (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if passed in id is not a string', () => {
      jest.spyOn(this.resource, '_handleInputError')

      this.resource.getVariants({}, (err, res) => {
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Videos:: publish', () => {
    it('Should call _sendRequest if valid params are passed in', () => {
      this.resource.publish(['test'], (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if passed in id is not a string', () => {
      jest.spyOn(this.resource, '_handleInputError')

      this.resource.publish('test', (err, res) => {
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Videos:: count', () => {
    it('Should call _sendRequest if valid params are passed in', () => {
      this.resource.count('test', false, (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _sendRequest if status is not passed in', () => {
      this.resource.count(null, false, (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _sendRequest if permanent is true', () => {
      this.resource.count(null, true, (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _sendRequest if permanent is true and a status is passed in', () => {
      this.resource.count('test', true, (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if passed in status is not a string', () => {
      jest.spyOn(this.resource, '_handleInputError')

      this.resource.count({}, true, (err, res) => {
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Videos:: getThumbnails', () => {
    it('Should call _sendRequest if valid params are passed in', () => {
      this.resource.getThumbnails('test', (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if passed in id is not a string', () => {
      jest.spyOn(this.resource, '_handleInputError')

      this.resource.getThumbnails({}, (err, res) => {
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Videos:: addExternalThumbnails', () => {
    it('Should call _sendRequest if valid params are passed in', () => {
      this.resource.addExternalThumbnails('testId', ['/sample/image/path'], (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _sendRequest if image is passed in as a string', () => {
      this.resource.addExternalThumbnails('testId', '/sample/image/path', (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if passed in id is not a string', () => {
      jest.spyOn(this.resource, '_handleInputError')

      this.resource.addExternalThumbnails({}, [], (err, res) => {
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if passed in images is not an array or string', () => {
      jest.spyOn(this.resource, '_handleInputError')

      this.resource.addExternalThumbnails('testId', {}, (err, res) => {
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  // TODO: Add in "AddThumbnail" test here when Uploader is completed

  describe('Videos:: deleteThumbnail', () => {
    it('Should call _sendRequest if valid params are passed in', () => {
      this.resource.deleteThumbnail('testId', 'thumbnailId', (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if passed in id is not a string', () => {
      jest.spyOn(this.resource, '_handleInputError')

      this.resource.deleteThumbnail({}, 'testThumbnailId', (err, res) => {
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if passed in thumbnailID is not a string', () => {
      jest.spyOn(this.resource, '_handleInputError')

      this.resource.deleteThumbnail('testId', {}, (err, res) => {
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })
})
