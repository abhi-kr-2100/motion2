package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

var cfg *config

func Cfg() *config {
	if cfg == nil {
		cfg = loadConfig()
	}

	return cfg
}

func loadConfig() *config {
	err := godotenv.Load()
	if err != nil {
		panic(fmt.Sprintf("config: failed to load env variables: %s", err))
	}

	dbConnURL, ok := os.LookupEnv(DBConnURLEnvVar)
	if !ok {
		panic(fmt.Sprintf("config: %s env variable not set", DBConnURLEnvVar))
	}

	hostURL, ok := os.LookupEnv(HostURLEnvVar)
	if !ok {
		panic(fmt.Sprintf("config: %s env variable not set", HostURLEnvVar))
	}

	return &config{
		DBConnURL: dbConnURL,
		HostURL:   hostURL,
	}
}

const (
	DBConnURLEnvVar = "DATABASE_URL"
	HostURLEnvVar   = "HOST_URL"
)

type config struct {
	DBConnURL string
	HostURL   string
}
