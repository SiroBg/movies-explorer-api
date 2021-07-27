class ErrorManage {
  constructor(message) {
    this.message = message;
  }

  createError(statusCode) {
    const err = new Error(this.message);
    err.statusCode = statusCode;

    return err;
  }

  manageAuthError() {
    return this.createError(401);
  }

  manageBadRequestError() {
    return this.createError(400);
  }

  manageConflictError() {
    return this.createError(409);
  }

  manageNotFoundError() {
    return this.createError(404);
  }

  manageRightsError() {
    return this.createError(403);
  }
}

module.exports = ErrorManage;
