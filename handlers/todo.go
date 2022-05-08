package handlers

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/abhi-kr-2100/motion2/database/models/forms"
	"github.com/abhi-kr-2100/motion2/database/models/views"
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

	todoView := views.FromTodo(*todo)
	c.JSON(http.StatusOK, todoView)
}

// GetTodosByOwnerID returns todos given the owner ID.
//
// GET /users/:id/todos
func GetTodosByOwnerID(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": fmt.Sprintf("%s is not a valid UUID: %v", c.Param("id"), err),
		})
		return
	}

	todos, err := queries.GetTodosByOwnerID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{
				"error": fmt.Sprintf("user with ID %s does not exist", id),
			})
			return
		}

		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Sprintf("failed to get todos for user with ID %s: %v", id, err),
		})
		return
	}

	todoViews := make([]views.Todo, len(todos))
	for i, todo := range todos {
		todoViews[i] = views.FromTodo(*todo)
	}

	c.JSON(http.StatusOK, todoViews)
}

// CreateTodo creates a todo.
//
// POST /todos
func CreateTodo(c *gin.Context) {
	var todoForm forms.Todo
	if c.BindJSON(&todoForm) != nil {
		return
	}

	if todoForm.Title == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "title is required",
		})
	}

	todo, err := queries.CreateTodo(todoForm)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{
				"error": fmt.Sprintf("user with ID %s does not exist", todoForm.OwnerID),
			})
			return
		}

		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Sprintf("failed to create todo: %v", err),
		})
		return
	}

	todoView := views.FromTodo(*todo)
	c.JSON(http.StatusOK, todoView)
}
