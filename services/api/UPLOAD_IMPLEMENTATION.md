# Upload Implementation - Backend

## Changes Made

### 1. New Package: `internal/storage/service.go`
- `Service` struct untuk handle file operations
- `SavePhoto()` - validate image + save dengan extension asli
- `SaveVideo()` - save video file dengan extension asli
- Returns `UploadResponse{ID, URL}` untuk client

### 2. Updated `internal/api/handlers.go`
- Added `UploadsHandler` struct
- `Upload()` method - handle `POST /v1/uploads` dengan FormData
- Accept `file`, `itemId`, `type` form fields
- Call storage service untuk save files
- Return JSON response dengan URL

### 3. Updated `internal/api/router.go`
- Added `Storage` ke Deps struct
- Instantiate `UploadsHandler`
- Register route `POST /v1/uploads`
- Add static file server untuk `/uploads/*` directory

### 4. Updated `internal/config/config.go`
- Added `UploadDir` config field
- Default: `/opt/goodiebox/uploads`
- Configurable via `UPLOAD_DIR` env var

### 5. Updated `cmd/server/main.go`
- Import storage package
- Instantiate storage service
- Pass Storage ke api.Deps

### 6. Updated `go.mod`
- Added `github.com/google/uuid` untuk generate unique IDs

## Environment Variables

```bash
# Optional - defaults to /opt/goodiebox/uploads
UPLOAD_DIR=/path/to/uploads
```

## Workflow

1. Frontend upload photo as data URI (WebP base64)
2. Frontend sends FormData to `POST /v1/uploads`
3. Backend receives file blob
4. Validate image format
5. Save to `/opt/goodiebox/uploads/{id}.webp`
6. Return URL: `/uploads/{id}.webp`
7. Frontend stores URL di builder state
8. Saat create order, items sudah punya real URLs (bukan data URIs)

## API Endpoint

**POST /v1/uploads**

### Request
- Content-Type: `multipart/form-data`
- Fields:
  - `file` (Blob) - Photo atau video
  - `itemId` (string) - Item ID
  - `type` (string) - "photo" | "video"

### Response
```json
{
  "id": "f47a2c9e-uuid",
  "url": "/uploads/f47a2c9e-uuid.webp"
}
```

### Error Response
```json
{
  "error": {
    "code": "UPLOAD_FAILED",
    "message": "error details"
  }
}
```

## Storage Directory Setup

Create upload directory:
```bash
mkdir -p /opt/goodiebox/uploads
chmod 755 /opt/goodiebox/uploads
```

Or use environment variable untuk override:
```bash
UPLOAD_DIR=/tmp/uploads ./bin/server
```

## Testing

Frontend already ready - saat klik "Buat tautan kejutan", akan:
1. Call `uploadAssets()` 
2. Upload files ke backend
3. Backend save + return URLs
4. Frontend create order dengan updated items (punya URLs)

Expected flow:
```
Photo (WebP base64) → Upload → /uploads/{id}.webp → Order create
Video (blob) → Upload → /uploads/{id}.mp4 → Order create
```

## Notes

- Frontend photo sudah convert ke WebP data URI - backend hanya validate + save
- Video file size validated di frontend (max 20MB) - backend bisa accept lebih besar
- Uploaded files public-readable di `/uploads/*` route
- No database tracking yet - just file storage (can add later if needed)
