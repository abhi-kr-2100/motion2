package queries

import (
	"github.com/abhi-kr-2100/motion2/database/models"

	"github.com/google/uuid"
)

func GetUserByID(id uuid.UUID) (*models.User, error) {
	panic("queries: not implemented")
}

func GetUserByUsername(username string) (*models.User, error) {
	panic("queries: not implemented")
}
