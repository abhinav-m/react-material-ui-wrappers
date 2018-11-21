export function validateUsername (regexString, input = '') {
    const regex = new RegExp(regexString[0])
    var errorObj
    if (input.length === 0) {
      errorObj = {
        errorMessage:'Required field.',
        valid:false
      }
      return errorObj
    }
    if (!regex.test(input)) {
      errorObj = {
        errorMessage:'Invalid username. Symbols # , . , _ are allowed.',
        valid:false
      }
      return errorObj
    } if (input.length !== 0 && input.length < 8) {
      errorObj = {
        errorMessage:'Minimum 8 characters.',
        valid:false
      }
      return errorObj
    } if (input.length > 15) {
      errorObj = {
        errorMessage:'Maximum 15 characters.',
        valid:false
      }
      return errorObj
    } else {
      errorObj = {
        errorMessage:'',
        valid:true
      }
      return errorObj
    }
  }
  