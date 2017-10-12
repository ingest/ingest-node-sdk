/* eslint-env jest */
const Jobs = require('../../../lib/resources/Jobs')

describe('Jobs Tests', () => {
  beforeEach(() => {
    this.resource = Jobs
    this.spy = jest.spyOn(this.resource, '_sendRequest').mockImplementation((options, callback) => {
      callback(null, true)
    })
    this.errorSpy = jest.spyOn(this.resource, '_handleInputError')
  })

  afterEach(() => {
    this.spy.mockReset()
    this.errorSpy.mockReset()
  })

  describe('Jobs:: add', () => {
    it('Should call send request when a job resource is passed in.', () => {
      let job = {
        inputs: [
          'test'
        ],
        profile: 'test',
        video: 'test'
      }
      this.resource.add(job, (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call handleInputError if an object is not passed in', () => {
      this.resource.add('someValue', (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Jobs:: progress', () => {
    it('Should call _sendRequest if id is passed as a string', () => {
      this.resource.progress('test', (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call _handleInputError if id is not a string', () => {
      this.resource.progress({}, (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })
})
