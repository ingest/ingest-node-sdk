'use strict'

const Resource = require('../core/Resource')
const Utils = require('../core/Utils')

/**
 * Networks Resource
 *
 * @class
 * @extends Resource
 */
class Networks extends Resource {
  /**
   * @constructor
   */
  constructor () {
    const overrides = {
      resource: 'networks',
      keys: '/<%=resource%>/<%=networkId%>/keys',
      keysById: '/<%=resource%>/<%=networkId%>/keys/<%=keyId%>',
      invite: '/<%=resource%>/<%=networkId%>/invite',
      invoices: '/<%=resource%>/<%=networkId%>/invoices',
      invoicesById: '/<%=resource%>/<%=networkId%>/invoices/<%=invoiceId%>',
      currentUsage: '/<%=resource%>/<%=networkId%>/invoices?currentUsage=true',
      customers: '/<%=resource%>/<%=networkId%>/customers',
      customerById: '/<%=resource%>/<%=networkId%>/customers/<%=cusId%>',
      customerCardInformation: '/<%=resource%>/<%=networkId%>/customers/<%=cusId%>/card',
      getPendingUsers: '/<%=resource%>/<%=networkId%>?filter=pending',
      deletePendingUser: '/<%=resource%>/<%=networkId%>/pending-users/<%=pendingUserId%>'
    }
    super(overrides)
  }

  /**
   * Link an existing user to the specified network.
   *
   * @param   {string}            networkId  The unique ID of the network.
   * @param   {string}            userId     The unique ID of the user to link.
   * @param   {Function}          callback   (Optional) Callback to be called when the request is complete.
   *
   * @return  {Function|Promise}             Calls a callback if one was provided, otherwise returns a promise
   */
  linkUser (networkId, userId, callback) {
    if (typeof networkId !== 'string') {
      const error = new Error('IngestSDK linkUser requires `networkId` to be passed as a string.')
      return this._handleInputError(error)
    }

    if (typeof userId !== 'string') {
      const error = new Error('IngestSDK linkUser requires `userId` to be passed as a string.')
      return this._handleInputError(error)
    }

    let data = {
      id: userId
    }

    let url = Utils.parseTokens(this.config.byId, {
      resource: this.config.resource,
      id: networkId
    })

    let options = {
      url,
      data: data,
      method: 'LINK'
    }

    return this._sendRequest(options, callback)
  }

  /**
   * Removes the specified user from the specified network.
   *
   * @param  {string}           networkId  The unique ID of the network.
   * @param  {string}           userId     The unique ID of the user to unlink.
   * @param  {Function}         callback   (Optional) Callback to be called when the request is complete.
   *
   * @return {function|Promise}            Calls a callback if one was provided, otherwise returns a promise
   */
  unlinkUser (networkId, userId, callback) {
    if (typeof networkId !== 'string') {
      const error = new Error('IngestSDK unlinkUser requires `networkId` to be passed as a string.')
      return this._handleInputError(error)
    }

    if (typeof userId !== 'string') {
      const error = new Error('IngestSDK unlinkUser requires `userId` to be passed as a string.')
      return this._handleInputError(error)
    }

    let data = {
      id: userId
    }

    let url = Utils.parseTokens(this.config.byId, {
      resource: this.config.resource,
      id: networkId
    })

    let options = {
      url,
      data: data,
      method: 'UNLINK'
    }

    return this._sendRequest(options, callback)
  }

