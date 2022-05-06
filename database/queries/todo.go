package queries

import (
	"github.com/abhi-kr-2100/motion2/database/models"

	"github.com/google/uuid"
)

func GetTodoByID(id uuid.UUID) (*models.Todo, error) {
	panic("queries: not implemented")
}

func GetTodosByOwnerID(ownerID uuid.UUID) ([]*models.Todo, error) {
	panic("queries: not implemented")
}
