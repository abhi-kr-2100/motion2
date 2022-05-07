package models

import "github.com/google/uuid"

type Todo struct {
	Model

	Title       string `gorm:"uniqueIndex:title_owner"`
	IsCompleted bool

	OwnerID uuid.UUID `gorm:"uniqueIndex:title_owner"`
	Owner   User      `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}
