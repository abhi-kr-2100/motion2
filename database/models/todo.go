package models

import "github.com/google/uuid"

type Todo struct {
	Model

	Title       string `gorm:"uniqueIndex:title_owner"`
	IsCompleted bool

	OwnerID uuid.UUID
	Owner   User `gorm:"uniqueIndex:title_owner;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}
