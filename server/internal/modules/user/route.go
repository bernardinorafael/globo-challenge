package user

import (
	"net/http"
	"sync"

	"github.com/bernardinorafael/globo-challenge/internal/infra/http/middleware"
	"github.com/bernardinorafael/globo-challenge/internal/infra/token"
	"github.com/bernardinorafael/globo-challenge/internal/shared/dto"
	"github.com/bernardinorafael/globo-challenge/internal/util"
	"github.com/bernardinorafael/globo-challenge/pkg/errs"
	"github.com/go-chi/chi"
)

var (
	instance *controller
	Once     sync.Once
)

type controller struct {
	userService Service
	secretKey   string
}

func NewController(userService Service, secretKey string) *controller {
	Once.Do(func() {
		instance = &controller{
			userService: userService,
			secretKey:   secretKey,
		}
	})
	return instance
}

func (c controller) RegisterRoutes(r *chi.Mux) {
	basePath := "/api/v1/"
	m := middleware.NewWithAuth(c.secretKey)

	r.Route(basePath+"auth", func(r chi.Router) {
		r.Post("/register", c.handleRegister)
		r.Post("/login", c.handleLogin)

	})

	r.Route(basePath+"users", func(r chi.Router) {
		r.Use(m.WithAuth)
		r.Get("/me", c.handleGetSignedUrl)
	})
}

func (c controller) handleGetSignedUrl(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	claims, ok := ctx.Value(middleware.AuthKey{}).(*token.Claims)
	if !ok {
		errs.HttpError(w, errs.NewUnauthorizedError("invalid and/or expired token", nil))
		return
	}
	userId := claims.UserID

	user, err := c.userService.GetSignedUser(ctx, userId)
	if err != nil {
		errs.HttpError(w, err)
		return
	}

	util.WriteJSON(w, http.StatusOK, user)
}

func (c controller) handleRegister(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var body dto.Register
	if err := util.ReadRequestBody(w, r, &body); err != nil {
		errs.HttpError(w, err)
		return
	}

	if err := c.userService.Register(ctx, body); err != nil {
		errs.HttpError(w, err)
		return
	}

	util.WriteSuccess(w, http.StatusCreated)
}

func (c controller) handleLogin(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var body dto.Login
	if err := util.ReadRequestBody(w, r, &body); err != nil {
		errs.HttpError(w, err)
		return
	}

	res, err := c.userService.Login(ctx, body)
	if err != nil {
		errs.HttpError(w, err)
		return
	}

	util.WriteJSON(w, http.StatusOK, res)
}