  /**
   * Invites a user to the specified network.
   *
   * @param  {string}           networkId  The unique ID of the network.
   * @param  {string}           email      The email to send the invite to.
   * @param  {string}           name       The name of the person to invite.
   * @param  {boolean}          resend     [Optional] True: Resend an invite. False for first time invite. Default value is false.
   * @param  {Function}         callback   (Optional) Callback to be called when the request is complete.
   *
   * @return {function|Promise}            Calls a callback if one was provided, otherwise returns a promise
   */
  inviteUser (networkId, email, name, resend, callback) {
    if (typeof networkId !== 'string') {
      const error = new Error('IngestSDK inviteUser requires `networkId` to be passed as a string.')
      return this._handleInputError(error)
    }

    if (typeof email !== 'string') {
      const error = new Error('IngestSDK inviteUser requires `email` to be passed as a string.')
      return this._handleInputError(error)
    }

    if (typeof name !== 'string') {
      const error = new Error('IngestSDK inviteUser requires `name` to be passed as a string.')
      return this._handleInputError(error)
    }

    let data = {
      email: email,
      name: name
    }

    if (typeof resend === 'boolean') {
      data.resend = resend
    }

    let url = Utils.parseTokens(this.config.invite, {
      resource: this.config.resource,
      networkId: networkId
    })

    let options = {
      url,
      data: data,
      method: 'POST'
    }

    return this._sendRequest(options, callback)
  }

  /**
   * Gets a list of all secure keys for the network given.
   *
   * @param   {string}          networkId  The unique ID of the network.
   * @param   {Function}        callback   (Optional) Callback to be called when the request is complete.
   *
   * @return  {function|Promise}           Calls a callback if one was provided, otherwise returns a promise
   */
  getSecureKeys (networkId, callback) {
    if (typeof networkId !== 'string') {
      const error = new Error('IngestSDK getSecureKeys requires `networkId` to be passed as a string.')
      return this._handleInputError(error)
    }

    const url = Utils.parseTokens(this.config.keys, {
      resource: this.config.resource,
      networkId: networkId
    })

    const options = {
      url
    }

    return this._sendRequest(options, callback)
  }

  /**
   * Adds a new secure key to the specified network.
   *
   * @param   {string}            networkId   The unique ID of the network.
   * @param   {object}            data        The object containing data for the secure key entry.
   * @param   {string}            data.title  Optional. The title of the secure key. Will default to "Default Key Title"
   * @param   {string}            data.key    The public key in RSA format.
   * @param   {Function}          callback    (Optional) Callback to be called when the request is complete.
   *
   * @return  {function|Promise}              Calls a callback if one was provided, otherwise returns a promise
   */
  addSecureKey (networkId, data, callback) {
    if (typeof networkId !== 'string') {
      const error = new Error('IngestSDK addSecureKey requires `networkId` to be passed as a string.')
      return this._handleInputError(error)
    }

    if (typeof data !== 'object') {
      const error = new Error('IngestSDK addSecureKey requires `data` to be passed as an object.')
      return this._handleInputError(error)
    }

    if (typeof data.key !== 'string') {
      const error = new Error('IngestSDK addSecureKey requires that the key be a string in RSA public key format.')
      return this._handleInputError(error)
    }

    // The title must be a string.
    if (typeof data.title !== 'string') {
      data.title = ''
    }

    const url = Utils.parseTokens(this.config.keys, {
      resource: this.config.resource,
      networkId: networkId
    })

    const options = {
      url,
      method: 'POST',
      data: data
    }

    return this._sendRequest(options, callback)
  }

  /**
   * Retrieves a single network secure key entry based on the unique ID given.
   *
   * @param   {string}          networkId  The unique ID of the network.
   * @param   {string}          keyId      The unique ID of the secure key entry.
   * @param   {Function}        callback   (Optional) Callback to be called when the request is complete.
   *
   * @return  {function|Promise}           Calls a callback if one was provided, otherwise returns a promise
   */
  getSecureKeyById (networkId, keyId, callback) {
    if (typeof networkId !== 'string') {
      const error = new Error('IngestSDK getSecureKeyById requires a `networkId` to be passed as a string.')
      return this._handleInputError(error)
    }

    if (typeof keyId !== 'string') {
      const error = new Error('IngestSDK getSecureKeyById requires a `keyId` to be passed as a string.')
      return this._handleInputError(error)
    }

    const url = Utils.parseTokens(this.config.keysById, {
      resource: this.config.resource,
      networkId: networkId,
      keyId: keyId
    })

    const options = {
      url
    }

    return this._sendRequest(options, callback)
  }

