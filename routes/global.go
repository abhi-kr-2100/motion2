package routes

import (
	"github.com/abhi-kr-2100/motion2/handlers"
	"github.com/abhi-kr-2100/motion2/routes/middlewares"

	"github.com/gin-gonic/gin"
)

var r *gin.Engine

func Engine() *gin.Engine {
	if r == nil {
		r = gin.Default()
		SetupRoutes(r)
		middlewares.SetupCORSMiddleware(r)
	}

	return r
}

func SetupRoutes(r *gin.Engine) {
	r.GET("/users/:id", handlers.GetUserByID)
	r.GET("/users/:id/todos", handlers.GetTodosByOwnerID)

	// Used as /users?username=xyz
	r.GET("/users", handlers.GetUserByUsername)

	r.GET("/todos/:id", handlers.GetTodoByID)
	r.POST("/todos", handlers.CreateTodo)
	r.DELETE("/todos/:id", handlers.DeleteTodoByID)
	r.PUT("/todos/:id", handlers.UpdateTodoByID)
}
