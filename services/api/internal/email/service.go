package email

import (
	"bytes"
	"fmt"
	"html/template"
	"log/slog"
	"net/smtp"
)

type Config struct {
	SMTPHost   string
	SMTPPort   int
	SMTPUser   string
	SMTPPass   string
	FromEmail  string
	FromName   string
	BaseURL    string
}

type Service struct {
	cfg *Config
	tpl *template.Template
}

type SendParams struct {
	To          string
	RecipientName string
	GiftSlug    string
	GiftLink    string
}

func New(cfg *Config) (*Service, error) {
	tpl, err := template.New("gift-email").Parse(emailTemplate)
	if err != nil {
		return nil, fmt.Errorf("failed to parse email template: %w", err)
	}
	return &Service{cfg: cfg, tpl: tpl}, nil
}

func (s *Service) SendGiftLink(params interface{}) error {
	p, ok := params.(map[string]string)
	if !ok {
		return fmt.Errorf("invalid params type")
	}
	if s.cfg.SMTPHost == "" {
		slog.Warn("email service not configured, skipping email send")
		return nil
	}

	var buf bytes.Buffer
	err := s.tpl.Execute(&buf, p)
	if err != nil {
		return fmt.Errorf("failed to render email template: %w", err)
	}

	auth := smtp.PlainAuth("", s.cfg.SMTPUser, s.cfg.SMTPPass, s.cfg.SMTPHost)
	addr := fmt.Sprintf("%s:%d", s.cfg.SMTPHost, s.cfg.SMTPPort)

	msg := fmt.Sprintf("From: %s <%s>\r\n"+
		"To: %s\r\n"+
		"Subject: Your Special Gift is Ready!\r\n"+
		"MIME-Version: 1.0\r\n"+
		"Content-Type: text/html; charset=UTF-8\r\n"+
		"\r\n%s", s.cfg.FromName, s.cfg.FromEmail, p["To"], buf.String())

	if err := smtp.SendMail(addr, auth, s.cfg.FromEmail, []string{p["To"]}, []byte(msg)); err != nil {
		slog.Error("failed to send email", "to", p["To"], "err", err)
		return fmt.Errorf("failed to send email: %w", err)
	}

	slog.Info("gift link email sent", "to", p["To"], "slug", p["GiftSlug"])
	return nil
}

const emailTemplate = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; line-height: 1.6; color: #44394a; background: #fef8f3; }
        .wrapper { background: #fef8f3; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.07); }
        .header { background: linear-gradient(135deg, #8b7355 0%, #a8824e 100%); padding: 40px 20px; text-align: center; color: white; }
        .header h1 { font-size: 28px; margin-bottom: 8px; font-weight: 700; letter-spacing: -0.5px; }
        .header p { font-size: 14px; opacity: 0.95; }
        .content { padding: 40px 30px; text-align: center; }
        .greeting { font-size: 18px; font-weight: 600; color: #44394a; margin-bottom: 16px; }
        .message { font-size: 15px; color: #6e6370; line-height: 1.8; margin-bottom: 30px; }
        .cta-button { display: inline-block; background: #8b7355; color: white; padding: 16px 48px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 20px 0; border: 2px solid #8b7355; min-height: 52px; line-height: 1.5; cursor: pointer; transition: all 0.2s; }
        .cta-button:hover { background: #7a6249; border-color: #7a6249; }
        .divider { height: 1px; background: #f0ede9; margin: 30px 0; }
        .link-text { font-size: 13px; color: #8a7d8c; margin-bottom: 8px; }
        .link-code { word-break: break-all; font-size: 12px; background: #faf6f1; padding: 12px; border-radius: 6px; color: #684f78; font-family: 'Monaco', 'Courier New', monospace; border: 1px solid #eae0da; }
        .footer { background: #faf6f1; padding: 30px; text-align: center; border-top: 1px solid #f0ede9; }
        .footer-text { font-size: 13px; color: #8a7d8c; margin-bottom: 12px; }
        .footer-brand { font-size: 12px; color: #a8824e; font-weight: 600; letter-spacing: 0.5px; }
        @media (max-width: 480px) {
            .header { padding: 30px 20px; }
            .header h1 { font-size: 24px; }
            .content { padding: 30px 20px; }
            .greeting { font-size: 16px; }
            .message { font-size: 14px; }
            .cta-button { padding: 18px 40px; font-size: 15px; min-height: 56px; }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <h1>🎁 You've Got A Gift!</h1>
                <p>Special Digital Things</p>
            </div>
            <div class="content">
                <div class="greeting">Hi {{.RecipientName}},</div>
                <p class="message">Someone special sent you a wonderful gift! Open it now to see what they prepared for you.</p>
                <a href="{{.GiftLink}}" class="cta-button">Open Your Gift</a>
                <div class="divider"></div>
                <p class="link-text">Can't see the button? Copy this link:</p>
                <div class="link-code">{{.GiftLink}}</div>
            </div>
            <div class="footer">
                <p class="footer-text">This gift link is personal to you. Don't share it with others.</p>
                <p class="footer-brand">© Special Digital Things</p>
            </div>
        </div>
    </div>
</body>
</html>`
