package errs

import (
	"encoding/json"
	"net/http"
)

func HttpError(w http.ResponseWriter, err error) {
	w.Header().Set("Content-Type", "application/json")

	if err, ok := err.(ApplicationError); ok {
		w.WriteHeader(err.StatusCode())
		_ = json.NewEncoder(w).Encode(err)
		return
	}

	w.WriteHeader(http.StatusInternalServerError)
	_ = json.NewEncoder(w).Encode(NewInternalServerError(err))
}

func NewUnprocessableEntityError(msg string, err error) ApplicationError {
	httpCode := http.StatusUnprocessableEntity
	return NewAppError(httpCode, InvalidField, msg, err)
}

func NewUnauthorizedError(msg string, err error) ApplicationError {
	httpCode := http.StatusUnauthorized
	return NewAppError(httpCode, AccessTokenUnauthorized, msg, err)
}

func NewInternalServerError(err error) ApplicationError {
	httpCode := http.StatusInternalServerError
	return NewAppError(httpCode, InternalServerError, "something went wrong", err)
}

func NewForbiddenError(msg string, code ErrorCode, err error) ApplicationError {
	httpCode := http.StatusForbidden
	return NewAppError(httpCode, code, msg, err)
}

func NewBadRequestError(msg string, err error) ApplicationError {
	httpCode := http.StatusBadRequest
	return NewAppError(httpCode, BadRequest, msg, err)
}

func NewNotFoundError(msg string, err error) ApplicationError {
	httpCode := http.StatusNotFound
	return NewAppError(httpCode, NotFound, msg, err)
}

func NewConflictError(msg string, err error) ApplicationError {
	httpCode := http.StatusConflict
	return NewAppError(httpCode, ResourceConflict, msg, err)
}
