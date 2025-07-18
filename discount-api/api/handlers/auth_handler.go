package handlers

import "github.com/gofiber/fiber/v2"

func LoginHandler(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"token": "123456",
	})
}
