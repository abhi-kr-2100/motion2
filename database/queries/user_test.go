package queries

import (
	"regexp"
	"testing"

	dbService "github.com/abhi-kr-2100/motion2/database"
	"github.com/abhi-kr-2100/motion2/database/models"
	"github.com/abhi-kr-2100/motion2/tests"

	"github.com/google/uuid"
)

func TestGetUserByID(t *testing.T) {
	query := regexp.QuoteMeta(tests.Query_GetUserByID)

	t.Run("with existing user", func(t *testing.T) {
		gormDB, db, mock := tests.DBMocks()
		defer db.Close()

		dbService.SetCustomDB(gormDB)

		mockUserID := uuid.New()
		mockUsername := "mock-username"
		mockPassword := "mock-password"
		mockUser := models.NewUser(mockUsername, mockPassword)
		mockUser.ID = mockUserID

		row := mock.NewRows([]string{"id", "username", "password_hash"}).
			AddRow(mockUserID, mockUsername, mockUser.PasswordHash)
		mock.ExpectQuery(query).WithArgs(mockUserID).WillReturnRows(row)

		user, err := GetUserByID(mockUserID)
		if err != nil {
			t.Errorf("unexpected error: %v", err)
		}

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("unfulfilled expectations: %v", err)
		}

		if user.ID != mockUserID {
			t.Errorf("expected user ID to be %v, got %v", mockUserID, user.ID)
		}
		if user.Username != mockUsername {
			t.Errorf("expected user username to be %v, got %v", mockUsername, user.Username)
		}
		if !user.CanLogin(mockPassword) {
			t.Errorf("expected user to be able to login with password %v", mockPassword)
		}
	})

	t.Run("with non-existent user", func(t *testing.T) {
		gormDB, db, mock := tests.DBMocks()
		defer db.Close()

		dbService.SetCustomDB(gormDB)

		mockUserID := uuid.New()
		mock.ExpectQuery(query).WithArgs(mockUserID).WillReturnError(nil)

		if _, err := GetUserByID(mockUserID); err == nil {
			t.Error("expected error, got nil")
		}

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("unfulfilled expectations: %v", err)
		}
	})
}

func TestGetUserByUsername(t *testing.T) {
	query := regexp.QuoteMeta(tests.Query_GetUserByUsername)

	t.Run("with existing user", func(t *testing.T) {
		gormDB, db, mock := tests.DBMocks()
		defer db.Close()

		dbService.SetCustomDB(gormDB)

		mockUserID := uuid.New()
		mockUsername := "mock-username"
		mockPassword := "mock-password"
		mockUser := models.NewUser(mockUsername, mockPassword)
		mockUser.ID = mockUserID

		row := mock.NewRows([]string{"id", "username", "password_hash"}).
			AddRow(mockUserID, mockUsername, mockUser.PasswordHash)

		mock.ExpectQuery(query).WithArgs(mockUsername).WillReturnRows(row)

		user, err := GetUserByUsername(mockUsername)
		if err != nil {
			t.Errorf("unexpected error: %v", err)
		}

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("unfulfilled expectations: %v", err)
		}

		if user.ID != mockUserID {
			t.Errorf("expected user ID to be %v, got %v", mockUserID, user.ID)
		}
		if user.Username != mockUsername {
			t.Errorf("expected user username to be %v, got %v", mockUsername, user.Username)
		}
		if !user.CanLogin(mockPassword) {
			t.Errorf("expected user to be able to login with password %v", mockPassword)
		}
	})

	t.Run("with non-existent user", func(t *testing.T) {
		gormDB, db, mock := tests.DBMocks()
		defer db.Close()

		dbService.SetCustomDB(gormDB)

		mockUsername := "mock-username"
		mock.ExpectQuery(query).WithArgs(mockUsername).WillReturnError(nil)

		if _, err := GetUserByUsername(mockUsername); err == nil {
			t.Error("expected error, got nil")
		}

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("unfulfilled expectations: %v", err)
		}
	})
}
