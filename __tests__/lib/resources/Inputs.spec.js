/* eslint-env jest */

const Inputs = require('../../../lib/resources/Inputs')

describe('Inputs Tests', () => {
  beforeEach(() => {
    this.resource = Inputs
    this.spy = jest.spyOn(this.resource, '_sendRequest').mockImplementation((options, callback) => {
      callback(null, true)
    })
    this.errorSpy = jest.spyOn(this.resource, '_handleInputError')
  })

  afterEach(() => {
    this.spy.mockReset()
    this.errorSpy.mockReset()
  })

  describe('Inputs:: getAll', () => {
    it('Should call send request if input is an object.', () => {
      this.resource.getAll({}, null, (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
        expect(res).toBeDefined()
        expect(err).toBeNull()
      })
    })

    it('Should call sendRequest when an input is an object and filter is passed in', () => {
      let filter = [{
        someValue: 'someValue'
      }]

      this.resource.getAll({}, filter, (err, res) => {
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })
  })

  describe('Inputs:: search', () => {
    it('Should call _sendRequest if parameters are all valid', () => {
      this.resource.search('test', {}, [], (err, res) => {
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if input is not a string', () => {
      this.resource.search({}, {}, [], (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })

    it('Should call sendRequest if input is valid and filter is passed in.', () => {
      let filter = [{
        someValue: 'someValue'
      }]

      this.resource.search('test', null, filter, (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })
  })
})
