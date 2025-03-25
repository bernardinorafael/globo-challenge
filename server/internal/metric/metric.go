package metric

import (
	"github.com/prometheus/client_golang/prometheus"
)

type Metric struct {
	registry         *prometheus.Registry
	votesCounter     *prometheus.CounterVec
	votingLatency    *prometheus.HistogramVec
	participantVotes *prometheus.CounterVec
	votingErrors     *prometheus.CounterVec
}

func NewMetric() *Metric {
	registry := prometheus.NewRegistry()

	m := &Metric{
		registry: registry,

		// Total votes counter
		votesCounter: prometheus.NewCounterVec(
			prometheus.CounterOpts{
				Name: "bbb_votes_total",
				Help: "Total number of votes computed",
			},
			[]string{"participant"},
		),

		// Voting processing latency
		votingLatency: prometheus.NewHistogramVec(
			prometheus.HistogramOpts{
				Name:    "bbb_voting_duration_seconds",
				Help:    "Voting processing time in seconds",
				Buckets: []float64{0.1, 0.25, 0.5, 1, 2.5, 5},
			},
			[]string{"status"},
		),

		// Participant votes counter
		participantVotes: prometheus.NewCounterVec(
			prometheus.CounterOpts{
				Name: "bbb_participant_votes_total",
				Help: "Total votes per participant",
			},
			[]string{"participant", "origin"},
		),

		// Errors counter
		votingErrors: prometheus.NewCounterVec(
			prometheus.CounterOpts{
				Name: "bbb_voting_errors_total",
				Help: "Total errors during voting",
			},
			[]string{"error_type"},
		),
	}

	registry.MustRegister(
		m.votesCounter,
		m.votingLatency,
		m.participantVotes,
		m.votingErrors,
	)

	return m
}

func (m *Metric) RecordVote(participante, origem string) {
	m.votesCounter.WithLabelValues(participante).Inc()
	m.participantVotes.WithLabelValues(participante, origem).Inc()
}

func (m *Metric) RecordError(tipoErro string) {
	m.votingErrors.WithLabelValues(tipoErro).Inc()
}

func (m *Metric) ObserveVotingLatency(status string) *prometheus.Timer {
	return prometheus.NewTimer(m.votingLatency.WithLabelValues(status))
}

func (m *Metric) GetRegistry() *prometheus.Registry { return m.registry }
