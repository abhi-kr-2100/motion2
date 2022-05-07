package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"
	"testing"

	"github.com/abhi-kr-2100/motion2/database"
	"github.com/abhi-kr-2100/motion2/database/models"
	"github.com/abhi-kr-2100/motion2/tests"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func TestGetUserByID(t *testing.T) {
	query := regexp.QuoteMeta(tests.Query_GetUserByID)

	r := tests.EngineMock()
	r.GET("users/:id", GetUserByID)

	t.Run("with an existing user", func(t *testing.T) {
		gormDB, db, mock := tests.DBMocks()
		defer db.Close()

		database.SetCustomDB(gormDB)

		mockUserID := uuid.New()
		mockUsername := "mock-username"
		mockPassword := "mock-password"
		mockUser := models.NewUser(mockUsername, mockPassword)
		mockUser.ID = mockUserID

		row := mock.NewRows([]string{"id", "username", "password_hash"}).
			AddRow(mockUserID, mockUsername, mockUser.PasswordHash)

		mock.ExpectQuery(query).WithArgs(mockUserID).WillReturnRows(row)
		w := tests.PerformRequest(r, "GET", fmt.Sprintf("/users/%s", mockUserID), nil)

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("tests: failed to expect database expectations: %v", err)
		}

		if w.Code != http.StatusOK {
			t.Errorf("tests: expected status code %d, got %d", http.StatusOK, w.Code)
		}

		var user models.User
		if err := json.Unmarshal(w.Body.Bytes(), &user); err != nil {
			t.Errorf("tests: failed to unmarshal response: %v", err)
		}

		if user.ID != mockUserID {
			t.Errorf("tests: expected user ID %s, got %s", mockUserID, user.ID)
		}
		if user.Username != mockUsername {
			t.Errorf("tests: expected user username %s, got %s", mockUsername, user.Username)
		}
		if !user.CanLogin(mockPassword) {
			t.Errorf("tests: expected user to be able to login with password %s", mockPassword)
		}
	})

	t.Run("with a non-existing user", func(t *testing.T) {
		gormDB, db, mock := tests.DBMocks()
		defer db.Close()

		database.SetCustomDB(gormDB)

		mockUserID := uuid.New()
		mock.ExpectQuery(query).WithArgs(mockUserID).WillReturnError(gorm.ErrRecordNotFound)

		w := tests.PerformRequest(r, "GET", fmt.Sprintf("/users/%s", mockUserID), nil)

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("tests: failed to expect database expectations: %v", err)
		}

		if w.Code != http.StatusNotFound {
			t.Errorf("tests: expected status code %d, got %d", http.StatusNotFound, w.Code)
		}
	})

	t.Run("with an invalid user ID", func(t *testing.T) {
		w := tests.PerformRequest(r, "GET", "/users/invalid", nil)
		if w.Code != http.StatusBadRequest {
			t.Errorf("tests: expected status code %d, got %d", http.StatusBadRequest, w.Code)
		}
	})
}

func TestGetUserByUsername(t *testing.T) {
	t.Run("with an existing user", func(t *testing.T) {
		panic("tests: not implemented")
	})

	t.Run("with a non-existing user", func(t *testing.T) {
		panic("tests: not implemented")
	})

	t.Run("with no query parameters", func(t *testing.T) {
		panic("tests: not implemented")
	})
}
