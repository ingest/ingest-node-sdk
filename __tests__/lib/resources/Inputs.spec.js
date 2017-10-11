/* eslint-env jest */
jest.mock('../../../lib/core/Request')

const Resource = require('../../../lib/core/Resource')
const Inputs = require('../../../lib/resources/Inputs')

describe('Inputs Tests', () => {
  beforeEach(() => {
    this.resource = Inputs
    this.spy = jest.spyOn(this.resource, '_sendRequest')
  })

  afterEach(() => {
    this.spy.mockReset()
  })

  describe('Inputs:: getAll', () => {
    it('Should call send request if input is an object.', () => {
      this.resource.getAll({}, [], (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call handleInputError if an object is not passed in', () => {
      jest.spyOn(this.resource, '_handleInputError')

      this.resource.getAll('test', (err, res) => {
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })

    it('Should call sendRequest when an input is an object and filter is passed in', () => {
      let filter = [{
        someValue: 'someValue'
      }]

      this.resource.getAll({}, filter, (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })
  })

  describe('Inputs:: search', () => {
    it('Should call _sendRequest if parameters are valid', () => {
      this.resource.search('test', {}, [], (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if invalid', () => {
      jest.spyOn(this.resource, '_handleInputError')

      this.resource.search({}, {}, [], (err, res) => {
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })

    it('Should call sendRequest if a filter is passed in.', () => {
      let filter = [{
        someValue: 'someValue'
      }]

      this.resource.search('test', null, filter, (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })
  })
})
