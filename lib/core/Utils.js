'use strict'

const config = require('./Config')

class Utils {
  constructor () {}

  parseTokens (template, hash) {
    if (!template || !hash) {
      return null;
    }

    let keys = Object.keys(hash);
    let i;
    let length = keys.length;

    template = config.getHost();
    for (i = 0; i < length; i++) {
      template += template.replace('<%=' + keys[i] + '%>', hash[keys[i]]);
    }

    return template;
  };
}

module.exports = new Utils()
