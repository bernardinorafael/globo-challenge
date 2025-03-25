package elimination

import (
	"net/http"
	"sync"

	"github.com/bernardinorafael/globo-bbb-challenge/internal/infra/http/middleware"
	"github.com/bernardinorafael/globo-bbb-challenge/internal/infra/token"
	"github.com/bernardinorafael/globo-bbb-challenge/internal/shared/dto"
	"github.com/bernardinorafael/globo-bbb-challenge/internal/util"
	"github.com/bernardinorafael/globo-bbb-challenge/pkg/errs"
	"github.com/go-chi/chi"
)

var (
	instance *controller
	Once     sync.Once
)

type controller struct {
	eliminationService Service
	secretKey          string
}

func NewController(eliminationService Service, secretKey string) *controller {
	Once.Do(func() {
		instance = &controller{
			eliminationService: eliminationService,
			secretKey:          secretKey,
		}
	})
	return instance
}

func (c controller) RegisterRoutes(r *chi.Mux) {
	m := middleware.NewWithAuth(c.secretKey)

	r.Route("/api/v1/eliminations", func(r chi.Router) {
		// Private
		r.With(m.WithAuth).Post("/", c.handleCreateElimination)
		r.With(m.WithAuth).Post("/{eliminationId}/vote", c.handleVote)
		r.With(m.WithAuth).Get("/{eliminationId}/result", c.handleGetResult)
		r.With(m.WithAuth).Patch("/{eliminationId}/finish", c.handleFinishElimination)
		r.With(m.WithAuth).Get("/", c.handleGetAllEliminations)
		r.With(m.WithAuth).Get("/dashboard", c.handleGetDashboard)
		// Public
		r.Get("/open", c.handleGetAllEliminationsOpen)
	})
}

func (c controller) handleGetDashboard(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	res, err := c.eliminationService.GetDashboard(ctx)
	if err != nil {
		errs.HttpError(w, err)
		return
	}

	util.WriteJSON(w, http.StatusOK, res)
}

func (c controller) handleGetResult(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	res, err := c.eliminationService.GetResult(ctx, chi.URLParam(r, "eliminationId"))
	if err != nil {
		errs.HttpError(w, err)
		return
	}

	util.WriteJSON(w, http.StatusOK, res)
}

func (c controller) handleFinishElimination(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	err := c.eliminationService.FinishElimination(ctx, chi.URLParam(r, "eliminationId"))
	if err != nil {
		errs.HttpError(w, err)
		return
	}

	util.WriteSuccess(w, http.StatusOK)
}

func (c controller) handleVote(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	claims, ok := ctx.Value(middleware.AuthKey{}).(*token.Claims)
	if !ok {
		errs.HttpError(w, errs.NewUnauthorizedError("invalid and/or expired token", nil))
		return
	}

	var body dto.CreateVote
	body.EliminationID = chi.URLParam(r, "eliminationId")
	body.UserID = claims.UserID

	err := util.ReadRequestBody(w, r, &body)
	if err != nil {
		errs.HttpError(w, err)
		return
	}

	err = c.eliminationService.Vote(ctx, body)
	if err != nil {
		errs.HttpError(w, err)
		return
	}

	util.WriteSuccess(w, http.StatusCreated)
}

func (c controller) handleCreateElimination(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var body struct {
		Participants []string `json:"participants"`
	}

	err := util.ReadRequestBody(w, r, &body)
	if err != nil {
		errs.HttpError(w, err)
		return
	}

	err = c.eliminationService.CreateElimination(ctx, body.Participants)
	if err != nil {
		errs.HttpError(w, err)
		return
	}

	util.WriteJSON(w, http.StatusCreated, nil)
}

func (c controller) handleGetAllEliminationsOpen(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	eliminations, err := c.eliminationService.GetAllOpen(ctx)
	if err != nil {
		errs.HttpError(w, err)
		return
	}

	util.WriteJSON(w, http.StatusOK, eliminations)
}

func (c controller) handleGetAllEliminations(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	eliminations, err := c.eliminationService.GetAll(ctx)
	if err != nil {
		errs.HttpError(w, err)
		return
	}

	util.WriteJSON(w, http.StatusOK, eliminations)
}
