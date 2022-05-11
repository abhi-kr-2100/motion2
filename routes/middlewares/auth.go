package middlewares

import (
	"fmt"
	"net/http"

	"github.com/abhi-kr-2100/motion2/database/queries"

	"github.com/gin-gonic/gin"
)

const UserIDKey = "UserID"

// Check if user is authenticated using username and password passed via
// request headers. If user is authenticated, set user ID to context.
// Otherwise, abort.
func authentication(c *gin.Context) {
	username := c.GetHeader("Username")
	if username == "" {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"message": "Username is required",
		})
		return
	}

	password := c.GetHeader("Password")

	user, err := queries.GetUserByUsername(username)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"message": fmt.Sprintf("User %v does not exist", username),
		})
		return
	}

	if !user.CanLogin(password) {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"message": fmt.Sprintf("Invalid password for user %v", username),
		})
		return
	}

	c.Set(UserIDKey, user.ID)
	c.Next()
}

func SetupAuthMiddleware(r *gin.Engine) {
	r.Use(authentication)
}
