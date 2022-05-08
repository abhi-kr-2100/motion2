package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"
	"testing"
	"time"

	"github.com/abhi-kr-2100/motion2/database"
	"github.com/abhi-kr-2100/motion2/database/models"
	"github.com/abhi-kr-2100/motion2/database/models/forms"
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

func TestCreateTodo(t *testing.T) {
	insertQuery := regexp.QuoteMeta(tests.Query_CreateTodo)
	ownerSelectQuery := regexp.QuoteMeta(tests.Query_GetUserByID)

	r := tests.EngineMock()
	r.POST("/todos", CreateTodo)

	t.Run("with a valid request", func(t *testing.T) {
		gormDB, db, mock := tests.DBMocks()
		defer db.Close()

		database.SetCustomDB(gormDB)

		mockOwnerID := uuid.New()
		mockOwnerUsername := "mock-owner-username"
		mockOwnerPassword := "mock-owner-password"
		mockOwner := models.NewUser(mockOwnerUsername, mockOwnerPassword)
		mockOwner.ID = mockOwnerID

		ownerRow := mock.NewRows([]string{"id", "username", "password_hash"}).
			AddRow(mockOwnerID, mockOwnerUsername, mockOwner.PasswordHash)

		mockTodoTitle := "mock-todo-title"
		mockTodoForm := forms.Todo{
			Title:   mockTodoTitle,
			OwnerID: mockOwnerID,
		}

		mockTodoFormJSON, err := json.Marshal(mockTodoForm)
		if err != nil {
			t.Fatalf("tests: failed to marshal mock todo form: %v", err)
		}

		mock.ExpectQuery(ownerSelectQuery).WithArgs(mockOwnerID).WillReturnRows(ownerRow)

		mock.ExpectBegin()
		mock.ExpectQuery(insertQuery).
			WithArgs(tests.AnyTime{}, tests.AnyTime{}, nil, mockTodoTitle, mockTodoForm.IsCompleted, mockOwnerID).
			WillReturnRows(mock.NewRows(nil))
		mock.ExpectCommit()

		tests.PerformRequest(r, "POST", "/todos", bytes.NewBuffer(mockTodoFormJSON))

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("unfulfilled expectations: %v", err)
		}
	})

	t.Run("with non-existent owner ID", func(t *testing.T) {
		gormDB, db, mock := tests.DBMocks()
		defer db.Close()

		database.SetCustomDB(gormDB)

		mockOwnerID := uuid.New()
		mockTodoTitle := "mock-todo-title"
		mockTodoForm := forms.Todo{
			Title:   mockTodoTitle,
			OwnerID: mockOwnerID,
		}

		mockTodoFormJSON, err := json.Marshal(mockTodoForm)
		if err != nil {
			t.Fatalf("tests: failed to marshal mock todo form: %v", err)
		}

		mock.ExpectQuery(ownerSelectQuery).WithArgs(mockOwnerID).WillReturnError(gorm.ErrRecordNotFound)
		w := tests.PerformRequest(r, "POST", "/todos", bytes.NewBuffer(mockTodoFormJSON))

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("unfulfilled expectations: %v", err)
		}

		if w.Code != http.StatusNotFound {
			t.Errorf("tests: expected status code %d, got %d", http.StatusNotFound, w.Code)
		}
	})

	t.Run("with invalid form", func(t *testing.T) {
		gormDB, db, _ := tests.DBMocks()
		defer db.Close()

		database.SetCustomDB(gormDB)

		mockTodoName := "mock-todo-name"
		mockTodoForm := struct{ Name string }{Name: mockTodoName}
		mockTodoFormJSON, err := json.Marshal(mockTodoForm)
		if err != nil {
			t.Fatalf("tests: failed to marshal mock todo form: %v", err)
		}

		w := tests.PerformRequest(r, "POST", "/todos", bytes.NewBuffer(mockTodoFormJSON))

		if w.Code != http.StatusBadRequest {
			t.Errorf("tests: expected status code %d, got %d", http.StatusBadRequest, w.Code)
		}
	})
}

