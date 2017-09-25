'use strict'

const Request = require('../core/Request')

class Video {
  constructor () {
  }

  getAllVideos (headers, callback) {

    this.response = new Request({
      url: 'https://api.ingest.info/videos/8c48ee0b-3c25-4011-8482-c9263835af37',
      token: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovLyouaW5nZXN0LmluZm8iLCJjaWQiOiJJbmdlc3REYXNoYm9hcmQiLCJleHAiOjE1MDY0NDc4MDcsImp0aSI6IjIxNmE1OWI0LTk3N2MtNDYwZS04MjJhLWYzNmIxMzI4N2E4ZiIsImlhdCI6MTUwNjM2MTQwNywiaXNzIjoiaHR0cHM6Ly9sb2dpbi5pbmdlc3QuaW5mbyIsIm50dyI6ImI5MWUzOGMzLThlNDItNDQ2MC04N2MxLTJjZWM2YTVkMTkyNyIsInNjb3BlIjp7ImFjdGlvbnMiOlsicGVyc29uYWwiLCJyZWFkX2JpbGxpbmciLCJyZWFkX2NsaWVudHMiLCJyZWFkX2V2ZW50cyIsInJlYWRfaG9va3MiLCJyZWFkX2lucHV0cyIsInJlYWRfam9icyIsInJlYWRfbGl2ZSIsInJlYWRfbmV0S2V5cyIsInJlYWRfbmV0d29ya3MiLCJyZWFkX3Byb2ZpbGVzIiwicmVhZF91c2VycyIsInJlYWRfdmlkZW9zIiwid3JpdGVfYmlsbGluZyIsIndyaXRlX2NsaWVudHMiLCJ3cml0ZV9ob29rcyIsIndyaXRlX2lucHV0cyIsIndyaXRlX2pvYnMiLCJ3cml0ZV9saXZlIiwid3JpdGVfbG9ja2VkX3Byb2ZpbGVzIiwid3JpdGVfbmV0S2V5cyIsIndyaXRlX25ldHdvcmtzIiwid3JpdGVfcHJvZmlsZXMiLCJ3cml0ZV91c2VycyIsIndyaXRlX3ZpZGVvcyJdfSwic3ViIjoiMjMyYjdkODItNGEyNi00ZDJlLTkzOGEtN2VhZTkyOGZmNzU4In0.VMdRzMmx6bJ6oX0iVksOrsTHw4GWFuzFqVVsDRl-dRrKsAzJ10AH9v9YKwBbgPAbu0d2lwvIZDLNuP6MblFoO_gkms5P-DNNfp1AZ6zJbFTfFSxhd6KAuIswSz3HL9XH1i0H4AiTcVw5DgclD07jb4zNb3Sgrz03QvHCFmjExpJK4GLG0BMh4SjeqBkVBqXJD3v36ng79ZulPVbXgIrY28nhsX9kf2Escfx4Op8bRXRkYua76YrPai4BP2xz-YrwbLGcI0_eBD-oI0Z_OJWBeE5tGRoelEwFRRTI6tPAg1dyGbK4VPALN8CJrjU0jqzYx4_w2uXtqpxhXuY3y1zjWg'
    })

    if (callback) {
      return this.response.then((response) => {
        return callback(null, response)
      }, (error) => {
        return callback(error)
      })
    }

    return this.response
  }
}

module.exports = Video
