package tests

import (
	"database/sql"
	"fmt"
	"io"
	"net/http"
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

func HTTPMocks() (*httptest.ResponseRecorder, *gin.Context, *gin.Engine) {
	w := httptest.NewRecorder()
	c, r := gin.CreateTestContext(w)

	return w, c, r
}

func EngineMock() *gin.Engine {
	r := gin.New()
	return r
}

func PerformRequest(r http.Handler, method, path string, body io.Reader) *httptest.ResponseRecorder {
	req, err := http.NewRequest(method, path, body)
	if err != nil {
		panic(fmt.Sprintf("tests: failed to create request: %v", err))
	}

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}
