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

// GetTodos returns all todos owned by the currently logged-in user.
// Actually, it returns all todos for now, but authorization will soon be
// implemented.
//
// GET /todos
func GetTodos(c *gin.Context) {
	todos, err := queries.GetTodos()
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Sprintf("failed to get todos: %v", err),
		})
		return
	}

	todoViews := make([]views.Todo, len(todos))
	for i, todo := range todos {
		todoViews[i] = views.FromTodo(*todo)
	}

	c.JSON(http.StatusOK, todoViews)
}

// GetTodoByID returns a todo given the ID.
//
// GET /todos/:id
func GetTodoByID(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": fmt.Sprintf("%s is not a valid UUID: %v", c.Param("id"), err),
		})
		return
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
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "invalid request body",
		})
		return
	}

	if todoForm.Title == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "title is required",
		})
		return
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

// DeleteTodo deletes a todo.
//
// DELETE /todos/:id
func DeleteTodoByID(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": fmt.Sprintf("%s is not a valid UUID: %v", c.Param("id"), err),
		})
		return
	}

	if err := queries.DeleteTodoByID(id); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{
				"error": fmt.Sprintf("todo with ID %s does not exist", id),
			})
			return
		}

		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Sprintf("failed to delete todo with ID %s: %v", id, err),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": fmt.Sprintf("todo with ID %s deleted", id),
	})
}

// UpdateTodoByID updates a todo.
//
// PUT /todos/:id
func UpdateTodoByID(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": fmt.Sprintf("%s is not a valid UUID: %v", c.Param("id"), err),
		})
		return
	}

	var todoForm forms.Todo
	if c.BindJSON(&todoForm) != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "failed to parse JSON",
		})
		return
	}

	// queries.UpdateTodoByID panics when ownerID in the form is not the same
	// as the ownerID of the todo. As updating ownerID is not allowed, we end
	// with a forbidden error.
	defer func() {
		if r := recover(); r != nil {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"error": fmt.Sprintf("ownership transfer is not allowed: %v", r),
			})
		}
	}()

	updated, err := queries.UpdateTodoByID(id, todoForm)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{
				"error": fmt.Sprintf("todo with ID %s does not exist", id),
			})
			return
		}

		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Sprintf("failed to update todo with ID %s: %v", id, err),
		})
		return
	}

	todoView := views.FromTodo(*updated)
	c.JSON(http.StatusOK, todoView)
}
