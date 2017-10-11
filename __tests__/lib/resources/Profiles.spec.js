/* eslint-env jest */
jest.mock('../../../lib/core/Request')

const Resource = require('../../../lib/core/Resource')
const Profiles = require('../../../lib/resources/Profiles')

describe('Profiles Tests', () => {
  beforeEach(() => {
    this.resource = Profiles
    this.spy = jest.spyOn(this.resource, '_sendRequest')
  })

  afterEach(() => {
    this.spy.mockReset()
  })

  describe('Profiles:: update', () => {
    it('Should call send request if profile is an object.', () => {
      this.resource.update({}, (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call handleInputError if an object is not passed in', () => {
      jest.spyOn(this.resource, '_handleInputError')

      this.resource.update('someValue', (err, res) => {
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })
})
