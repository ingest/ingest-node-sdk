/* eslint-env jest */
jest.mock('../../../lib/core/Request')

const Resource = require('../../../lib/core/Resource')
const Livestreams = require('../../../lib/resources/Livestreams')

describe('Livestreams Tests', () => {
  beforeEach(() => {
    this.resource = Livestreams
    this.spy = jest.spyOn(this.resource, '_sendRequest')
  })

  afterEach(() => {
    this.spy.mockReset()
  })

  describe('Livestreams:: getAll', () => {
    it('Should call send request if params are all valid', () => {
      this.resource.getAll({}, 'status', (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call send request if no status is passed in', () => {
      this.resource.getAll({}, null, (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call handleInputError if status is not passed as a string', () => {
      let status = {
        status: 'test'
      }
      jest.spyOn(this.resource, '_handleInputError')

      this.resource.getAll({}, status, (err, res) => {
        expect(this.resource._handleInputError).toHaveBeenCalled()
        expect(this.resource._sendRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('Livestreams:: getStatus', () => {
    it('Should call send request if params are all valid', () => {
      this.resource.getStatus('testId', (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call handleInputError if filterStatus is not a string', () => {
      jest.spyOn(this.resource, '_handleInputError')

      this.resource.getStatus({}, (err, res) => {
        expect(this.resource._handleInputError).toHaveBeenCalled()
      })
    })
  })

  describe('Livestreams:: delete', () => {
    it('Should call send request if params are all valid', () => {
      this.resource.delete('id', true, (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call send request if end param is false', () => {
      this.resource.delete('id', false, (err, res) => {
        expect(this.resource._sendRequest).toHaveBeenCalled()
      })
    })

    it('Should call handleInputError if id is not a string', () => {
      jest.spyOn(this.resource, '_handleInputError')

      this.resource.delete({}, false, (err, res) => {
        expect(this.resource._handleInputError).toHaveBeenCalled()
      })
    })
  })
})
