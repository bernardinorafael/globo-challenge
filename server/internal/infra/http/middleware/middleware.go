package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/bernardinorafael/globo-challenge/internal/infra/token"
	"github.com/bernardinorafael/globo-challenge/pkg/errs"
)

type AuthKey struct{}

type middleware struct {
	secret string
}

func NewWithAuth(secret string) *middleware {
	return &middleware{
		secret: secret,
	}
}

func (m middleware) WithAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		accessToken := r.Header.Get("Authorization")

		if len(accessToken) == 0 {
			errs.HttpError(w, errs.NewUnauthorizedError("access token not provided", nil))
			return
		}

		claims, err := token.Verify(m.secret, accessToken)
		if err != nil {
			if strings.Contains(err.Error(), "token has expired") {
				errs.HttpError(w, errs.NewUnauthorizedError("token has expired", err))
				return
			}
			errs.HttpError(w, errs.NewUnauthorizedError("invalid access token", err))
			return
		}

		ctx := context.WithValue(r.Context(), AuthKey{}, claims)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