func TestDeleteTodoByID(t *testing.T) {
	query := regexp.QuoteMeta(tests.Query_DeleteTodo)

	r := tests.EngineMock()
	r.DELETE("/todos/:id", DeleteTodoByID)

	t.Run("with existing todo", func(t *testing.T) {
		gormDB, db, mock := tests.DBMocks()
		defer db.Close()

		database.SetCustomDB(gormDB)

		mockTodoID := uuid.New()
		mock.NewRows([]string{"id", "deleted_at"}).AddRow(mockTodoID, nil)

		mock.ExpectBegin()
		mock.ExpectExec(query).WithArgs(tests.AnyTime{}, mockTodoID).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectCommit()

		w := tests.PerformRequest(r, "DELETE", fmt.Sprintf("/todos/%s", mockTodoID), nil)

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("unfulfilled expectations: %v", err)
		}

		if w.Code != http.StatusOK {
			t.Errorf("tests: expected status code %d, got %d", http.StatusOK, w.Code)
		}
	})

	t.Run("with non-existent todo", func(t *testing.T) {
		gormDB, db, mock := tests.DBMocks()
		defer db.Close()

		database.SetCustomDB(gormDB)

		mockTodoID := uuid.New()

		mock.ExpectBegin()
		mock.ExpectExec(query).WithArgs(tests.AnyTime{}, mockTodoID).
			WillReturnError(gorm.ErrRecordNotFound)
		mock.ExpectRollback()

		w := tests.PerformRequest(r, "DELETE", fmt.Sprintf("/todos/%s", mockTodoID), nil)

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("unfulfilled expectations: %v", err)
		}

		if w.Code != http.StatusNotFound {
			t.Errorf("tests: expected status code %d, got %d", http.StatusNotFound, w.Code)
		}
	})

	t.Run("with invalid todo ID", func(t *testing.T) {
		gormDB, db, _ := tests.DBMocks()
		defer db.Close()

		database.SetCustomDB(gormDB)

		mockTodoID := "mock-todo-id"
		w := tests.PerformRequest(r, "DELETE", fmt.Sprintf("/todos/%s", mockTodoID), nil)

		if w.Code != http.StatusBadRequest {
			t.Errorf("tests: expected status code %d, got %d", http.StatusBadRequest, w.Code)
		}
	})
}

