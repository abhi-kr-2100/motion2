package queries

import (
	"github.com/abhi-kr-2100/motion2/database"
	"github.com/abhi-kr-2100/motion2/database/models"
	"github.com/abhi-kr-2100/motion2/database/models/forms"

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

func CreateTodo(form forms.Todo) (*models.Todo, error) {
	todo := models.Todo{
		Title:       form.Title,
		IsCompleted: form.IsCompleted,
		OwnerID:     form.OwnerID,
	}

	if _, err := GetUserByID(todo.OwnerID); err != nil {
		return nil, err
	}

	if err := database.DB().Create(&todo).Error; err != nil {
		return nil, err
	}

	return &todo, nil
}

func DeleteTodoByID(id uuid.UUID) error {
	if err := database.DB().Delete(&models.Todo{}, id).Error; err != nil {
		return err
	}

	return nil
}

func UpdateTodoByID(id uuid.UUID, form forms.Todo) (*models.Todo, error) {
	var todo models.Todo
	if err := database.DB().Where("id = ?", id).First(&todo).Error; err != nil {
		return nil, err
	}

	if form.OwnerID != todo.OwnerID {
		panic("queries: ownership transfer not yet supported")
	}

	todo.Title = form.Title
	todo.IsCompleted = form.IsCompleted
	todo.OwnerID = form.OwnerID

	if err := database.DB().Save(&todo).Error; err != nil {
		return nil, err
	}

	return &todo, nil
}
