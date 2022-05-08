package views

import (
	"github.com/abhi-kr-2100/motion2/database/models"
	"github.com/google/uuid"
)

type Todo struct {
	ID uuid.UUID

	Title       string
	IsCompleted bool

	OwnerID uuid.UUID
}

func FromTodo(todo models.Todo) Todo {
	return Todo{
		ID: todo.ID,

		Title:       todo.Title,
		IsCompleted: todo.IsCompleted,

		OwnerID: todo.OwnerID,
	}
}
