/* eslint-env jest */

const Config = require('../../../lib/core/Config')

describe('Config Tests', () => {
  describe('Config::constructor', () => {
    it('Should have a default options object upon creation', () => {
      expect(Config.options).not.toBeNull()
    })
  })

  describe('Config::setOptions', () => {
    it('Should throw an error if nothing is passed in', () => {
      expect(Config.setOptions).toThrow()
    })

    it('Should throw an error if an object was not passed in', () => {
      expect(Config.setOptions.bind(Config, true)).toThrow()
    })

    it('Should set the options to what was passed in', () => {
      const options = {
        token: 'sometoken',
        host: 'somehost',
        version: 'someversion'
      }

      Config.setOptions(options)

      expect(Config.getToken()).toEqual('sometoken')
      expect(Config.getHost()).toEqual('somehost')
      expect(Config.getVersion()).toEqual('someversion')
    })
  })

  describe('Config::setToken', () => {
    it('Should throw an error if nothing is passed in', () => {
      expect(Config.setToken).toThrow()
    })

    it('Should throw an error if a string was not passed in', () => {
      expect(Config.setToken.bind(Config, true)).toThrow()
    })

    it('Should set the token to what was passed in', () => {
      Config.setToken('sometoken')

      expect(Config.getToken()).toEqual('sometoken')
    })
  })

  describe('Config::setHost', () => {
    it('Should throw an error if nothing is passed in', () => {
      expect(Config.setHost).toThrow()
    })

    it('Should throw an error if a string was not passed in', () => {
      expect(Config.setHost.bind(Config, true)).toThrow()
    })

    it('Should set the host to what was passed in', () => {
      Config.setHost('somehost')

      expect(Config.getHost()).toEqual('somehost')
    })
  })

  describe('Config::setVersion', () => {
    it('Should throw an error if nothing is passed in', () => {
      expect(Config.setVersion).toThrow()
    })

    it('Should throw an error if a string was not passed in', () => {
      expect(Config.setVersion.bind(Config, true)).toThrow()
    })

    it('Should set the token to what was passed in', () => {
      Config.setVersion('someversion')

      expect(Config.getVersion()).toEqual('someversion')
    })
  })
})
