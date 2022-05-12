package handlers

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/abhi-kr-2100/motion2/database/models/views"
	"github.com/abhi-kr-2100/motion2/database/queries"
	"gorm.io/gorm"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GetUserByID returns a user given the ID.
//
// GET /users/:id
func GetUserByID(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": fmt.Sprintf("%s is not a valid UUID: %v", c.Param("id"), err),
		})
		return
	}

	user, err := queries.GetUserByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{
				"error": fmt.Sprintf("user with ID %s does not exist", id),
			})
			return
		}

		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Sprintf("failed to get user with ID %s: %v", id, err),
		})
		return
	}

	userView := views.FromUser(*user)
	c.JSON(http.StatusOK, userView)
}

// GetUserByUsername returns a user given the username as a query parameter.
//
// GET /users?username=:username
// GET /users is Forbidden
func GetUserByUsername(c *gin.Context) {
	username, ok := c.GetQuery("username")
	if !ok {
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
			"error": "user can only be retrieved by username",
		})
		return
	}

	user, err := queries.GetUserByUsername(username)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{
				"error": fmt.Sprintf("user with username %s does not exist", username),
			})
			return
		}

		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Sprintf("failed to get user with username %s: %v", username, err),
		})
	}

	userView := views.FromUser(*user)
	c.JSON(http.StatusOK, userView)
}

// Is the user logged in?
//
// GET /users/login
//
// This is just a dummy endpoint which relies on the authentication middleware
// to handle login but informs the client whether user is logged in.
func LoginUser(c *gin.Context) {
	// If we have reached this, user must be logged in already
	c.JSON(http.StatusOK, gin.H{
		"message": "user is logged in",
	})
}
