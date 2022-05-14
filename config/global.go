package config

import (
	"fmt"
	"os"
	"sync"

	"github.com/joho/godotenv"
)

var cfg *config
var once sync.Once

func Cfg() *config {
	once.Do(func() {
		if cfg == nil {
			cfg = loadConfig()
		}
	})

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

	allowedOrigin, ok := os.LookupEnv(AllowedOriginEnvVar)
	if !ok {
		panic(fmt.Sprintf("config: %s env variable not set", AllowedOriginEnvVar))
	}

	return &config{
		DBConnURL:     dbConnURL,
		HostURL:       hostURL,
		AllowedOrigin: allowedOrigin,
	}
}

const (
	DBConnURLEnvVar     = "DATABASE_URL"
	HostURLEnvVar       = "HOST_URL"
	AllowedOriginEnvVar = "ALLOWED_ORIGIN"
)

type config struct {
	DBConnURL     string
	HostURL       string
	AllowedOrigin string
}