  /**
   * Updates an individual secure key entry in the network specified.
   *
   * @param   {string}          networkId   The unique ID of the network.
   * @param   {object}          data        The object containing data for the secure key entry.
   * @param   {string}          data.title  The title for the current network.
   * @param   {Function}        callback    (Optional) Callback to be called when the request is complete.
   *
   * @return  {function|Promise}            Calls a callback if one was provided, otherwise returns a promise
   */
  updateSecureKey (networkId, data, callback) {
    if (typeof networkId !== 'string') {
      const error = new Error('IngestSDK updateSecureKeyById requires `networkId` to be passed as a string.')
      return this._handleInputError(error)
    }

    if (typeof data !== 'object') {
      const error = new Error('IngestSDK updateSecureKeyById requires `data` to be passed as an object.')
      return this._handleInputError(error)
    }

    if (typeof data.id !== 'string') {
      const error = new Error('IngestSDK updateSecureKeyById requires param `data.id` to be a string.')
      return this._handleInputError(error)
    }

    if (typeof data.title !== 'string') {
      data.title = ''
    }

    const url = Utils.parseTokens(this.config.keysById, {
      resource: this.config.resource,
      networkId: networkId,
      keyId: data.id
    })

    const options = {
      url,
      method: 'PATCH',
      data: data
    }

    return this._sendRequest(options, callback)
  }

  /**
   * Deletes a single network secure key entry based on the unique ID given.
   *
   * @param   {string}          networkId  The unique ID of the network.
   * @param   {string}          keyId      The unique ID of the secure key entry.
   * @param   {Function}        callback   (Optional) Callback to be called when the request is complete.
   *
   * @return  {function|Promise}           Calls a callback if one was provided, otherwise returns a promise
   */
  deleteSecureKey (networkId, keyId, callback) {
    if (typeof networkId !== 'string') {
      const error = new Error('IngestSDK deleteSecureKeyById requires a `networkId` to be passed as a string.')
      return this._handleInputError(error)
    }

    if (typeof keyId !== 'string') {
      const error = new Error('IngestSDK deleteSecureKeyById requires a `keyId` to be passed as a string.')
      return this._handleInputError(error)
    }

    const url = Utils.parseTokens(this.config.keysById, {
      resource: this.config.resource,
      networkId: networkId,
      keyId: keyId
    })

    const options = {
      url: url,
      token: this._tokenSource(),
      method: 'DELETE'
    }

    return this._sendRequest(options, callback)
  }

  /**
   * Creates a Stripe customer for the given network ID.
   *
   * @param   {string}          stripeToken The Stripe token to reference submitted payment details.
   * @param   {string}          networkId   The network UUID for this Stripe customer.
   * @param   {Function}        callback    (Optional) Callback to be called when the request is complete.
   *
   * @return  {function|Promise}            Calls a callback if one was provided, otherwise returns a promise
   */
  createCustomer (stripeToken, networkId, callback) {
    if (typeof stripeToken !== 'string' || typeof networkId !== 'string') {
      const error = new Error('IngestSDK Networks createCustomer requires stripeToken and networkId to be strings.')
      return this._handleInputError(error)
    }

    const url = Utils.parseTokens(this.config.customers, {
      networkId: networkId,
      resource: this.config.resource
    })

    const data = {
      stripeToken: stripeToken
    }

    const options = {
      url,
      data: data,
      method: 'POST'
    }

    return this._sendRequest(options, callback)
  }

