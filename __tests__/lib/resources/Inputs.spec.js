/* eslint-env jest */
jest.mock('../../../lib/core/Request')

const Resource = require('../../../lib/core/Resource')
const Inputs = require('../../../lib/resources/Inputs')

describe('Inputs Tests', () => {
  describe('Inputs:: getAll', () => {
    it('Should call send request if input is an object.', () => {
      let resource = Inputs
      let input = {}

      resource.getAll(input, function (err, res) {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call handleInputError if an object is not passed in', () => {
      let resource = Inputs

      resource.getAll('someValue', function (err, res) {
        expect(resource._handleInputError).toHaveBeenCalled()
      })
    })

    it('Should call sendRequest when an input is an object and filter is passed in', () => {
      let resource = Inputs

      let input = {}
      let filter = [{
        someValue: 'someValue'
      }]

      resource.getAll(input, filter, function (err, res) {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })
  })

  describe('Inputs:: search', () => {
    it('Should call _sendRequest if parameters are valid', () => {
      let resource = Inputs
      let id = "someValue"

      resource.search(id, function (err, res) {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if invalid', () => {
      let resource = Inputs

      resource.search({}, function (err, res) {
        expect(resource._handleInputError).toHaveBeenCalled()
      })
    })

    it('Should call sendRequest if a filter is passed in.', () => {
      let resource = Inputs
      let id = 'someValue'
      let filter = [{
        someValue: 'someValue'
      }]

      resource.search(id, null, filter, function (err, res) {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })
  })
})
