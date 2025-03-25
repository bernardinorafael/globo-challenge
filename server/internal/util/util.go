package util

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"regexp"
	"strings"

	"github.com/jmoiron/sqlx"
	"github.com/segmentio/ksuid"
)

// ExecTx executes a function in a database transaction
func ExecTx(ctx context.Context, db *sqlx.DB, fn func(*sqlx.Tx) error) error {
	tx, err := db.BeginTxx(ctx, nil)
	if err != nil {
		return fmt.Errorf("failed to start tx: %w", err)
	}

	err = fn(tx)
	if err != nil {
		if rollbackErr := tx.Rollback(); rollbackErr != nil {
			return fmt.Errorf("error rolling back tx: %w", err)
		}
		return fmt.Errorf("something went wrong with tx: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return fmt.Errorf("error commiting tx: %w", err)
	}

	return nil
}

// ParseKey extracts the field name from a pg error detail string
// The detail string should contain a pattern in the format "Key (field)=value"
func ParseKey(detail string) string {
	detail = strings.TrimSpace(detail)

	// Compile the regular expression to find the pattern "Key (field)="
	re := regexp.MustCompile(`(?i)Key\s*\(\s*(.*?)\s*\)\s*=`)
	matches := re.FindStringSubmatch(detail)

	if len(matches) > 1 {
		return matches[1]
	}
	return ""
}

// GenID generates a unique ID for a given prefix
func GenID(prefix string) string {
	return fmt.Sprintf("%s_%s", prefix, ksuid.New().String())
}

// WriteJSON writes a JSON response with the specified HTTP status code and the provided data.
func WriteJSON(w http.ResponseWriter, code int, dst any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(dst)
}

// WriteSuccess writes a JSON success response with the specified HTTP status code
func WriteSuccess(w http.ResponseWriter, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(map[string]bool{
		"success": true,
	})
}

// ReadRequestBody reads the request body and unmarshals it into the given destination
func ReadRequestBody(w http.ResponseWriter, r *http.Request, dst any) error {
	d := json.NewDecoder(r.Body)
	d.DisallowUnknownFields()

	err := d.Decode(dst)
	if err != nil {
		var syntaxError *json.SyntaxError
		var unmarshalTypeError *json.UnmarshalTypeError
		var invalidUnmarshalError *json.InvalidUnmarshalError
		var maxBytesError *http.MaxBytesError

		switch {
		case errors.As(err, &syntaxError):
			// JSON syntax error in the request body
			// Offset is the exact byte where the error occurred
			return fmt.Errorf("body contains badly-formed JSON (at character %d)", syntaxError.Offset)
		case errors.As(err, &unmarshalTypeError):
			// JSON value and struct type do not match
			if unmarshalTypeError.Field != "" {
				return fmt.Errorf("body contains incorrect JSON for field %q", unmarshalTypeError.Field)
			}
			return fmt.Errorf("body contains incorrect JSON type (at character %d)", unmarshalTypeError.Offset)
		case errors.Is(err, io.EOF):
			// io.EOF (End of File) indicates that there are no more bytes left to read
			return errors.New("body cannot be empty")
		case errors.As(err, &maxBytesError):
			return fmt.Errorf("body must not be larger than %d bytes", maxBytesError.Limit)
		case strings.HasPrefix(err.Error(), "json: unknown field "):
			fieldName := strings.TrimPrefix(err.Error(), "json: unknown field ")
			return fmt.Errorf("body contains unknown key %s", fieldName)
		case errors.As(err, &invalidUnmarshalError):
			// Received a non-nil pointer into Decode()
			panic(err)
		default:
			return err
		}
	}

	return nil
}