  /**
   * Updates an existing Stripe customer for the given network ID.
   *
   * @param   {string}          networkId   The networkID that this Stripe customer belongs to.
   * @param   {string}          cusId       The Stripe customer ID you wish to update.
   * @param   {string}          networkName (Optional) Only provide if you wish to update the network name on the Stripe customer.
   * @param   {string}          stripeToken (Optional) Provide only if payment details have been updated.
   * @param   {Function}        callback    (Optional) Callback to be called when the request is complete.
   *
   * @return  {function|Promise}            Calls a callback if one was provided, otherwise returns a promise
   *
   */
  updateCustomer (networkId, cusId, networkName, stripeToken, callback) {
    if (typeof networkId !== 'string' || typeof cusId !== 'string') {
      const error = new Error('IngestSDK Networks updateCustomer requires `networkId` and `cusID` to be a string.')
      return this._handleInputError(error)
    }

    if (typeof networkName !== 'string' && typeof stripeToken !== 'string') {
      const error = new Error('IngestSDK Networks updateCustomer requires either networkName or stripeToken passed as a string.')
      return this._handleInputError(error)
    }

    const url = Utils.parseTokens(this.config.customerById, {
      resource: this.config.resource,
      networkId: networkId,
      cusId: cusId
    })

    const data = {
      networkName: networkName,
      stripeToken: stripeToken
    }

    const options = {
      url,
      data: data,
      method: 'PATCH'
    }

    return this._sendRequest(options, callback)
  }

  /**
   * Deletes an existing Stripe customer for the given network ID.
   *
   * @param   {string}          networkId   The network ID that the customer belongs to.
   * @param   {string}          cusId       The Stripe customer ID to be deleted.
   * @param   {Function}        callback    (Optional) Callback to be called when the request is complete.
   *
   * @return  {function|Promise}            Calls a callback if one was provided, otherwise returns a promise
   */
  deleteCustomer (networkId, cusId, callback) {
    if (typeof networkId !== 'string' || typeof cusId !== 'string') {
      const error = new Error('IngestSDK Networks deleteCustomer requires `networkId` and `cusId` to be strings.')
      return this._handleInputError(error)
    }

    const url = Utils.parseTokens(this.config.customerById, {
      resource: this.config.resource,
      networkId: networkId,
      cusId: cusId
    })

    const options = {
      url,
      method: 'DELETE'
    }

    return this._sendRequest(options, callback)
  }

  /**
   * Gets a customers card information on file
   *
   * @param   {string}            customerId  The customer ID you wish to get the information for.
   * @param   {string}            networkId   The network ID the customer belongs to.
   * @param   {Function}          callback    (Optional) Callback to be called when the request is complete.
   *
   * @return  {function|Promise}              Calls a callback if one was provided, otherwise returns a promise
   */
  getCustomerCardInformation (networkId, customerId, callback) {
    if (typeof customerId !== 'string' || typeof networkId !== 'string') {
      const error = new Error('IngestSDK Networks getCustomerCardInformation requires networkId and customerId to be strings')
      return this._handleInputError(error)
    }

    const url = Utils.parseTokens(this.config.customerCardInformation, {
      resource: this.config.resource,
      networkId: networkId,
      cusId: customerId
    })

    const options = {
      url
    }

    return this._sendRequest(options, callback)
  }

  /**
   * Remove the credit card currently associated with the proviced customer.
   * @param   {string}          networkId  The network ID the customer belongs to.
   * @param   {string}          networkId  The customer ID.
   * @param   {Function}        callback   (Optional) Callback to be called when the request is complete.
   *
   * @return  {function|Promise}           Calls a callback if one was provided, otherwise returns a promise
   */
  deleteCustomerCard (networkId, customerId, callback) {
    if (typeof customerId !== 'string' || typeof networkId !== 'string') {
      const error = new Error('IngestSDK Networks deleteCustomerCard requires networkId and customerId to be strings')
      return this._handleInputError(error)
    }

    const url = Utils.parseTokens(this.config.customerCardInformation, {
      resource: this.config.resource,
      networkId: networkId,
      cusId: customerId
    })

    const options = {
      url,
      method: 'DELETE'
    }

    return this._sendRequest(options, callback)
  }

