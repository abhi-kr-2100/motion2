package queries

import (
	"fmt"
	"regexp"
	"testing"

	"github.com/abhi-kr-2100/motion2/database"
	"github.com/abhi-kr-2100/motion2/database/models"
	"github.com/abhi-kr-2100/motion2/tests"
	"github.com/google/uuid"
)

func TestGetTodoByID(t *testing.T) {
	query := regexp.QuoteMeta(tests.Query_GetTodoByID)

	t.Run("with existing todo", func(t *testing.T) {
		gormDB, db, mock := tests.DBMocks()
		defer db.Close()

		database.SetCustomDB(gormDB)

		mockTodoID := uuid.New()
		mockTodoTitle := "mock-todo-title"

		row := mock.NewRows([]string{"id", "title"}).AddRow(mockTodoID, mockTodoTitle)
		mock.ExpectQuery(query).WithArgs(mockTodoID).WillReturnRows(row)

		todo, err := GetTodoByID(mockTodoID)
		if err != nil {
			t.Errorf("unexpected error: %v", err)
		}

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("unfulfilled expectations: %v", err)
		}

		if todo.ID != mockTodoID {
			t.Errorf("expected todo ID to be %v, got %v", mockTodoID, todo.ID)
		}
		if todo.Title != mockTodoTitle {
			t.Errorf("expected todo title to be %v, got %v", mockTodoTitle, todo.Title)
		}
	})

	t.Run("with non-existing todo", func(t *testing.T) {
		gormDB, db, mock := tests.DBMocks()
		defer db.Close()

		database.SetCustomDB(gormDB)

		mockTodoID := uuid.New()
		mock.ExpectQuery(query).WithArgs(mockTodoID).WillReturnError(nil)

		if _, err := GetTodoByID(mockTodoID); err == nil {
			t.Errorf("expected to get error, got nil")
		}

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("unfulfilled expectations: %v", err)
		}
	})
}

func TestGetTodosByOwnerID(t *testing.T) {
	query := regexp.QuoteMeta(tests.Query_GetTodosByOwnerID)

	t.Run("with no todos", func(t *testing.T) {
		gormDB, db, mock := tests.DBMocks()
		defer db.Close()

		database.SetCustomDB(gormDB)

		mockOwnerID := uuid.New()
		mock.ExpectQuery(query).WithArgs(mockOwnerID).WillReturnRows(mock.NewRows(nil))

		todos, err := GetTodosByOwnerID(mockOwnerID)
		if err != nil {
			t.Errorf("unexpected error: %v", err)
		}

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("unfulfilled expectations: %v", err)
		}

		if len(todos) != 0 {
			t.Errorf("expected to get 0 todos, got %v", len(todos))
		}
	})

	t.Run("with non-owned todos", func(t *testing.T) {
		gormDB, db, mock := tests.DBMocks()
		defer db.Close()

		database.SetCustomDB(gormDB)

		mockOwnerID := uuid.New()
		var mockTodos []models.Todo
		for i := 0; i < 3; i++ {
			mockTodos = append(mockTodos, models.Todo{
				Model:   models.Model{ID: uuid.New()},
				Title:   "mock-todo-title",
				OwnerID: uuid.New(),
			})
		}

		rows := mock.NewRows([]string{"id", "title", "owner_id"})
		for _, todo := range mockTodos {
			rows.AddRow(todo.ID, todo.Title, todo.OwnerID)
		}

		mock.ExpectQuery(query).WithArgs(mockOwnerID).WillReturnRows(mock.NewRows(nil))

		todos, err := GetTodosByOwnerID(mockOwnerID)
		if err != nil {
			t.Errorf("unexpected error: %v", err)
		}

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("unfulfilled expectations: %v", err)
		}

		if len(todos) != 0 {
			t.Errorf("expected to get 0 todos, got %v", len(todos))
		}
	})

	t.Run("with owned todos", func(t *testing.T) {
		gormDB, db, mock := tests.DBMocks()
		defer db.Close()

		database.SetCustomDB(gormDB)

		mockOwnerID := uuid.New()
		var mockTodos []models.Todo
		for i := 0; i < 3; i++ {
			mockTodos = append(mockTodos, models.Todo{
				Model:   models.Model{ID: uuid.New()},
				Title:   fmt.Sprintf("mock-todo-title-%d", i),
				OwnerID: mockOwnerID,
			})
		}

		rows := mock.NewRows([]string{"id", "title", "owner_id"})
		for _, todo := range mockTodos {
			rows = rows.AddRow(todo.ID, todo.Title, todo.OwnerID)
		}

		mock.ExpectQuery(query).WithArgs(mockOwnerID).WillReturnRows(rows)

		todos, err := GetTodosByOwnerID(mockOwnerID)
		if err != nil {
			t.Errorf("unexpected error: %v", err)
		}

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("unfulfilled expectations: %v", err)
		}

		if len(todos) != len(mockTodos) {
			t.Errorf("expected to get %v todos, got %v", len(mockTodos), len(todos))
		}

		for _, mockTodo := range mockTodos {
			var foundTodo *models.Todo
			for _, respTodo := range todos {
				if mockTodo.ID != respTodo.ID {
					continue
				}

				foundTodo = respTodo
			}

			if foundTodo == nil {
				t.Errorf("expected to find todo with id %v", mockTodo.ID)
			}

			if mockTodo.Title != foundTodo.Title {
				t.Errorf("expected to get todo with title %v, got %v", mockTodo.Title, foundTodo.Title)
			}

			if mockOwnerID != foundTodo.OwnerID {
				t.Errorf("expected to get todo with owner id %v, got %v", mockTodo.OwnerID, foundTodo.OwnerID)
			}
		}
	})
}
