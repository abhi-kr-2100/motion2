package handlers

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/abhi-kr-2100/motion2/database/queries"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// GetTodoByID returns a todo given the ID.
//
// GET /todos/:id
func GetTodoByID(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": fmt.Sprintf("%s is not a valid UUID: %v", c.Param("id"), err),
		})
	}

	todo, err := queries.GetTodoByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{
				"error": fmt.Sprintf("todo with ID %s does not exist", id),
			})
			return
		}

		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Sprintf("failed to get todo with ID %s: %v", id, err),
		})
		return
	}

	c.JSON(http.StatusOK, todo)
}

// GetTodosByOwnerID returns todos given the owner ID.
//
// GET /users/:id/todos
func GetTodosByOwnerID(c *gin.Context) {
	panic("handlers: not implemented")
}
