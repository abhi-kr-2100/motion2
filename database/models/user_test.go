package models

import "testing"

func TestUserCanLogin(t *testing.T) {
	t.Run("with incorrect password", func(t *testing.T) {
		mockPassword := "i-love-golang"
		incorrectPassword := "incorrect-password"

		mockUser := NewUser("user", mockPassword)

		if mockUser.CanLogin(incorrectPassword) {
			t.Errorf("user can login with incorrect password: correct password: %s, incorrect password: %s", mockPassword, incorrectPassword)
		}
	})

	t.Run("with correct password", func(t *testing.T) {
		mockPassword := "i-love-golang"

		mockUser := NewUser("user", mockPassword)

		if !mockUser.CanLogin(mockPassword) {
			t.Errorf("user cannot login with correct password: %s", mockPassword)
		}
	})
}
