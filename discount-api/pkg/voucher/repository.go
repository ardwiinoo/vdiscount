package voucher

import (
	"errors"
	"fmt"
	"strings"

	"gorm.io/gorm"

	"github.com/ardwiinoo/discount-mvp/pkg/entities"
)

type VoucherRepository struct {
	db *gorm.DB
}

func NewVoucherRepository(db *gorm.DB) *VoucherRepository {
	return &VoucherRepository{db}
}

func (r *VoucherRepository) Create(v *entities.Voucher) error {
	var existing entities.Voucher
	err := r.db.Where("voucher_code = ?", v.VoucherCode).First(&existing).Error

	if err == nil {
		return fmt.Errorf("voucher_code '%s' already exists", v.VoucherCode)
	}

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}

	return r.db.Create(v).Error
}


func (r *VoucherRepository) Update(id uint, data *entities.Voucher) error {
	return r.db.Model(&entities.Voucher{}).Where("id = ?", id).Updates(data).Error
}

func (r *VoucherRepository) Delete(id uint) error {
	return r.db.Delete(&entities.Voucher{}, id).Error
}

func (r *VoucherRepository) GetByID(id uint) (*entities.Voucher, error) {
	var v entities.Voucher
	err := r.db.First(&v, id).Error
	return &v, err
}

func (r *VoucherRepository) List(search, sort string, asc bool, limit, offset int) ([]VoucherResponse, int64, error) {
	var vouchers []VoucherResponse
	var total int64

	query := r.db.Model(&entities.Voucher{})
	if search != "" {
		search = "%" + strings.ToLower(search) + "%"
		query = query.Where("LOWER(voucher_code) LIKE ?", search)
	}

	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	if sort == "" {
		sort = "created_at"
	}
	order := sort
	if !asc {
		order += " DESC"
	}

	err = query.Select("id", "voucher_code", "discount_percent", "expiry_date", "created_at", "updated_at").
		Order(order).
		Limit(limit).
		Offset(offset).
		Scan(&vouchers).Error

	return vouchers, total, err
}

