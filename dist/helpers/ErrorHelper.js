"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessDenied = exports.notFound = exports.badRequest = exports.internalError = exports.errorHelper = exports.ErrorHelper = void 0;
class ErrorHelper {
    internalError(message = "Internal server error") {
        return {
            isApiError: true,
            num: 500,
            message,
        };
    }
    badRequest(message = "Bad request") {
        return {
            isApiError: true,
            num: 400,
            message,
        };
    }
    notFound(message = "Not found") {
        return {
            isApiError: true,
            num: 404,
            message,
        };
    }
    accessDenied(message = "Access denied") {
        return {
            isApiError: true,
            num: 403,
            message,
        };
    }
}
exports.ErrorHelper = ErrorHelper;
exports.errorHelper = new ErrorHelper();
exports.internalError = exports.errorHelper.internalError;
exports.badRequest = exports.errorHelper.badRequest;
exports.notFound = exports.errorHelper.notFound;
exports.accessDenied = exports.errorHelper.accessDenied;
