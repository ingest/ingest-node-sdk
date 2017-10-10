/* eslint-env jest */
jest.mock('../../../lib/core/Request')

const Resource = require('../../../lib/core/Resource')
const Jobs = require('../../../lib/resources/Jobs')

describe('Jobs Tests', () => {
  describe('Jobs:: add', () => {
    it('Should call send request when a job is added.', () => {
      let resource = Jobs
      let job = {
        inputs: [
          "test"
        ],
        profile: "test",
        video: "test"
      }
      resource.add(job, function (err, res) {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call handleInputError if an object is not passed in', () => {
      let resource = Jobs

      resource.add('someValue', function (err, res) {
        expect(resource._handleInputError).toHaveBeenCalled()
      })
    })


  })

  describe('Jobs:: progress', () => {
    it('Should call _sendRequest if parameters are valid', () => {
      let resource = Jobs
      let id = "someValue"

      resource.progress(id, function (err, res) {
        expect(resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if invalid', () => {
      let resource = Jobs

      resource.progress({}, function (err, res) {
        expect(resource._handleInputError).toHaveBeenCalled()
      })
    })
  })
})
