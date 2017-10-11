/* eslint-env jest */
jest.mock('../../../lib/core/Request')

const Roles = require('../../../lib/resources/Roles')

describe('Roles Tests', () => {
  beforeEach(() => {
    this.resource = Roles
    this.spy = jest.spyOn(this.resource, '_sendRequest')
  })

  afterEach(() => {
    this.spy.mockReset()
  })

  describe('Roles:: update', () => {
    it('Should call send request if role is an object.', () => {
      let role = {}

      this.resource.update(role, (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call handleInputError if an object is not passed in', () => {
      this.spy = jest.spyOn(this.resource, '_handleInputError')

      this.resource.update('someValue', (err, res) => {
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })
})
