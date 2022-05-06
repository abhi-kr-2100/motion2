package queries

import (
	"github.com/abhi-kr-2100/motion2/database"
	"github.com/abhi-kr-2100/motion2/database/models"

	"github.com/google/uuid"
)

func GetUserByID(id uuid.UUID) (*models.User, error) {
	var user models.User
	if err := database.DB().Where("id = ?", id).First(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func GetUserByUsername(username string) (*models.User, error) {
	panic("queries: not implemented")
}
