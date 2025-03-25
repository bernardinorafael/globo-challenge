package participant

import (
	"net/http"
	"sync"

	"github.com/bernardinorafael/globo-challenge/internal/infra/http/middleware"
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
	participantService Service
	secretKey          string
}

func NewController(participantService Service, secretKey string) *controller {
	Once.Do(func() {
		instance = &controller{
			participantService: participantService,
			secretKey:          secretKey,
		}
	})
	return instance
}

func (c controller) RegisterRoutes(r *chi.Mux) {
	m := middleware.NewWithAuth(c.secretKey)

	r.Route("/api/v1/participants", func(r chi.Router) {
		r.Use(m.WithAuth)

		r.Post("/", c.handleCreateParticipant)
		r.Get("/", c.handleGetAllParticipants)
		r.Delete("/{participantId}", c.handleDeleteParticipant)
	})
}

func (c controller) handleGetAllParticipants(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	participants, err := c.participantService.GetAllParticipants(ctx)
	if err != nil {
		errs.HttpError(w, err)
		return
	}

	util.WriteJSON(w, http.StatusOK, participants)
}

func (c controller) handleCreateParticipant(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var body dto.CreateParticipant
	if err := util.ReadRequestBody(w, r, &body); err != nil {
		errs.HttpError(w, err)
		return
	}

	err := c.participantService.CreateParticipant(ctx, body.Name)
	if err != nil {
		errs.HttpError(w, err)
		return
	}

	util.WriteSuccess(w, http.StatusCreated)
}

func (c controller) handleDeleteParticipant(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	participantId := chi.URLParam(r, "participantId")

	err := c.participantService.DeleteParticipant(ctx, participantId)
	if err != nil {
		errs.HttpError(w, err)
		return
	}

	util.WriteSuccess(w, http.StatusOK)
}
