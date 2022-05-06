package tests

import (
	"database/sql"
	"net/http/httptest"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/gin-gonic/gin"
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

func HTTPMocks() (*httptest.ResponseRecorder, *gin.Context) {
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	return w, c
}
