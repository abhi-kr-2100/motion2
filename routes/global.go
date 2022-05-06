package routes

import (
	"github.com/abhi-kr-2100/motion2/routes/handlers"

	"github.com/gin-gonic/gin"
)

var r *gin.Engine

func Engine() *gin.Engine {
	if r == nil {
		r = gin.Default()
		SetupRoutes(r)
	}

	return r
}

func SetupRoutes(r *gin.Engine) {
	r.GET("/users/:id", handlers.GetUserByID)
	r.GET("/users", handlers.GetUserByUsername)
	r.GET("/users/:id/todos", handlers.GetTodosByOwnerID)
	r.GET("/todos/:id", handlers.GetTodoByID)
}
