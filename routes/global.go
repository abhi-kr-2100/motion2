package routes

import (
	"sync"

	"github.com/abhi-kr-2100/motion2/handlers"
	"github.com/abhi-kr-2100/motion2/routes/middlewares"

	"github.com/gin-gonic/gin"
)

var r *gin.Engine
var once sync.Once

func Engine() *gin.Engine {
	once.Do(func() {
		if r == nil {
			r = gin.Default()
			SetupMiddlewares(r)
			SetupRoutes(r)
		}
	})

	return r
}

func SetupMiddlewares(r *gin.Engine) {
	middlewares.SetupCORSMiddleware(r)
	middlewares.SetupAuthMiddleware(r)
}

func SetupRoutes(r *gin.Engine) {
	r.GET("/users/:id", handlers.GetUserByID)
	r.GET("/users/:id/todos", handlers.GetTodosByOwnerID)
	r.GET("/users/login", handlers.LoginUser)

	// Used as /users?username=xyz
	r.GET("/users", handlers.GetUserByUsername)

	r.GET("/todos", handlers.GetTodos)
	r.GET("/todos/:id", handlers.GetTodoByID)
	r.POST("/todos", handlers.CreateTodo)
	r.DELETE("/todos/:id", handlers.DeleteTodoByID)
	r.PUT("/todos/:id", handlers.UpdateTodoByID)
}
