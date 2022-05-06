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

	return &config{
		DBConnURL: dbConnURL,
	}
}

const DBConnURLEnvVar = "DATABASE_URL"

type config struct {
	DBConnURL string
}
