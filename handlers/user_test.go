package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"
	"testing"

	"github.com/abhi-kr-2100/motion2/database"
	"github.com/abhi-kr-2100/motion2/database/models"
	"github.com/abhi-kr-2100/motion2/database/models/views"
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

		var user views.User
		if err := json.Unmarshal(w.Body.Bytes(), &user); err != nil {
			t.Errorf("tests: failed to unmarshal response: %v", err)
		}

		if user.ID != mockUserID {
			t.Errorf("tests: expected user ID %s, got %s", mockUserID, user.ID)
		}
		if user.Username != mockUsername {
			t.Errorf("tests: expected user username %s, got %s", mockUsername, user.Username)
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
	query := regexp.QuoteMeta(tests.Query_GetUserByUsername)

	r := tests.EngineMock()
	r.GET("users", GetUserByUsername)

	t.Run("with an existing user", func(t *testing.T) {
		gormDB, db, mock := tests.DBMocks()
		defer db.Close()

		database.SetCustomDB(gormDB)

		mockUsername := "mock-username"
		mockPassword := "mock-password"
		mockUser := models.NewUser(mockUsername, mockPassword)
		mockUser.ID = uuid.New()

		row := mock.NewRows([]string{"id", "username", "password_hash"}).
			AddRow(mockUser.ID, mockUsername, mockUser.PasswordHash)
		mock.ExpectQuery(query).WithArgs(mockUsername).WillReturnRows(row)

		w := tests.PerformRequest(r, "GET", fmt.Sprintf("/users?username=%s", mockUsername), nil)

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("tests: failed to expect database expectations: %v", err)
		}

		if w.Code != http.StatusOK {
			t.Errorf("tests: expected status code %d, got %d", http.StatusOK, w.Code)
		}

		var user views.User
		if err := json.Unmarshal(w.Body.Bytes(), &user); err != nil {
			t.Errorf("tests: failed to unmarshal response: %v", err)
		}

		if user.ID != mockUser.ID {
			t.Errorf("tests: expected user ID %s, got %s", mockUser.ID, user.ID)
		}
		if user.Username != mockUsername {
			t.Errorf("tests: expected user username %s, got %s", mockUsername, user.Username)
		}
	})

	t.Run("with a non-existing user", func(t *testing.T) {
		gormDB, db, mock := tests.DBMocks()
		defer db.Close()

		database.SetCustomDB(gormDB)

		mockUsername := "mock-username"
		mock.ExpectQuery(query).WithArgs(mockUsername).WillReturnError(gorm.ErrRecordNotFound)

		w := tests.PerformRequest(r, "GET", fmt.Sprintf("/users?username=%s", mockUsername), nil)

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("tests: failed to expect database expectations: %v", err)
		}

		if w.Code != http.StatusNotFound {
			t.Errorf("tests: expected status code %d, got %d", http.StatusNotFound, w.Code)
		}
	})

	t.Run("with no query parameters", func(t *testing.T) {
		w := tests.PerformRequest(r, "GET", "/users", nil)
		if w.Code != http.StatusForbidden {
			t.Errorf("tests: expected status code %d, got %d", http.StatusForbidden, w.Code)
		}
	})
}
