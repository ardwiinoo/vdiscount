package internal

import (
	"strings"

	"github.com/gofiber/fiber/v2"

)

func AuthMiddleware(c *fiber.Ctx) error {
	token := strings.TrimPrefix(c.Get("Authorization"), "Bearer ")
	
	if token == "" || token != "123456" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"status":  "error",
			"message": "Unauthorized: Invalid or missing token",
			"data":    nil,
		})
	}

	return c.Next()
}
