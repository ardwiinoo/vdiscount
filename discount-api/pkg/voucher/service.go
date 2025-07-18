package voucher

import (
	"encoding/csv"
	"io"
	"strconv"
	"time"

	"github.com/ardwiinoo/discount-mvp/pkg/entities"
)

type VoucherService struct {
	repo *VoucherRepository
}

func NewVoucherService(repo *VoucherRepository) *VoucherService {
	return &VoucherService{repo}
}

func (s *VoucherService) Create(dto CreateVoucherRequest) error {
	v := entities.Voucher{
		VoucherCode:     dto.VoucherCode,
		DiscountPercent: dto.DiscountPercent,
		ExpiryDate:      dto.ExpiryDate,
	}
	return s.repo.Create(&v)
}

func (s *VoucherService) Update(id uint, dto UpdateVoucherRequest) error {
	v := entities.Voucher{
		VoucherCode:     dto.VoucherCode,
		DiscountPercent: dto.DiscountPercent,
		ExpiryDate:      dto.ExpiryDate,
	}
	return s.repo.Update(id, &v)
}

func (s *VoucherService) Delete(id uint) error {
	return s.repo.Delete(id)
}

func (s *VoucherService) List(search, sort string, asc bool, limit, offset int) ([]VoucherResponse, int64, error) {
	return s.repo.List(search, sort, asc, limit, offset)
}

func (s *VoucherService) ExportAll() ([]VoucherResponse, error) {
	vouchers, _, err := s.repo.List("", "created_at", true, -1, -1) 
	return vouchers, err
}

func (s *VoucherService) ImportCSV(reader io.Reader) ([]UploadResultRow, error) {
	csvReader := csv.NewReader(reader)
	csvReader.TrimLeadingSpace = true

	rows, err := csvReader.ReadAll()
	if err != nil {
		return nil, err
	}

	var results []UploadResultRow
	for i, row := range rows {
		if i == 0 {
			// Skip header row
			continue
		}
		if len(row) < 3 {
			results = append(results, UploadResultRow{
				Row:    i + 1,
				Code:   "",
				Status: "failed",
				Message: "Format tidak sesuai",
			})
			continue
		}

		voucher := entities.Voucher{
			VoucherCode: row[0],
		}

		disc, err := strconv.Atoi(row[1])
		if err != nil {
			results = append(results, UploadResultRow{
				Row:     i + 1,
				Code:    row[0],
				Status:  "failed",
				Message: "Diskon tidak valid",
			})
			continue
		}
		voucher.DiscountPercent = disc

		expDate, err := time.Parse("2006-01-02", row[2])
		if err != nil {
			results = append(results, UploadResultRow{
				Row:     i + 1,
				Code:    row[0],
				Status:  "failed",
				Message: "Tanggal tidak valid (format YYYY-MM-DD)",
			})
			continue
		}
		voucher.ExpiryDate = expDate

		err = s.repo.Create(&voucher)
		if err != nil {
			results = append(results, UploadResultRow{
				Row:     i + 1,
				Code:    voucher.VoucherCode,
				Status:  "failed",
				Message: err.Error(),
			})
			continue
		}

		results = append(results, UploadResultRow{
			Row:    i + 1,
			Code:   voucher.VoucherCode,
			Status: "success",
		})
	}

	return results, nil
}
