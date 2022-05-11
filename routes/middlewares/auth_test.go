package middlewares

import (
	"net/http"
	"net/http/httptest"
	"regexp"
	"testing"

	"github.com/abhi-kr-2100/motion2/database"
	"github.com/abhi-kr-2100/motion2/database/models"
	"github.com/abhi-kr-2100/motion2/tests"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func TestAuthentication(t *testing.T) {
	getUserQuery := regexp.QuoteMeta(tests.Query_GetUserByUsername)

	t.Run("should return unauthorized if username is not provided", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Request = httptest.NewRequest("GET", "/", nil)

		authentication(c)

		if w.Code != http.StatusUnauthorized {
			t.Errorf("Expected status code %v, got %v", http.StatusUnauthorized, w.Code)
		}
	})

	t.Run("should return unauthorized if user does not exist", func(t *testing.T) {
		gormDB, db, mock := tests.DBMocks()
		defer db.Close()

		database.SetCustomDB(gormDB)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Request = httptest.NewRequest("GET", "/", nil)

		mockUsername := "mockUsername"
		c.Request.Header.Set("Username", mockUsername)

		mock.ExpectQuery(getUserQuery).WillReturnRows(mock.NewRows(nil))

		authentication(c)

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("Expectations were not met: %v", err)
		}

		if w.Code != http.StatusUnauthorized {
			t.Errorf("Expected status code %v, got %v", http.StatusUnauthorized, w.Code)
		}
	})

	t.Run("should return unauthorized if password is invalid", func(t *testing.T) {
		gormDB, db, mock := tests.DBMocks()
		defer db.Close()

		database.SetCustomDB(gormDB)

		mockUserID := uuid.New()
		mockUsername := "test"
		mockPassword := "test"
		mockUser := models.NewUser(mockUsername, mockPassword)
		mockUser.ID = mockUserID

		row := mock.NewRows([]string{"id", "username", "password_hash"}).
			AddRow(mockUserID, mockUsername, mockUser.PasswordHash)

		mock.ExpectQuery(getUserQuery).WillReturnRows(row)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Request = httptest.NewRequest("GET", "/", nil)

		c.Request.Header.Set("Username", mockUsername)
		c.Request.Header.Set("Password", "invalidPassword")

		authentication(c)

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("there were unfulfilled expectations: %s", err)
		}

		if w.Code != http.StatusUnauthorized {
			t.Errorf("Expected status code %v, got %v", http.StatusUnauthorized, w.Code)
		}
	})

	t.Run("should set user ID to context with valid credentials", func(t *testing.T) {
		gormDB, db, mock := tests.DBMocks()
		defer db.Close()

		database.SetCustomDB(gormDB)

		mockUserID := uuid.New()
		mockUsername := "test"
		mockPassword := "test"
		mockUser := models.NewUser(mockUsername, mockPassword)
		mockUser.ID = mockUserID

		row := mock.NewRows([]string{"id", "username", "password_hash"}).
			AddRow(mockUserID, mockUsername, mockUser.PasswordHash)

		mock.ExpectQuery(getUserQuery).WillReturnRows(row)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Request = httptest.NewRequest("GET", "/", nil)

		c.Request.Header.Set("Username", mockUsername)
		c.Request.Header.Set("Password", mockPassword)

		authentication(c)

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("there were unfulfilled expectations: %s", err)
		}

		if w.Code != http.StatusOK {
			t.Errorf("Expected status code %v, got %v", http.StatusOK, w.Code)
		}

		id, ok := c.Get(UserIDKey)
		if !ok {
			t.Errorf("Expected to find user ID in context")
		}

		if id.(uuid.UUID) != mockUserID {
			t.Errorf("Expected user ID to be %v, got %v", mockUserID, id)
		}
	})
}
