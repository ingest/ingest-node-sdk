/* eslint-env jest */
const Profiles = require('../../../lib/resources/Profiles')

describe('Profiles Tests', () => {
  beforeEach(() => {
    this.resource = Profiles
    this.spy = jest.spyOn(this.resource, '_sendRequest').mockImplementation((options, callback) => {
      callback(null, true)
    })
    this.errorSpy = jest.spyOn(this.resource, '_handleInputError')
  })

  afterEach(() => {
    this.spy.mockReset()
    this.errorSpy.mockReset()
  })

  describe('Profiles:: update', () => {
    it('Should call send request if profile is an object.', () => {
      this.resource.update({}, (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call handleInputError if a profile object is not passed in', () => {
      this.resource.update('someValue', (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })
})
