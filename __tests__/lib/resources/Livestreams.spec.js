/* eslint-env jest */
const Livestreams = require('../../../lib/resources/Livestreams')

describe('Livestreams Tests', () => {
  beforeEach(() => {
    this.resource = Livestreams
    this.spy = jest.spyOn(this.resource, '_sendRequest').mockImplementation((options, callback) => {
      callback(null, true)
    })
    this.errorSpy = jest.spyOn(this.resource, '_handleInputError')
  })

  afterEach(() => {
    this.spy.mockReset()
    this.errorSpy.mockReset()
  })

  describe('Livestreams:: getAll', () => {
    it('Should call send request if headers, status and callback are passed in', () => {
      this.resource.getAll({}, 'status', (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call send request if no status is passed in', () => {
      this.resource.getAll({}, null, (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call handleInputError if status is not passed as a string', () => {
      const status = {
        status: 'test'
      }

      this.resource.getAll({}, status, (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Livestreams:: getStatus', () => {
    it('Should call send request if id is passed as a string', () => {
      this.resource.getStatus('testId', (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call handleInputError if id is not a string', () => {
      this.resource.getStatus({}, (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
      })
    })
  })

  describe('Livestreams:: delete', () => {
    it('Should call send request if id, end and callback are all valid', () => {
      this.resource.delete('id', true, (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call send request if end param is false', () => {
      this.resource.delete('id', false, (err, res) => {
        expect(res).toBeDefined()
        expect(err).toBeNull()
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call handleInputError if id is not a string', () => {
      this.resource.delete({}, false, (err, res) => {
        expect(err).toBeDefined()
        expect(res).toBeNull()
        expect(this.resource._handleInputError).toHaveBeenCalled()
      })
    })
  })
})
