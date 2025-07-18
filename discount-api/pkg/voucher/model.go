package voucher

import "time"

type CreateVoucherRequest struct {
	VoucherCode     string    `json:"voucher_code" validate:"required"`
	DiscountPercent int       `json:"discount_percent" validate:"required"`
	ExpiryDate      time.Time `json:"expiry_date" validate:"required"`
}

type UpdateVoucherRequest struct {
	VoucherCode     string    `json:"voucher_code"`
	DiscountPercent int       `json:"discount_percent"`
	ExpiryDate      time.Time `json:"expiry_date"`
}

type VoucherResponse struct {
	ID              uint      `json:"id"`
	VoucherCode     string    `json:"voucher_code"`
	DiscountPercent int       `json:"discount_percent"`
	ExpiryDate      time.Time `json:"expiry_date"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

type UploadResultRow struct {
	Row     int    `json:"row"`
	Code    string `json:"voucher_code"`
	Status  string `json:"status"` 
	Message string `json:"message,omitempty"`
}