package middlewares

import (
	"github.com/abhi-kr-2100/motion2/config"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupCORSMiddleware(r *gin.Engine) {
	allowedOrigins := []string{config.Cfg().AllowedOrigin}

	r.Use(cors.New(cors.Config{
		AllowOrigins: allowedOrigins,
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders: []string{"Content-Type"},
	}))
}
