/* eslint-env jest */
const Utils = require('../../../lib/core/Utils')
const Config = require('../../../lib/core/Config')

describe('Utils Tests', () => {
  // This valid tokens expiry is in the year 2999
  const validToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIzMjUwMzU5MzYwMCIsInN1YiI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJhZG1pbiI6dHJ1ZX0.SRJ8AvhOJyJPfcl5Aqf8-ZiKVoDy72h0RwJQJzx28nI'; // eslint-disable-line
  const invalidToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIxNDUwMzY2NzkxIiwic3ViIjoiMTIzNDU2Nzg5MCIsIm5hbWUiOiJKb2huIERvZSIsImFkbWluIjp0cnVlfQ.MGdv4o_sNc84OsRlsitw6D933A3zBqEEacEdp30IQeg';  //eslint-disable-line
  const malformedToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UifQ.xuEv8qrfXu424LZk8bVgr9MQJUIrp1rHcPyZw_KSsds' //eslint-disable-line
  const payloadErrorToken = 'Bearer test.test'
  const nullToken = 'Bearer test'

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
      const result = Utils.parseTokenPayload(validToken)
      expect(result).not.toBeNull()
    })

    it('Should return null if no token is passed in', () => {
      const result = Utils.parseTokenPayload()
      expect(result).toBeNull()
    })

    it('Should return null if the token is invalid', () => {
      const result = Utils.parseTokenPayload(nullToken)
      expect(result).toBeNull()
    })

    it('Should return null if parsed payload errors', () => {
      const result = Utils.parseTokenPayload(payloadErrorToken)
      expect(result).toBeNull()
    })
  })

  describe('Utils::isExpired', () => {
    it('Should return false if the token is still valid', function () {
      let result = Utils.isExpired(validToken)
      expect(result).toEqual(false)
    })

    it('Should return true if the token is expired.', function () {
      expect(Utils.isExpired(invalidToken)).toEqual(true)
    })

    it('Should return true if the token does not have an exp.', function () {
      expect(Utils.isExpired(malformedToken)).toEqual(true)
    })

    it('Should return true if data is null', function () {
      this.spy = jest.spyOn(Utils, 'parseTokenPayload').mockImplementation(() => {
        return null
      })
      expect(Utils.isExpired(malformedToken)).toEqual(true)
    })
  })
})
