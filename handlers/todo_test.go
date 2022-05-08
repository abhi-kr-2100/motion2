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

	"github.com/DATA-DOG/go-sqlmock"
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

		var todo views.Todo
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
	query := regexp.QuoteMeta(tests.Query_GetTodosByOwnerID)

	r := tests.EngineMock()
	r.GET("users/:id/todos", GetTodosByOwnerID)

	t.Run("with an existing owner", func(t *testing.T) {
		gormDB, db, mock := tests.DBMocks()
		defer db.Close()

		database.SetCustomDB(gormDB)

		mockOwnerID := uuid.New()

		var mockTodos [3]models.Todo

		rows := mock.NewRows([]string{"id", "title", "owner_id"})
		for i := range mockTodos {
			mockTodos[i].ID = uuid.New()
			mockTodos[i].Title = fmt.Sprintf("mock-todo-title-%d", i)
			mockTodos[i].OwnerID = mockOwnerID

			rows = rows.AddRow(mockTodos[i].ID, mockTodos[i].Title, mockTodos[i].OwnerID)
		}

		mock.ExpectQuery(query).WithArgs(mockOwnerID).WillReturnRows(rows)

		w := tests.PerformRequest(r, "GET", fmt.Sprintf("/users/%s/todos", mockOwnerID), nil)

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("tests: failed to expect database expectations: %v", err)
		}

		if w.Code != http.StatusOK {
			t.Errorf("tests: expected status code %d, got %d", http.StatusOK, w.Code)
		}

		var todos []views.Todo
		if err := json.Unmarshal(w.Body.Bytes(), &todos); err != nil {
			t.Errorf("tests: failed to unmarshal response body: %v", err)
		}

		if len(todos) != 3 {
			t.Errorf("tests: expected todos length %d, got %d", 3, len(todos))
		}

		for _, mock := range mockTodos {
			var found views.Todo
			for i, todo := range todos {
				if todo.ID == mock.ID {
					found = todos[i]
					break
				}
			}

			if found.ID != mock.ID {
				t.Errorf("tests: expected todo ID %s, got %s", mock.ID, found.ID)
			}
			if found.Title != mock.Title {
				t.Errorf("tests: expected todo title %s, got %s", mock.Title, found.Title)
			}
			if found.OwnerID != mockOwnerID {
				t.Errorf("tests: expected todo owner ID %s, got %s", mockOwnerID, found.OwnerID)
			}
		}
	})

	t.Run("with a non-existing owner", func(t *testing.T) {
		gormDB, db, mock := tests.DBMocks()
		defer db.Close()

		database.SetCustomDB(gormDB)

		mockOwnerID := uuid.New()
		mock.ExpectQuery(query).WithArgs(mockOwnerID).WillReturnError(gorm.ErrRecordNotFound)

		w := tests.PerformRequest(r, "GET", fmt.Sprintf("/users/%s/todos", mockOwnerID), nil)

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("tests: failed to expect database expectations: %v", err)
		}

		if w.Code != http.StatusNotFound {
			t.Errorf("tests: expected status code %d, got %d", http.StatusNotFound, w.Code)
		}
	})

	t.Run("with an invalid owner ID", func(t *testing.T) {
		w := tests.PerformRequest(r, "GET", "/users/invalid-id/todos", nil)

		if w.Code != http.StatusBadRequest {
			t.Errorf("tests: expected status code %d, got %d", http.StatusBadRequest, w.Code)
		}
	})

	t.Run("with no todos", func(t *testing.T) {
		gormDB, db, mock := tests.DBMocks()
		defer db.Close()

		database.SetCustomDB(gormDB)

		mockOwnerID := uuid.New()
		mock.ExpectQuery(query).WithArgs(mockOwnerID).WillReturnRows(mock.NewRows(nil))

		w := tests.PerformRequest(r, "GET", fmt.Sprintf("/users/%s/todos", mockOwnerID), nil)

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("tests: failed to expect database expectations: %v", err)
		}

		if w.Code != http.StatusOK {
			t.Errorf("tests: expected status code %d, got %d", http.StatusOK, w.Code)
		}

		var todos []views.Todo
		if err := json.Unmarshal(w.Body.Bytes(), &todos); err != nil {
			t.Errorf("tests: failed to unmarshal response body: %v", err)
		}

		if len(todos) != 0 {
			t.Errorf("tests: expected todos length %d, got %d", 0, len(todos))
		}
	})

	t.Run("with no owned todos", func(t *testing.T) {
		gormDB, db, mock := tests.DBMocks()
		defer db.Close()

		database.SetCustomDB(gormDB)

		mockOwnerID := uuid.New()
		mockUserID := uuid.New()

		rows := mock.NewRows([]string{"id", "title", "owner_id"})
		for i := 0; i < 3; i++ {
			mockTodoID := uuid.New()
			mockTodoTitle := fmt.Sprintf("mock-todo-title-%d", i)
			mockTodoOwnerID := mockOwnerID

			rows = rows.AddRow(mockTodoID, mockTodoTitle, mockTodoOwnerID)
		}

		mock.ExpectQuery(query).WithArgs(mockUserID).WillReturnRows(sqlmock.NewRows(nil))

		w := tests.PerformRequest(r, "GET", fmt.Sprintf("/users/%s/todos", mockUserID), nil)

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("tests: failed to expect database expectations: %v", err)
		}

		if w.Code != http.StatusOK {
			t.Errorf("tests: expected status code %d, got %d", http.StatusOK, w.Code)
		}

		var todos []views.Todo
		if err := json.Unmarshal(w.Body.Bytes(), &todos); err != nil {
			t.Errorf("tests: failed to unmarshal response body: %v", err)
		}

		if len(todos) != 0 {
			t.Errorf("tests: expected todos length %d, got %d", 0, len(todos))
		}
	})
}
