// /* eslint-env jest */
// jest.mock('../../../lib/core/Request')

// const Uploader = require('../../../lib/modules/Uploader')

// describe('Uploader Tests', () => {
//   const valid_token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIzMjUwMzU5MzYwMCIsInN1YiI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJhZG1pbiI6dHJ1ZX0.SRJ8AvhOJyJPfcl5Aqf8-ZiKVoDy72h0RwJQJzx28nI'; // eslint-disable-line

//   beforeEach(() => {
//     this.uploader = new Uploader({
//       api: {host: 'https://api.ingest.info', token: this.valid_token},
//       file: {
//         name: 'test',
//         size: 123,
//         type: 'video/mp4',
//         data: {} // This can be a stream or a buffer
//       }
//     })

//     this.spy = jest.spyOn(this.uploader, '_sendRequest').mockImplementation(() => {
//       return true
//     })
//   })

//   afterEach(() => {
//     this.spy.mockReset()
//   })

//   describe('Uploader::constructor', () => {
//     it('Should call _determineUploadMethod when an uploader is constructed', () => {
//       jest.spyOn(Uploader.prototype, '_determineUploadMethod')
//       let uploader = new Uploader({
//         api: {host: 'https://api.ingest.info', token: this.valid_token},
//         file: {
//           name: 'test',
//           size: 123,
//           type: 'video/mp4',
//           data: {} // This can be a stream or a buffer
//         }
//       })

//       expect(uploader._determineUploadMethod).toHaveBeenCalled()
//     })
//   })

//   describe('Uploader::progress', () => {
//     it('Should call a callback function to execute when progress is made', () => {
//       this.uploader.progress(function (err, res) {
//         // TODO: need to add a real test here
//         expect(true).toBeTruthy
//       })
//     })
//   })

//   describe('Uploader::_sendRequest', () => {
//     beforeEach(() => {
//       this.spy.mockRestore()
//     })

//     it('Should return a success callback with the data', () => {
//       let options = {
//         pass: true,
//         data: {
//           test: 'test'
//         }
//       }
//       this.uploader._sendRequest(options, (err, res) => {
//         expect(err).toBeNull()
//         expect(res.test).toEqual('test')
//       })
//     })

//     it('Should return an error callback', () => {
//       let options = {
//         pass: false,
//         data: {
//           test: 'error'
//         }
//       }
//       this.uploader._sendRequest(options, (err, res) => {
//         expect(res).toBeNull()
//         expect(err).toEqual(options.data)
//       })
//     })

//     it('Should return a promise', () => {
//       let options = {
//         pass: true,
//         data: {
//           test: 'test'
//         }
//       }
//       let result = this.uploader._sendRequest(options)
//       expect(result.then).toBeDefined()
//     })
//   })
// })