func TestUpdateTodoByID(t *testing.T) {
	selectQuery := regexp.QuoteMeta(tests.Query_GetTodoByID)
	updateQuery := regexp.QuoteMeta(tests.Query_UpdateTodo)

	r := tests.EngineMock()
	r.PUT("/todos/:id", UpdateTodoByID)

	t.Run("with existing todo", func(t *testing.T) {
		gormDB, db, mock := tests.DBMocks()
		defer db.Close()

		database.SetCustomDB(gormDB)

		mockTodo := models.Todo{
			Model: models.Model{
				ID:        uuid.New(),
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
				DeletedAt: gorm.DeletedAt{},
			},

			Title:       "mock-todo-title",
			IsCompleted: false,
			OwnerID:     uuid.New(),
		}

		row := mock.NewRows([]string{
			"id", "created_at", "updated_at", "deleted_at",
			"title", "is_completed", "owner_id",
		}).
			AddRow(
				mockTodo.ID, mockTodo.CreatedAt, mockTodo.UpdatedAt, mockTodo.DeletedAt,
				mockTodo.Title, mockTodo.IsCompleted, mockTodo.OwnerID,
			)

		mockForm := forms.Todo{
			Title:       mockTodo.Title,
			IsCompleted: !mockTodo.IsCompleted,
			OwnerID:     mockTodo.OwnerID,
		}

		mockFormJSON, err := json.Marshal(mockForm)
		if err != nil {
			t.Fatalf("tests: failed to marshal mock todo form: %v", err)
		}

		mock.ExpectQuery(selectQuery).WithArgs(mockTodo.ID).WillReturnRows(row)
		mock.ExpectBegin()
		mock.ExpectExec(updateQuery).
			WithArgs(
				tests.AnyTime{}, tests.AnyTime{}, nil,
				mockForm.Title, mockForm.IsCompleted, mockForm.OwnerID, mockTodo.ID,
			).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectCommit()

		w := tests.PerformRequest(
			r, "PUT", fmt.Sprintf("/todos/%s", mockTodo.ID),
			bytes.NewBuffer(mockFormJSON),
		)

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("unfulfilled expectations: %v", err)
		}

		if w.Code != http.StatusOK {
			t.Errorf("tests: expected status code %d, got %d", http.StatusOK, w.Code)
		}

		var todo models.Todo
		if err := json.Unmarshal(w.Body.Bytes(), &todo); err != nil {
			t.Fatalf("tests: failed to unmarshal response body: %v", err)
		}

		if todo.ID != mockTodo.ID {
			t.Errorf("tests: expected todo ID %s, got %s", mockTodo.ID, todo.ID)
		}
		if todo.Title != mockForm.Title {
			t.Errorf("tests: expected todo title %s, got %s", mockForm.Title, todo.Title)
		}
		if todo.IsCompleted != mockForm.IsCompleted {
			t.Errorf("tests: expected todo is completed %t, got %t", mockForm.IsCompleted, todo.IsCompleted)
		}
		if todo.OwnerID != mockForm.OwnerID {
			t.Errorf("tests: expected todo owner ID %s, got %s", mockForm.OwnerID, todo.OwnerID)
		}
	})

	t.Run("with non-existent todo", func(t *testing.T) {
		gormDB, db, mock := tests.DBMocks()
		defer db.Close()

		database.SetCustomDB(gormDB)

		mockTodoID := uuid.New()
		mockTodoForm := forms.Todo{
			Title: "mock-todo-title",
		}

		mockTodoFormJSON, err := json.Marshal(mockTodoForm)
		if err != nil {
			t.Fatalf("tests: failed to marshal mock todo form: %v", err)
		}

		mock.ExpectQuery(selectQuery).WithArgs(mockTodoID).WillReturnError(gorm.ErrRecordNotFound)
		w := tests.PerformRequest(
			r, "PUT", fmt.Sprintf("/todos/%s", mockTodoID),
			bytes.NewBuffer(mockTodoFormJSON),
		)

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("unfulfilled expectations: %v", err)
		}

		if w.Code != http.StatusNotFound {
			t.Errorf("tests: expected status code %d, got %d", http.StatusNotFound, w.Code)
		}
	})

	t.Run("with invalid todo ID", func(t *testing.T) {
		gormDB, db, _ := tests.DBMocks()
		defer db.Close()

		database.SetCustomDB(gormDB)

		mockTodoID := "mock-todo-id"

		w := tests.PerformRequest(r, "PUT", fmt.Sprintf("/todos/%s", mockTodoID), nil)

		if w.Code != http.StatusBadRequest {
			t.Errorf("tests: expected status code %d, got %d", http.StatusBadRequest, w.Code)
		}
	})

	t.Run("with ownership mismatch", func(t *testing.T) {
		gormDB, db, mock := tests.DBMocks()
		defer db.Close()

		database.SetCustomDB(gormDB)

		mockTodo := models.Todo{
			Model: models.Model{
				ID:        uuid.New(),
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
				DeletedAt: gorm.DeletedAt{},
			},

			Title:       "mock-todo-title",
			IsCompleted: false,
			OwnerID:     uuid.New(),
		}

		row := mock.NewRows([]string{
			"id", "created_at", "updated_at", "deleted_at",
			"title", "is_completed", "owner_id",
		}).
			AddRow(
				mockTodo.ID, mockTodo.CreatedAt, mockTodo.UpdatedAt, mockTodo.DeletedAt,
				mockTodo.Title, mockTodo.IsCompleted, mockTodo.OwnerID,
			)

		mockForm := forms.Todo{
			Title:       mockTodo.Title,
			IsCompleted: !mockTodo.IsCompleted,
			OwnerID:     uuid.New(),
		}

		mockFormJSON, err := json.Marshal(mockForm)
		if err != nil {
			t.Fatalf("tests: failed to marshal mock todo form: %v", err)
		}

		mock.ExpectQuery(selectQuery).WithArgs(mockTodo.ID).WillReturnRows(row)

		w := tests.PerformRequest(
			r, "PUT", fmt.Sprintf("/todos/%s", mockTodo.ID),
			bytes.NewBuffer(mockFormJSON),
		)

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("unfulfilled expectations: %v", err)
		}

		if w.Code != http.StatusForbidden {
			t.Errorf("tests: expected status code %d, got %d", http.StatusForbidden, w.Code)
		}
	})
}
