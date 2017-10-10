/* eslint-env jest */
jest.mock('../../../lib/core/Request')

const Resource = require('../../../lib/core/Resource')
const Events = require('../../../lib/resources/Events')

describe('Events Tests', () => {
  describe('Events:: getAll', () => {
    it('Should call send request if all params are valid.', () => {
      let resource = Events

      resource.getAll(null, 'test', 'test', function (err, res) {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call send request if no filterStatus.', () => {
      let resource = Events

      resource.getAll(null, null, 'test', function (err, res) {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call send request if no filterType.', () => {
      let resource = Events

      resource.getAll(null, 'test', null, function (err, res) {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call send request if headers are passed in.', () => {
      let resource = Events

      resource.getAll({}, 'test', 'test', function (err, res) {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call handleInputError if filterStatus is not a string', () => {
      let resource = Events

      resource.getAll(null, {}, 'test', function (err, res) {
        expect(resource._handleInputError).toHaveBeenCalled()
      })
    })

    it('Should call handleInputError if filterType is not a string', () => {
      let resource = Events

      resource.getAll(null, 'test', {}, function (err, res) {
        expect(resource._handleInputError).toHaveBeenCalled()
      })
    })

  })

  describe('Events:: getTypes', () => {
    it('Should call send request to retrieve a list of event types.', () => {
      let resource = Events

      resource.getTypes(function (err, res) {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })
  })
})
