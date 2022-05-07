package handlers

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/abhi-kr-2100/motion2/database/queries"
	"gorm.io/gorm"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

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

	c.JSON(http.StatusOK, user)
}

func GetUserByUsername(c *gin.Context) {
	panic("handlers: not implemented")
}
