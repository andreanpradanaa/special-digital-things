package storage

import (
	"fmt"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"io"
	"os"
	"path/filepath"
	"strings"

	"github.com/google/uuid"
)

type Service struct {
	uploadDir string
}

type UploadResponse struct {
	ID  string `json:"id"`
	URL string `json:"url"`
}

func New(uploadDir string) *Service {
	return &Service{uploadDir: uploadDir}
}

// SavePhoto validate image dan simpan dengan original extension
// Frontend sudah convert ke WebP base64, tapi jika receive raw file
// kami validate dan simpan dengan extension asli
func (s *Service) SavePhoto(file io.Reader) (UploadResponse, error) {
	id := uuid.New().String()

	// Create temp file untuk validate image
	tmpf, err := os.CreateTemp("", "photo-*")
	if err != nil {
		return UploadResponse{}, fmt.Errorf("failed to create temp file: %w", err)
	}
	defer os.Remove(tmpf.Name())

	// Copy file ke temp
	if _, err := io.Copy(tmpf, file); err != nil {
		tmpf.Close()
		return UploadResponse{}, fmt.Errorf("failed to write temp file: %w", err)
	}
	tmpf.Close()

	// Open temp file untuk validate
	tmpf, err = os.Open(tmpf.Name())
	if err != nil {
		return UploadResponse{}, fmt.Errorf("failed to open temp file: %w", err)
	}
	defer tmpf.Close()

	// Validate image format
	_, format, err := image.Decode(tmpf)

	// Determine extension from format
	// Default ke .webp karena frontend convert semua ke WebP
	ext := ".webp"
	if err == nil && format != "" {
		ext = "." + strings.ToLower(format)
	}

	tmpf.Close()

	// Save file
	filename := fmt.Sprintf("%s%s", id, ext)
	filepath := filepath.Join(s.uploadDir, filename)

	// Re-open temp file untuk copy (fresh file pointer)
	tmpf, err = os.Open(tmpf.Name())
	if err != nil {
		return UploadResponse{}, fmt.Errorf("failed to reopen temp file: %w", err)
	}
	defer tmpf.Close()

	outf, err := os.Create(filepath)
	if err != nil {
		return UploadResponse{}, fmt.Errorf("failed to create file: %w", err)
	}
	defer outf.Close()

	if _, err := io.Copy(outf, tmpf); err != nil {
		os.Remove(filepath)
		return UploadResponse{}, fmt.Errorf("failed to save file: %w", err)
	}

	return UploadResponse{
		ID:  id,
		URL: fmt.Sprintf("/uploads/%s%s", id, ext),
	}, nil
}

// SaveVideo simpan video file dengan extension asli
func (s *Service) SaveVideo(file io.Reader, originalName string) (UploadResponse, error) {
	id := uuid.New().String()

	// Get video extension
	ext := strings.ToLower(filepath.Ext(originalName))
	if ext == "" {
		ext = ".mp4" // default
	}

	filename := fmt.Sprintf("%s%s", id, ext)
	filepath := filepath.Join(s.uploadDir, filename)

	// Save file directly
	f, err := os.Create(filepath)
	if err != nil {
		return UploadResponse{}, fmt.Errorf("failed to create file: %w", err)
	}
	defer f.Close()

	if _, err := io.Copy(f, file); err != nil {
		os.Remove(filepath)
		return UploadResponse{}, fmt.Errorf("failed to save file: %w", err)
	}

	return UploadResponse{
		ID:  id,
		URL: fmt.Sprintf("/uploads/%s%s", id, ext),
	}, nil
}
