/* eslint-env jest */
jest.mock('../../../lib/core/Request')

const Resource = require('../../../lib/core/Resource')
const Users = require('../../../lib/resources/Users')

describe('Users Tests', () => {
  beforeEach(() => {
    this.resource = Users
    this.spy = jest.spyOn(this.resource, '_sendRequest')
  })

  afterEach(() => {
    this.spy.mockReset()
  })

  describe('Users:: getCurrentUserInfo', () => {
    it('Should call send request when called', () => {
      this.resource.getCurrentUserInfo((err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })
  })

  describe('Users:: transferUserAuthorship', () => {
    it('Should call send request when params are passed in successfully', () => {
      this.resource.transferUserAuthorship('oldId', 'newId', (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call handleInputError if oldId is not a string', () => {
      jest.spyOn(this.resource, '_handleInputError')

      this.resource.transferUserAuthorship({}, 'newId', (err, res) => {
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })

    it('Should call handleInputError if oldId is not a string', () => {
      jest.spyOn(this.resource, '_handleInputError')

      this.resource.transferUserAuthorship('oldId', {}, (err, res) => {
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Users:: revokeCurrentUser', () => {
    it('Should call send request when called', () => {
      this.resource.revokeCurrentUser((err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })
  })

  describe('Users:: updateUserRoles', () => {
    it('Should call send request when params are passed in successfully', () => {
      this.resource.updateUserRoles('testId', ['roleIds'], (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call handleInputError if id is not a string', () => {
      jest.spyOn(this.resource, '_handleInputError')

      this.resource.updateUserRoles({}, ['roleIds'], (err, res) => {
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })

    it('Should call handleInputError if rolleIds is not an array', () => {
      jest.spyOn(this.resource, '_handleInputError')

      this.resource.updateUserRoles('testId', {}, (err, res) => {
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })
})
