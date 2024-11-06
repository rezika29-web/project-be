export class ErrorHelper {

  internalError(message: string = "Internal server error"):TApiError {
    return {
      isApiError: true,
      num: 500,
      message,
    }
  }

  badRequest(message: string = "Bad request"):TApiError {
    return {
      isApiError: true,
      num: 400,
      message,
    }
  }

  notFound(message: string = "Not found"):TApiError {
    return {
      isApiError: true,
      num: 404,
      message,
    }
  }

  accessDenied(message: string = "Access denied"):TApiError {
    return {
      isApiError: true,
      num: 403,
      message,
    }
  }

}

export const errorHelper = new ErrorHelper()
export const internalError = errorHelper.internalError
export const badRequest = errorHelper.badRequest
export const notFound = errorHelper.notFound
export const accessDenied = errorHelper.accessDenied