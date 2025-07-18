package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type AppConfig struct {
	DBUser     string
	DBPass     string
	DBHost     string
	DBPort     string
	DBName     string
	Port       string
}

var App AppConfig

func LoadConfig() {
	err := godotenv.Load()
	if err != nil {
		log.Println(".env not found, using system env vars")
	}

	App = AppConfig{
		DBUser:     os.Getenv("DB_USER"),
		DBPass:     os.Getenv("DB_PASS"),
		DBHost:     os.Getenv("DB_HOST"),
		DBPort:     os.Getenv("DB_PORT"),
		DBName:     os.Getenv("DB_NAME"),
		Port:       os.Getenv("PORT"),
	}	

	log.Printf("Loaded config: %+v\n", App)
}
