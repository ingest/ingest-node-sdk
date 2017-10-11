/* eslint-env jest */
jest.mock('../../../lib/core/Request')

const Resource = require('../../../lib/core/Resource')
const Events = require('../../../lib/resources/Events')

describe('Events Tests', () => {
  beforeEach(() => {
    this.resource = Events
    this.spy = jest.spyOn(this.resource, '_sendRequest')
  })

  afterEach(() => {
    this.spy.mockReset()
  })

  describe('Events:: getAll', () => {
    it('Should call send request if all params are valid.', () => {
      this.resource.getAll(null, 'test', 'test', (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call send request if no filterStatus.', () => {
      this.resource.getAll(null, null, 'test', (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call send request if no filterType.', () => {
      this.resource.getAll(null, 'test', null, (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call send request if headers are passed in.', () => {
      this.resource.getAll({}, 'test', 'test', (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call handleInputError if filterStatus is not a string', () => {
      jest.spyOn(this.resource, '_handleInputError')

      this.resource.getAll(null, {}, 'test', (err, res) => {
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })

    it('Should call handleInputError if filterType is not a string', () => {
      jest.spyOn(this.resource, '_handleInputError')

      this.resource.getAll(null, 'test', {}, (err, res) => {
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Events:: getTypes', () => {
    it('Should call send request to retrieve a list of event types.', () => {
      this.resource.getTypes((err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })
  })
})
