/* eslint-env jest */
jest.mock('../../../lib/core/Request')

// const Resource = require('../../../lib/core/Resource')
// const Videos = require('../../../lib/resources/Videos')

describe('Videos Tests', () => {
  describe('Videos:: getAll', () => {
    it('temporary test', () => {
      expect(true).toBeTruthy()
    })

    // it('Should call _sendRequest if no headers are passed in', () => {
    //   let resource = new Resource()
    //   resource.getAll(function (err, res) {
    //     expect(resource._sendRequest).toHaveBeenCalled()
    //   })
    // })

    // it('Should call _sendRequest if null headers are passed in', () => {
    //   let resource = new Resource()
    //   resource.getAll(null, function (err, res) {
    //     expect(resource._sendRequest).toHaveBeenCalled()
    //   })
    // })

    // it('Should call _sendRequest if no callback is passed in', () => {
    //   let resource = new Resource()
    //   resource.getAll(null).then(data => {
    //     expect(resource._sendRequest).toHaveBeenCalled()
    //   })
    // })
  })
})
