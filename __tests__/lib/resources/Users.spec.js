/* eslint-env jest */
const Users = require('../../../lib/resources/Users')

describe('Users Tests', () => {
  beforeEach(() => {
    this.resource = Users
    this.spy = jest.spyOn(this.resource, '_sendRequest').mockImplementation((options, callback) => {
      callback(null, true)
    })
    this.errorSpy = jest.spyOn(this.resource, '_handleInputError')
  })

  afterEach(() => {
    this.spy.mockReset()
    this.errorSpy.mockReset()
  })

  describe('Users:: getCurrentUserInfo', () => {
    it('Should call send request when called', () => {
      this.resource.getCurrentUserInfo((err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })
  })

  describe('Users:: transferUserAuthorship', () => {
    it('Should call send request when params are passed in successfully', () => {
      this.resource.transferUserAuthorship('oldId', 'newId', (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call handleInputError if oldId is not a string', () => {
      this.resource.transferUserAuthorship({}, 'newId', (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })

    it('Should call handleInputError if newId is not a string', () => {
      this.resource.transferUserAuthorship('oldId', {}, (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Users:: revokeCurrentUser', () => {
    it('Should call send request when called', () => {
      this.resource.revokeCurrentUser((err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })
  })

  describe('Users:: updateUserRoles', () => {
    it('Should call send request when params are passed in successfully', () => {
      this.resource.updateUserRoles('testId', ['roleIds'], (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call handleInputError if id is not a string', () => {
      this.resource.updateUserRoles({}, ['roleIds'], (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })

    it('Should call handleInputError if rollsIds is not an array', () => {
      this.resource.updateUserRoles('testId', {}, (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })
})