  /**
   * Gets a networks invoices
   *
   * @param   {string}          networkId  The network ID that you wish to get the invoices for.
   * @param   {Function}        callback   (Optional) Callback to be called when the request is complete.
   *
   * @return  {function|Promise}           Calls a callback if one was provided, otherwise returns a promise
   */
  getInvoices (networkId, callback) {
    if (typeof networkId !== 'string') {
      const error = new Error('IngestSDK Networks getInvoices requires networkId to be a string')
      return this._handleInputError(error)
    }

    const url = Utils.parseTokens(this.config.invoices, {
      resource: this.config.resource,
      networkId: networkId
    })

    const options = {
      url
    }

    return this._sendRequest(options, callback)
  }

  /**
   * Gets a specific invoice for a network
   *
   * @param   {string}          networkId  The network ID the customer belongs to.
   * @param   {string}          invoiceId  The invoice ID you wish to get the information for.
   * @param   {Function}        callback   (Optional) Callback to be called when the request is complete.
   *
   * @return  {function|Promise}           Calls a callback if one was provided, otherwise returns a promise
   */
  getInvoiceById (networkId, invoiceId, callback) {
    if (typeof networkId !== 'string') {
      const error = new Error('IngestSDK getInvoiceById requires networkId to be passed as a string.')
      return this._handleInputError(error)
    }

    if (typeof invoiceId !== 'string') {
      const error = new Error('IngestSDK getInvoiceById requires invoiceId to be passed as a string.')
      return this._handleInputError(error)
    }

    const url = Utils.parseTokens(this.config.invoicesById, {
      resource: this.config.resource,
      networkId: networkId,
      invoiceId: invoiceId
    })

    const options = {
      url
    }

    return this._sendRequest(options, callback)
  }

  /**
   * Gets current usage for a network
   *
   * @param   {string}          networkId  The network ID the customer belongs to.
   * @param   {Function}        callback   (Optional) Callback to be called when the request is complete.
   *
   * @return  {function|Promise}           Calls a callback if one was provided, otherwise returns a promise
   */
  getCurrentUsage (networkId, callback) {
    if (typeof networkId !== 'string') {
      const error = new Error('IngestSDK getCurrentUsage requires networkId to be passed as a string.')
      return this._handleInputError(error)
    }

    const url = Utils.parseTokens(this.config.currentUsage, {
      resource: this.config.resource,
      networkId: networkId
    })

    const options = {
      url
    }

    return this._sendRequest(options, callback)
  }

  /**
   * Gets all pending users for the specified network.
   *
   * @param   {string}          networkId   The network ID.
   * @param   {Function}        callback    (Optional) Callback to be called when the request is complete.
   *
   * @return  {function|Promise}            Calls a callback if one was provided, otherwise returns a promise
   */
  getPendingUsers (networkId, callback) {
    if (typeof networkId !== 'string') {
      const error = new Error('IngestSDK getPendingUsers requires networkId to be passed as a string.')
      return this._handleInputError(error)
    }

    const url = Utils.parseTokens(this.config.getPendingUsers, {
      resource: this.config.resource,
      networkId: networkId
    })

    const options = {
      url
    }

    return this._sendRequest(options, callback)
  }

  /**
   * Deletes a pending user from the specified network.
   *
   * @param   {string}          networkId       The network ID that the pending user belongs to.
   * @param   {string}          pendingUserId   The pending user to delete from the network.
   * @param   {Function}        callback        (Optional) Callback to be called when the request is complete.
   *
   * @return  {function|Promise}                Calls a callback if one was provided, otherwise returns a promise
   */
  deletePendingUser (networkId, pendingUserId, callback) {
    if (typeof networkId !== 'string' || typeof pendingUserId !== 'string') {
      const error = new Error('IngestSDK deletePendingUser requires networkId and pendingUserId to be passed as strings.')
      return this._handleInputError(error)
    }

    const url = Utils.parseTokens(this.config.deletePendingUser, {
      resource: this.config.resource,
      networkId: networkId,
      pendingUserId: pendingUserId
    })

    const options = {
      method: 'DELETE',
      url
    }

    return this._sendRequest(options, callback)
  }
}

module.exports = new Networks()
