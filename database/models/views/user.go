package views

import (
	"github.com/abhi-kr-2100/motion2/database/models"
	"github.com/google/uuid"
)

type User struct {
	ID uuid.UUID

	Username string
}

func FromUser(user models.User) User {
	return User{
		ID:       user.ID,
		Username: user.Username,
	}
}
