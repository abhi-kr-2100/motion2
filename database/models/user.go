package models

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Model

	Username     string `gorm:"unique_index"`
	PasswordHash string
}

func (u *User) CanLogin(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(password))
	return err == nil
}

func NewUser(username, password string) User {
	return User{
		Username:     username,
		PasswordHash: hashPassword(password),
	}
}

func hashPassword(password string) string {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		panic(fmt.Sprintf("user: error hashing password: %v", err))
	}

	return string(bytes)
}
