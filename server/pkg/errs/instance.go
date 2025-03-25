package errs

import (
	"fmt"
)

type ErrorCode string

const (
	AccessTokenUnauthorized ErrorCode = "ACCESS_TOKEN_UNAUTHORIZED"
	InternalServerError     ErrorCode = "INTERNAL_SERVER_ERROR"
	BadRequest              ErrorCode = "BAD_REQUEST"
	InvalidCredentials      ErrorCode = "INVALID_CREDENTIALS"
	NotFound                ErrorCode = "NOT_FOUND"
	Expired                 ErrorCode = "EXPIRED"
	InvalidField            ErrorCode = "INVALID_FIELD"
	ResourceConflict        ErrorCode = "RESOURCE_ALREADY_TAKEN"
	ResourceLimitReached    ErrorCode = "RESOURCE_LIMIT_REACHED"
)

type ApplicationError struct {
	HTTPCode int       `json:"-"`
	Err      error     `json:"-"`
	Code     ErrorCode `json:"code"`
	Msg      string    `json:"message"`
}

func NewAppError(httpCode int, code ErrorCode, msg string, err error) ApplicationError {
	return ApplicationError{
		HTTPCode: httpCode,
		Err:      err,
		Code:     code,
		Msg:      msg,
	}
}

func (e ApplicationError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("%s: %s (caused by: %v)", e.Code, e.Msg, e.Err)
	}
	return fmt.Sprintf("%s: %s", e.Code, e.Msg)
}

func (e ApplicationError) Unwrap() error   { return e.Err }
func (e ApplicationError) StatusCode() int { return e.HTTPCode }
