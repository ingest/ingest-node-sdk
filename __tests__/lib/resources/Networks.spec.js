/* eslint-env jest */
const Networks = require('../../../lib/resources/Networks')

describe('Networks Tests', () => {
  beforeEach(() => {
    this.resource = Networks
    this.spy = jest.spyOn(this.resource, '_sendRequest').mockImplementation((options, callback) => {
      callback(null, true)
    })
    this.errorSpy = jest.spyOn(this.resource, '_handleInputError')
  })

  afterEach(() => {
    this.spy.mockReset()
    this.errorSpy.mockReset()
  })

  describe('Networks:: linkUser', () => {
    it('Should call _sendRequest if networkId, userId and callback are passed in properly', () => {
      this.resource.linkUser('networkId', 'userId', (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if networkId is not a string', () => {
      this.resource.linkUser({}, 'userId', (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if userId is not a string', () => {
      this.resource.linkUser('networkId', {}, (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Networks:: unlinkUser', () => {
    it('Should call _sendRequest if networkId, userId and callback are passed in properly', () => {
      this.resource.unlinkUser('networkId', 'userId', (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if networkId is not a string', () => {
      this.resource.unlinkUser({}, 'userId', (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if userId is not a string', () => {
      this.resource.unlinkUser('networkId', {}, (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Networks:: inviteUser', () => {
    it('Should call _sendRequest if all params are valid', () => {
      this.resource.inviteUser('networkId', 'email', 'name', false, (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _sendRequest if a resend boolean is not passed in', () => {
      this.resource.inviteUser('networkId', 'email', 'name', null, (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if networkId is not a string', () => {
      this.resource.inviteUser({}, 'email', 'name', null, (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if email is not a string', () => {
      this.resource.inviteUser('networkId', {}, 'name', null, (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if name is not a string', () => {
      this.resource.inviteUser('networkId', 'email', {}, null, (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Networks:: getSecureKeys', () => {
    it('Should call _sendRequest if networkId is a string', () => {
      this.resource.getSecureKeys('networkId', (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if networkId is not a string', () => {
      this.resource.getSecureKeys({}, (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Networks:: addSecureKey', () => {
    it('Should call _sendRequest if all params are valid', () => {
      let data = {
        title: 'test',
        key: 'key'
      }
      this.resource.addSecureKey('networkId', data, (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if networkId is not a string', () => {
      this.resource.addSecureKey({}, {}, (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if data is not an object', () => {
      this.resource.addSecureKey('networkId', 'data', (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if data.key is not a string', () => {
      let data = {
        title: 'test',
        key: {}
      }

      this.resource.addSecureKey('networkId', data, (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })

    it('Should call _sendRequest if data.title is not a string', () => {
      const data = {
        title: {},
        key: 'key'
      }
      this.resource.addSecureKey('networkId', data, (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })
  })

  describe('Networks:: getSecureKeyById', () => {
    it('Should call _sendRequest if all params are valid', () => {
      this.resource.getSecureKeyById('networkId', 'keyId', (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if networkId is not a string', () => {
      this.resource.getSecureKeyById({}, 'keyId', (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if keyId is not a string', () => {
      this.resource.getSecureKeyById('networkId', {}, (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Networks:: updateSecureKey', () => {
    it('Should call _sendRequest if all params are valid', () => {
      const data = {
        id: 'testId',
        title: 'title'
      }
      this.resource.updateSecureKey('networkId', data, (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if networkId is not a string', () => {
      this.resource.updateSecureKey({}, {}, (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if data is not an object', () => {
      this.resource.updateSecureKey('networkId', 'test', (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if data.id is not a string', () => {
      const spy = jest.spyOn(this.resource, '_handleInputError')
      const data = {
        id: {},
        title: 'title'
      }
      this.resource.updateSecureKey('networkId', data, (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
      spy.mockReset()
    })

    it('Should call _sendRequest if data.title is not a string', () => {
      const data = {
        id: 'testId',
        title: {}
      }
      this.resource.updateSecureKey('networkId', data, (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._handleInputError).not.toHaveBeenCalled()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })
  })

  describe('Networks:: deleteSecureKey', () => {
    it('Should call _sendRequest if all params are valid', () => {
      this.resource.deleteSecureKey('networkId', 'keyId', (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if networkId is not a string', () => {
      this.resource.deleteSecureKey({}, 'keyId', (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if keyId is not a string', () => {
      this.resource.deleteSecureKey('networkId', {}, (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Networks:: createCustomer', () => {
    it('Should call _sendRequest if all params are valid', () => {
      this.resource.createCustomer('stripeToken', 'networkId', (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if networkId is not a string', () => {
      this.resource.createCustomer('stripeToken', {}, (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if stripeToken is not a string', () => {
      this.resource.createCustomer({}, 'networkId', (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Networks:: updateCustomer', () => {
    it('Should call _sendRequest if all params are valid', () => {
      this.resource.updateCustomer('networkId', 'cusId', 'networkName', 'stripeToken', (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if networkId is not a string', () => {
      this.resource.updateCustomer({}, 'cusId', 'networkName', 'stripeToken', (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if stripeToken and networkName are both not a string', () => {
      this.resource.updateCustomer('networkId', 'cusId', {}, {}, (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Networks:: deleteCustomer', () => {
    it('Should call _sendRequest if all params are valid', () => {
      this.resource.deleteCustomer('networkId', 'cusId', (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if networkId is not a string', () => {
      this.resource.deleteCustomer({}, 'cusId', (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Networks:: getCustomerCardInformation', () => {
    it('Should call _sendRequest if all params are valid', () => {
      this.resource.getCustomerCardInformation('networkId', 'cusId', (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if networkId is not a string', () => {
      this.resource.getCustomerCardInformation({}, 'cusId', (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Networks:: deleteCustomerCard', () => {
    it('Should call _sendRequest if all params are valid', () => {
      this.resource.deleteCustomerCard('networkId', 'cusId', (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if networkId is not a string', () => {
      this.resource.deleteCustomerCard({}, 'cusId', (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Networks:: getInvoices', () => {
    it('Should call _sendRequest if all params are valid', () => {
      this.resource.getInvoices('networkId', (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if networkId is not a string', () => {
      this.resource.getInvoices({}, (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Networks:: getInvoiceById', () => {
    it('Should call _sendRequest if all params are valid', () => {
      this.resource.getInvoiceById('networkId', 'invoiceId', (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if networkId is not a string', () => {
      this.resource.getInvoiceById({}, 'invoiceId', (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if invoiceId is not a string', () => {
      this.resource.getInvoiceById('networkId', {}, (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Networks:: getCurrentUsage', () => {
    it('Should call _sendRequest if all params are valid', () => {
      this.resource.getCurrentUsage('networkId', (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if networkId is not a string', () => {
      this.resource.getCurrentUsage({}, (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Networks:: getPendingUsers', () => {
    it('Should call _sendRequest if all params are valid', () => {
      this.resource.getPendingUsers('networkId', (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if networkId is not a string', () => {
      this.resource.getPendingUsers({}, (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Networks:: deletePendingUser', () => {
    it('Should call _sendRequest if all params are valid', () => {
      this.resource.deletePendingUser('networkId', 'userId', (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if networkId is not a string', () => {
      this.resource.deletePendingUser({}, 'userId', (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })
})
