/* eslint-env jest */

const Events = require('../../../lib/resources/Events')

describe('Events Tests', () => {
  beforeEach(() => {
    this.resource = Events
    this.spy = jest.spyOn(this.resource, '_sendRequest').mockImplementation((options, callback) => {
      callback(null, true)
    })
    this.errorSpy = jest.spyOn(this.resource, '_handleInputError')
  })

  afterEach(() => {
    this.spy.mockReset()
    this.errorSpy.mockReset()
  })

  describe('Events:: getAll', () => {
    it('Should call send request if all params are valid.', () => {
      this.resource.getAll({}, 'test', 'test', (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
        expect(err).toBeNull()
      })
    })

    it('Should call send request if no filterStatus.', () => {
      this.resource.getAll(null, null, 'test', (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
        expect(err).toBeNull()
      })
    })

    it('Should call send request if no filterType.', () => {
      this.resource.getAll(null, 'test', null, (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
        expect(err).toBeNull()
      })
    })

    it('Should call send request if no headers are passed in.', () => {
      this.resource.getAll(null, 'test', 'test', (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
        expect(err).toBeNull()
      })
    })

    it('Should call handleInputError if filterStatus is not a string', () => {
      this.resource.getAll(null, {}, 'test', (err, res) => {
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
        expect(err).toBeDefined()
        expect(res).toBeNull()
      })
    })

    it('Should call handleInputError if filterType is not a string', () => {
      this.resource.getAll(null, 'test', {}, (err, res) => {
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
        expect(err).toBeDefined()
        expect(res).toBeNull()
      })
    })
  })

  describe('Events:: getTypes', () => {
    it('Should call send request to retrieve a list of event types.', () => {
      this.resource.getTypes((err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
        expect(err).toBeNull()
      })
    })
  })
})
