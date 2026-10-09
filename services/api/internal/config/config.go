package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Config struct {
	Port               string
	AllowedOrigins     []string
	DatabaseURL        string
	MidtransServerKey  string
	MidtransClientKey  string
	MidtransProduction bool
	// MidtransSnapAPIBase override host Snap API untuk pengembangan lokal
	// (mis. mock Midtrans di http://localhost:4010). Kosong = host resmi.
	MidtransSnapAPIBase string
	BoxPriceIDR         int64
	UploadDir           string
	SMTPHost            string
	SMTPPort            int
	SMTPUser            string
	SMTPPass            string
	EmailFromAddr       string
	EmailFromName       string
}

// Load membaca konfigurasi dari environment variable dan gagal cepat
// jika nilai wajib kosong, agar server tidak jalan dengan setup setengah jadi.
func Load() (*Config, error) {
	cfg := &Config{
		Port:                envOr("PORT", "8080"),
		DatabaseURL:         os.Getenv("DATABASE_URL"),
		MidtransServerKey:   os.Getenv("MIDTRANS_SERVER_KEY"),
		MidtransClientKey:   os.Getenv("MIDTRANS_CLIENT_KEY"),
		MidtransProduction:  envBool("MIDTRANS_IS_PRODUCTION", false),
		MidtransSnapAPIBase: strings.TrimRight(os.Getenv("MIDTRANS_SNAP_API_BASE"), "/"),
	}

	if cfg.DatabaseURL == "" {
		return nil, fmt.Errorf("environment DATABASE_URL wajib diisi")
	}
	if cfg.MidtransServerKey == "" || cfg.MidtransClientKey == "" {
		return nil, fmt.Errorf("environment MIDTRANS_SERVER_KEY dan MIDTRANS_CLIENT_KEY wajib diisi")
	}

	price, err := strconv.ParseInt(envOr("BOX_PRICE_IDR", "49000"), 10, 64)
	if err != nil || price <= 0 {
		return nil, fmt.Errorf("BOX_PRICE_IDR harus bilangan bulat positif")
	}
	cfg.BoxPriceIDR = price

	origins := envOr("ALLOWED_ORIGINS", "http://localhost:5173")
	for _, o := range strings.Split(origins, ",") {
		// Trim slash akhir: browser mengirim Origin tanpa trailing slash,
		// jadi "https://contoh.com/" di env tidak akan pernah match.
		o = strings.TrimRight(strings.TrimSpace(o), "/")
		if o != "" {
			cfg.AllowedOrigins = append(cfg.AllowedOrigins, o)
		}
	}

	// Upload directory untuk store photo/video files
	cfg.UploadDir = envOr("UPLOAD_DIR", "/opt/goodiebox/uploads")

	// Email SMTP settings (optional)
	cfg.SMTPHost = os.Getenv("SMTP_HOST")
	cfg.SMTPPort = 587 // Default TLS port
	if p := os.Getenv("SMTP_PORT"); p != "" {
		if port, err := strconv.Atoi(p); err == nil {
			cfg.SMTPPort = port
		}
	}
	cfg.SMTPUser = os.Getenv("SMTP_USER")
	cfg.SMTPPass = os.Getenv("SMTP_PASS")
	cfg.EmailFromAddr = os.Getenv("EMAIL_FROM_ADDR")
	cfg.EmailFromName = envOr("EMAIL_FROM_NAME", "Special Digital Things")

	return cfg, nil
}

func envOr(key, fallback string) string {
	if v := strings.TrimSpace(os.Getenv(key)); v != "" {
		return v
	}
	return fallback
}

func envBool(key string, fallback bool) bool {
	v, err := strconv.ParseBool(strings.TrimSpace(os.Getenv(key)))
	if err != nil {
		return fallback
	}
	return v
}
