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

func TestGetTodoByID(t *testing.T) {
	query := regexp.QuoteMeta(tests.Query_GetTodoByID)

	r := tests.EngineMock()
	r.GET("todos/:id", GetTodoByID)

	t.Run("with an existing todo", func(t *testing.T) {
		gormDB, db, mock := tests.DBMocks()
		defer db.Close()

		database.SetCustomDB(gormDB)

		mockTodoID := uuid.New()
		mockTodoTitle := "mock-todo-title"

		row := mock.NewRows([]string{"id", "title"}).
			AddRow(mockTodoID, mockTodoTitle)
		mock.ExpectQuery(query).WithArgs(mockTodoID).WillReturnRows(row)

		w := tests.PerformRequest(r, "GET", fmt.Sprintf("/todos/%s", mockTodoID), nil)

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("tests: failed to expect database expectations: %v", err)
		}

		if w.Code != http.StatusOK {
			t.Errorf("tests: expected status code %d, got %d", http.StatusOK, w.Code)
		}

		var todo models.Todo
		if err := json.Unmarshal(w.Body.Bytes(), &todo); err != nil {
			t.Errorf("tests: failed to unmarshal response body: %v", err)
		}

		if todo.ID != mockTodoID {
			t.Errorf("tests: expected todo ID %s, got %s", mockTodoID, todo.ID)
		}
		if todo.Title != mockTodoTitle {
			t.Errorf("tests: expected todo title %s, got %s", mockTodoTitle, todo.Title)
		}
	})

	t.Run("with a non-existing todo", func(t *testing.T) {
		gormDB, db, mock := tests.DBMocks()
		defer db.Close()

		database.SetCustomDB(gormDB)

		mockTodoID := uuid.New()
		mock.ExpectQuery(query).WithArgs(mockTodoID).WillReturnError(gorm.ErrRecordNotFound)

		w := tests.PerformRequest(r, "GET", fmt.Sprintf("/todos/%s", mockTodoID), nil)

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("tests: failed to expect database expectations: %v", err)
		}

		if w.Code != http.StatusNotFound {
			t.Errorf("tests: expected status code %d, got %d", http.StatusNotFound, w.Code)
		}
	})

	t.Run("with an invalid todo ID", func(t *testing.T) {
		w := tests.PerformRequest(r, "GET", "/todos/invalid-id", nil)

		if w.Code != http.StatusBadRequest {
			t.Errorf("tests: expected status code %d, got %d", http.StatusBadRequest, w.Code)
		}
	})
}

func TestGetTodosByOwnerID(t *testing.T) {
	t.Run("with an existing owner", func(t *testing.T) {
		panic("tests: not implemented")
	})

	t.Run("with a non-existing owner", func(t *testing.T) {
		panic("tests: not implemented")
	})

	t.Run("with an invalid owner ID", func(t *testing.T) {
		panic("tests: not implemented")
	})

	t.Run("with no todos", func(t *testing.T) {
		panic("tests: not implemented")
	})

	t.Run("with no owned todos", func(t *testing.T) {
		panic("tests: not implemented")
	})
}
