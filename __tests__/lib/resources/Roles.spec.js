/* eslint-env jest */
const Roles = require('../../../lib/resources/Roles')

describe('Roles Tests', () => {
  beforeEach(() => {
    this.resource = Roles
    this.spy = jest.spyOn(this.resource, '_sendRequest').mockImplementation((options, callback) => {
      callback(null, true)
    })
    this.errorSpy = jest.spyOn(this.resource, '_handleInputError')
  })

  afterEach(() => {
    this.spy.mockReset()
    this.errorSpy.mockReset()
  })

  describe('Roles:: update', () => {
    it('Should call send request if role is an object.', () => {
      let role = {}

      this.resource.update(role, (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call handleInputError if a role object is not passed in', () => {
      this.resource.update('someValue', (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })
})
