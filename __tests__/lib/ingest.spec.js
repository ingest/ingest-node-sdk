/* eslint-env jest */

const Ingest = require('../../lib/ingest')
const Config = require('../../lib/core/Config')

const exposedResources = [
  'Videos'
]

describe('Ingest Tests', () => {
  beforeEach(() => {
    jest.spyOn(Config, 'setOptions')
    jest.spyOn(Config, 'setToken')
  })

  describe('Ingest::constructor', () => {
    it('Should not call Config.setOptions if nothing is passed in', () => {
      const SDK = new Ingest()

      expect(Config.setOptions).not.toBeCalled()

      exposedResources.forEach((resource) => {
        expect(SDK[resource]).toBeDefined()
      })
    })

    it('Should call Config.setOptions if options are passed in', () => {
      const SDK = new Ingest({
        token: 'sometoken',
        version: 'someversion',
        host: 'somehost'
      })

      expect(Config.setOptions).toBeCalled()
      expect(Config.getToken()).toEqual('sometoken')
      expect(Config.getHost()).toEqual('somehost')
      expect(Config.getVersion()).toEqual('someversion')

      exposedResources.forEach((resource) => {
        expect(SDK[resource]).toBeDefined()
      })
    })
  })

  describe('Ingest::setToken', () => {
    it('Should call config.setToken when called', () => {
      const SDK = new Ingest()

      SDK.setToken('sometoken')

      expect(Config.setToken).toHaveBeenCalled()
      expect(Config.getToken()).toEqual('sometoken')
    })
  })
})
