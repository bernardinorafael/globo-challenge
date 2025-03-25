package config

import (
	"github.com/spf13/viper"
)

type Env struct {
	Port        string `mapstructure:"PORT"`
	DSN         string `mapstructure:"DB_POSTGRES_DSN"`
	SecretKey   string `mapstructure:"ACCESS_TOKEN_SECRET"`
	RabbitMQURI string `mapstructure:"RABBITMQ_URI"`
}

func NewEnv() (*Env, error) {
	var env Env

	viper.SetConfigName(".env")
	viper.SetConfigType("env")
	viper.AddConfigPath(".")
	viper.AutomaticEnv()

	err := viper.ReadInConfig()
	if err != nil {
		return nil, err
	}

	err = viper.Unmarshal(&env)
	if err != nil {
		return nil, err
	}

	return &env, nil
}
