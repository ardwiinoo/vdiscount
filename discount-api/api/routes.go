package api

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"github.com/ardwiinoo/discount-mvp/api/handlers"
	"github.com/ardwiinoo/discount-mvp/internal"
	"github.com/ardwiinoo/discount-mvp/pkg/voucher"
)

func SetupRoutes(app *fiber.App, db *gorm.DB) {
	repo := voucher.NewVoucherRepository(db)
	service := voucher.NewVoucherService(repo)
	handler := handlers.NewVoucherHandler(service)

	app.Post("/login", handlers.LoginHandler)

	v := app.Group("/vouchers", internal.AuthMiddleware)
	v.Post("/upload-csv", handler.UploadCSVHandler)
	v.Get("/export", handler.ExportCSVHandler)
	v.Get("/", handler.List)
	v.Post("/", handler.Create)
	v.Put("/:id", handler.Update)
	v.Delete("/:id", handler.Delete)
}