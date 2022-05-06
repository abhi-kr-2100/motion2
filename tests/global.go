package tests

import (
	"database/sql"

	"github.com/DATA-DOG/go-sqlmock"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func DBMocks() (*gorm.DB, *sql.DB, sqlmock.Sqlmock) {
	db, mock, err := sqlmock.New()
	if err != nil {
		panic("tests: failed to create sqlmock: " + err.Error())
	}

	postgresDB := postgres.New(postgres.Config{Conn: db})
	gormDB, err := gorm.Open(postgresDB, &gorm.Config{})
	if err != nil {
		panic("tests: failed to create gorm.DB: " + err.Error())
	}

	return gormDB, db, mock
}
