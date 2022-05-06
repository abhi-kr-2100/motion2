package queries

import (
	"github.com/abhi-kr-2100/motion2/database"
	"github.com/abhi-kr-2100/motion2/database/models"

	"github.com/google/uuid"
)

func GetTodoByID(id uuid.UUID) (*models.Todo, error) {
	var todo models.Todo
	if err := database.DB().Where("id = ?", id).First(&todo).Error; err != nil {
		return nil, err
	}

	return &todo, nil
}

func GetTodosByOwnerID(ownerID uuid.UUID) ([]*models.Todo, error) {
	var todos []*models.Todo
	if err := database.DB().Where("owner_id = ?", ownerID).Find(&todos).Error; err != nil {
		return nil, err
	}

	return todos, nil
}
