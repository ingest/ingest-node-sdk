'use strict'

const Resource = require('../core/Resource')
const Utils = require('../core/Utils')

class Users extends Resource {
  constructor () {
    const overrides = {
      resource: 'users',
      currentUser: '/users/me',
      transfer: '/users/<%=oldId%>/transfer/<%=newId%>',
      updateRoles: '/users/<%=id%>/roles',
      revoke: '/revoke'
    }
    super(overrides)
  }

  /**
   * Retrieve information for the current user.
   *
   * @return {Promise} A promise which resolves when the request is complete.
   */
  getCurrentUserInfo(callback) {
    const url = Utils.parseTokens(this.config.all, {
      resource: this.config.currentUser
    })
    const options = {
      url
    }

    return this._sendRequest(options, callback)
  }

  /**
   * Transfer all authorship currently under the specified user onto another.
   * This includes all videos.
   * This task is commonly used in conjunction with permanently deleting a user.
   *
   * @param {string} oldId - The user who currently has authorship.
   * @param {string} newId - The user to transfer authorship to.
   *
   * @return {Promise} A promise which resolves when the request is complete.
   */
  transferUserAuthorship(oldId, newId, callback) {
    let url, options
    if (typeof oldId !== 'string') {
        const error = new Error('IngestSDK transferUserAuthorship requires `oldId` to be passed as a string.')
        return this._handleInputError(error, callback)
    }

    if (typeof newId !== 'string') {
        const error = new Error('IngestSDK transferUserAuthorship requires `newId` to be passed as a string.')
        return this._handleInputError(error, callback)
    }

    url = Utils.parseTokens(this.config.all, {
      resource: this.config.transfer,
      oldId: oldId,
      newId: newId
    })

    options = {
      url,
      method: 'PATCH'
    }

    return this._sendRequest(options, callback)
  }

  /**
   * Revokes the authorization token for the current user.
   *
   * @return {Promise} A promise which resolves when the request is complete.
   */
  revokeCurrentUser(callback) {
    const url = Utils.parseTokens(this.config.all, {
      resource: this.config.currentUser + this.config.revoke
    })
    const options = {
      url,
      method: 'DELETE'
    }

    return this._sendRequest(options, callback)
  };

  /**
   * Updates a user with the passed in roles
   *
   * @param {string} id      - The id of the user to update their roles
   * @param {array}  roleIDs - The role ids of the roles you wish to assign to the user
   *
   * @return {Promise} A promise which resolves when the request is complete.
   */
  updateUserRoles(id, roleIDs, callback) {
    let request, url, data, options
    if (!Array.isArray(roleIDs) || roleIDs.length < 1) {
      const error = new Error('IngestSDK updateUserRoles requires `roleIDs` to be passed as an array.')
      return this._handleInputError(error, callback)
    }

    if (typeof id !== 'string') {
      const error = new Error('IngestSDK updateUserRoles requires `id` to be passed as a string.')
      return this._handleInputError(error, callback)
    }

    // Get the url
    url = Utils.parseTokens(this.config.updateRoles, {
      id: id
    })

    // Set the data into a structure the api can use it
    data = {
      role_ids: roleIDs
    }

    options = {
      url: url,
      method: 'PUT',
      data: data
    }

    return this._sendRequest(options, callback)
  };
}


module.exports = new Users()
