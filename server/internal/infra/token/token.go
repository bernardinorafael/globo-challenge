package token

import (
	"fmt"
	"strings"
	"time"

	"github.com/aead/chacha20poly1305"
	"github.com/golang-jwt/jwt/v5"
)

func Generate(key, userId, email string, d time.Duration) (string, *Claims, error) {
	if len(key) != chacha20poly1305.KeySize {
		return "", nil, fmt.Errorf("invalid secret key")
	}

	claims, err := NewClaims(userId, email, d)
	if err != nil {
		return "", nil, fmt.Errorf("failed to create claims: %w", err)
	}

	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	token, err := jwtToken.SignedString([]byte(key))
	if err != nil {
		return "", claims, fmt.Errorf("failed to sign token: %w", err)
	}

	return token, claims, nil
}

func Verify(key string, v string) (*Claims, error) {
	if strings.TrimSpace(v) == "" {
		return nil, fmt.Errorf("invalid token")
	}

	keyFunc := func(token *jwt.Token) (any, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("invalid token signing method")
		}
		return []byte(key), nil
	}

	token, err := jwt.ParseWithClaims(v, &Claims{}, keyFunc)
	if err != nil {
		return nil, fmt.Errorf("failed to parse token: %w", err)
	}

	claims, ok := token.Claims.(*Claims)
	if !ok {
		return nil, fmt.Errorf("invalid token claims")
	}

	return claims, nil
}
