package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"github.com/ardwiinoo/discount-mvp/api"
	"github.com/ardwiinoo/discount-mvp/internal/config"
)

func main() {
	config.LoadConfig()

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		config.App.DBUser,
		config.App.DBPass,
		config.App.DBHost,
		config.App.DBPort,
		config.App.DBName,
	)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database:", err)
	}

	app := fiber.New(fiber.Config{
		Prefork: true,
	})

	app.Use(cors.New(cors.Config{
    	AllowOrigins: "http://localhost:3000",
    	AllowHeaders: "*",
	}))

	api.SetupRoutes(app, db)

	log.Fatal(app.Listen(":" + config.App.Port))
}
