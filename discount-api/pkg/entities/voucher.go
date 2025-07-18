package entities

import "time"

type Voucher struct {
	ID              uint      `gorm:"primaryKey;autoIncrement"`
	VoucherCode     string    `gorm:"column:voucher_code;type:varchar(255);unique;not null"`
	DiscountPercent int       `gorm:"not null"`
	ExpiryDate      time.Time `gorm:"not null"`
	CreatedAt       time.Time `gorm:"autoCreateTime"`
	UpdatedAt       time.Time `gorm:"autoUpdateTime"`
}
