/* eslint-env jest */
jest.mock('../../../lib/core/Request')

const Resource = require('../../../lib/core/Resource')
const Profiles = require('../../../lib/resources/Profiles')

describe('Profiles Tests', () => {
  describe('Profiles:: update', () => {
    it('Should call send request if profile is an object.', () => {
      let resource = Profiles
      let profile = {}

      resource.update(profile, function (err, res) {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call handleInputError if an object is not passed in', () => {
      let resource = Profiles

      resource.update('someValue', function (err, res) {
        expect(resource._handleInputError).toHaveBeenCalled()
      })
    })

    // it('Should call sendRequest when an input is an object and filter is passed in', () => {
    //   let resource = Profiles

    //   let profile = {}
    //   let filter = [{
    //     someValue: 'someValue'
    //   }]

    //   resource.update(profile, filter, function (err, res) {
    //     expect(resource._sendRequest).toHaveBeenCalled()
    //   })
    // })
  })
})
