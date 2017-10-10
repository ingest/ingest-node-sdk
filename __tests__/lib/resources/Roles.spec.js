/* eslint-env jest */
jest.mock('../../../lib/core/Request')

const Resource = require('../../../lib/core/Resource')
const Roles = require('../../../lib/resources/Roles')

describe('Roles Tests', () => {
  describe('Roles:: update', () => {
    it('Should call send request if role is an object.', () => {
      let resource = Roles
      let role = {}

      resource.update(role, function (err, res) {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call handleInputError if an object is not passed in', () => {
      let resource = Roles

      resource.update('someValue', function (err, res) {
        expect(resource._handleInputError).toHaveBeenCalled()
      })
    })
  })
})
