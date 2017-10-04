'use strict'

const Resource = require('../core/Resource')

/**
 * Events Resource
 *
 * @class
 * @extends Resource
 */
class Events extends Resource {
  constructor () {
    const options = {
      resource: 'events',
      types: '/<%=resource%>/types'
    }
    super(options)
  }
}

module.exports = new Events()


/**
 * Returns a list of the requested events for the current network
 *
 * @param {object} headers      - The headers to apply to the request
 * @param {string} filterStatus - A string of all the statuses to filter by, separated by commas
 * @param {string} filterType   - A string of all the types to filter by, separated by commas
 *
 * @return {Promise}
 */
Events.prototype.getAll = function (headers, filterStatus, filterType) {
  var request, url, filterString;

  filterString = '';

  url = utils.parseTokens(this.config.host + this.config.all, {
    resource: this.config.resource
  });

  // If there is a status filter
  if (filterStatus) {
    if (typeof filterStatus !== 'string') {
      return utils.promisify(false,
        'IngestSDK Events.getAll requires a valid filter status to be passed as a string.');
    }

    filterString = '?filter=' + filterStatus;
  }

  if (filterType) {
    if (typeof filterType !== 'string') {
      return utils.promisify(false,
        'IngestSDK Events.getAll requires a valid filter type to be passed as a string.');
    }

    if (!filterString) {
      filterString = '?resource=' + filterType;
    } else {
      filterString = filterString + '&resource=' + filterType;
    }
  }

  url += filterString;

  request = new Request({
    url: url,
    token: this._tokenSource(),
    headers: headers
  });

  return request.send();
};

/**
 * Gets a list of all event types
 *
 * @return {Promise}
 */
Events.prototype.getTypes = function () {
  var url, request;

  url = utils.parseTokens(this.config.host + this.config.types, {
    resource: this.config.resource
  });

  request = new Request({
    url: url,
    token: this._tokenSource(),
  });

  return request.send();
};

module.exports = Events;
