package handlers

import (
	"bytes"
	"encoding/csv"
	"strconv"

	"github.com/gofiber/fiber/v2"

	"github.com/ardwiinoo/discount-mvp/pkg/voucher"

)

type VoucherHandler struct {
	Service *voucher.VoucherService
}

func NewVoucherHandler(service *voucher.VoucherService) *VoucherHandler {
	return &VoucherHandler{service}
}

func (h *VoucherHandler) Create(c *fiber.Ctx) error {
	var dto voucher.CreateVoucherRequest
	
	if err := c.BodyParser(&dto); err != nil {
		return c.Status(400).JSON(fiber.Map{"status": "failed", "message": err.Error()})
	}
	
	if err := h.Service.Create(dto); err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": err.Error()})
	}
	
	return c.JSON(fiber.Map{"status": "success", "message": "Voucher created"})
}

func (h *VoucherHandler) Update(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))
	
	var dto voucher.UpdateVoucherRequest
	
	if err := c.BodyParser(&dto); err != nil {
		return c.Status(400).JSON(fiber.Map{"status": "failed", "message": err.Error()})
	}
	
	if err := h.Service.Update(uint(id), dto); err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": err.Error()})
	}
	
	return c.JSON(fiber.Map{"status": "success", "message": "Voucher updated"})
}

func (h *VoucherHandler) Delete(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))
	
	if err := h.Service.Delete(uint(id)); err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": err.Error()})
	}
	
	return c.JSON(fiber.Map{"status": "success", "message": "Voucher deleted"})
}

func (h *VoucherHandler) List(c *fiber.Ctx) error {
	search := c.Query("search", "")
	sort := c.Query("sort", "created_at")
	order := c.Query("order", "asc")
	asc := order == "asc"

	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	offset, _ := strconv.Atoi(c.Query("offset", "0"))

	vouchers, total, err := h.Service.List(search, sort, asc, limit, offset)
	
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": err.Error()})
	}

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "Voucher list",
		"data": fiber.Map{
			"total":    total,
			"vouchers": vouchers,
		},
	})
}

func (h *VoucherHandler) ExportCSVHandler(c *fiber.Ctx) error {
	vouchers, err := h.Service.ExportAll()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Failed to fetch vouchers")
	}

	c.Set("Content-Disposition", "attachment;filename=vouchers.csv")
	c.Set("Content-Type", "text/csv")

	buf := new(bytes.Buffer)
	writer := csv.NewWriter(buf)

	writer.Write([]string{"voucher_code", "discount_percent", "expiry_date"})

	for _, v := range vouchers {
		writer.Write([]string{
			v.VoucherCode,
			strconv.Itoa(v.DiscountPercent),
			v.ExpiryDate.Format("2006-01-02"),
		})
	}
	writer.Flush()

	return c.SendStream(buf)
}

func (h *VoucherHandler) UploadCSVHandler(c *fiber.Ctx) error {
	fileHeader, err := c.FormFile("file")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "File tidak ditemukan"})
	}

	file, err := fileHeader.Open()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Gagal membuka file"})
	}
	defer file.Close()

	results, err := h.Service.ImportCSV(file)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Gagal mengimpor data"})
	}

	return c.JSON(fiber.Map{
		"message": "Proses impor selesai",
		"result":  results,
	})
}

