/* eslint-env jest */
jest.mock('../../../lib/core/Request')

const Resource = require('../../../lib/core/Resource')
const Jobs = require('../../../lib/resources/Jobs')

describe('Jobs Tests', () => {
  beforeEach(() => {
    this.resource = Jobs
    this.spy = jest.spyOn(this.resource, '_sendRequest')
  })

  afterEach(() => {
    this.spy.mockReset()
  })

  describe('Jobs:: add', () => {
    it('Should call send request when a job is added.', () => {
      let job = {
        inputs: [
          "test"
        ],
        profile: "test",
        video: "test"
      }
      this.resource.add(job, (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call handleInputError if an object is not passed in', () => {
      jest.spyOn(this.resource, '_handleInputError')

      this.resource.add('someValue', (err, res) => {
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })


  })

  describe('Jobs:: progress', () => {
    it('Should call _sendRequest if parameters are valid', () => {
      this.resource.progress('test', (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if invalid', () => {
      jest.spyOn(this.resource, '_handleInputError')

      this.resource.progress({}, (err, res) => {
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })
})
