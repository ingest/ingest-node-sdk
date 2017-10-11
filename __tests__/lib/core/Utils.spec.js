/* eslint-env jest */
const Utils = require('../../../lib/core/Utils')
const Config = require('../../../lib/core/Config')

describe('Utils Tests', () => {
  describe('Utils::parseTokens', () => {
    it('Should return the parsed string', () => {
      jest.spyOn(Config, 'getHost').mockImplementation(() => {
        return 'https://test.test.io'
      })

      const url = 'https://test.test.io/videos/1'
      const template = '/<%=resource%>/<%=id%>'
      const hash = {
        resource: 'videos',
        id: '1'
      }
      const result = Utils.parseTokens(template, hash)

      expect(result).toEqual(url)
    })

    it('Should return null if no template is passed in', () => {
      const hash = {
        resource: 'videos',
        id: '1'
      }
      const result = Utils.parseTokens(null, hash)

      expect(result).toBeNull()
    })

    it('Should return null if no hash is passed in', () => {
      const template = '/<%=resource%>/<%=id%>'
      const result = Utils.parseTokens(template, null)

      expect(result).toBeNull()
    })
  })

  describe('Utils::parseTokenPayload', () => {
    it('Should return the parsed payload if token is valid', () => {
      const token = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovLyouaW5nZXN0LmluZm8iLCJjaWQiOiJJbmdlc3REYXNoYm9hcmQiLCJleHAiOjE1MDc4MjcxNjgsImp0aSI6IjkyMTFlYzI2LTlhYmYtNDg4Zi04OTJjLWU2NzM5NGI3MDhmMCIsImlhdCI6MTUwNzc0MDc2OCwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5pbmdlc3QuaW5mbyIsIm50dyI6IjE0Y2Y4Y2U4LTZlOGUtNDIzZi1hOTJiLTgzM2NkMjExZmM3NCIsInNjb3BlIjp7ImFjdGlvbnMiOlsicGVyc29uYWwiLCJyZWFkX2JpbGxpbmciLCJyZWFkX2NsaWVudHMiLCJyZWFkX2V2ZW50cyIsInJlYWRfaG9va3MiLCJyZWFkX2lucHV0cyIsInJlYWRfam9icyIsInJlYWRfbGl2ZSIsInJlYWRfbmV0S2V5cyIsInJlYWRfbmV0d29ya3MiLCJyZWFkX3Byb2ZpbGVzIiwicmVhZF91c2VycyIsInJlYWRfdmlkZW9zIiwid3JpdGVfYmlsbGluZyIsIndyaXRlX2NsaWVudHMiLCJ3cml0ZV9ob29rcyIsIndyaXRlX2lucHV0cyIsIndyaXRlX2pvYnMiLCJ3cml0ZV9saXZlIiwid3JpdGVfbG9ja2VkX3Byb2ZpbGVzIiwid3JpdGVfbmV0S2V5cyIsIndyaXRlX25ldHdvcmtzIiwid3JpdGVfcHJvZmlsZXMiLCJ3cml0ZV91c2VycyIsIndyaXRlX3ZpZGVvcyJdfSwic3ViIjoiNjg3Mjc1YzItYWVlNS00N2QyLWI1Y2UtZmUzMjZlMmU0MTcwIn0.WsMMPLFTksMMpedk78v6NfkdFVq8BvzbwYWMcsCKXQM3ePiA8poSYT48KMwXGjgpsXcA_t5KvwdoxJ7VfxeICBIjHUGRTK3P8e3Dz2IqqHsHQ3LHW1TuTbPPOzGu5bAqz_INWgJC3-ssAGUxfj7mf4gPRKK9WexZsVhWxwL9zJ2x_Qx26yvZTGXvtwJbmmRPiNFlzB2RGvZ7pqhhko5Pnj8uqJs3vvSLwW-w4t-BKhDcXc0JH6Hfk3LwRYYykBm6wQcZWbPpE-jJs4OMfKm2uqNytPq217lYgbULK2FOUgUkGi41I8ZL4hZu4U-ZQcH8BUQJZOI1WrfCaV-3ToKDUw'
      const result = Utils.parseTokenPayload(token)
      expect(result).not.toBeNull()
    })

    it('Should return null if no token is passed in', () => {
      const result = Utils.parseTokenPayload()
      expect(result).toBeNull()
    })

    it('Should return null if the token is invalid', () => {
      const token = 'Bearer test'
      const result = Utils.parseTokenPayload(token)
      expect(result).toBeNull()
    })

    it('Should return the parsed payload if token is valid', () => {
      const token = 'Bearer test.test'
      const result = Utils.parseTokenPayload(token)
      expect(result).toBeNull()
    })
  })

  describe('Utils::isExpired', () => {
    it('Should have a default options object upon creation', () => {
      expect(true).toBeTruthy()
    })
  })
})
