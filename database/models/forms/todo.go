package forms

import (
	"github.com/google/uuid"
)

type Todo struct {
	Title       string
	IsCompleted bool

	OwnerID uuid.UUID
}
