# Backend Upload API Requirements

Frontend sekarang siap untuk upload photo/video assets ke backend sebelum create order. Berikut adalah endpoint yang perlu di-implement di backend:

## Endpoint: POST /v1/uploads

**Purpose:** Upload dan simpan photo/video, convert photo ke WebP, return URL untuk disimpan di order

### Request
- **Content-Type:** `multipart/form-data`
- **Fields:**
  - `file` (Blob) - Photo atau video file (sudah di-validate ukuran di frontend)
  - `itemId` (string) - ID item (untuk naming)
  - `type` (enum: 'photo' | 'video') - Tipe asset

### Response
```json
{
  "id": "abc123def456",
  "url": "/uploads/abc123def456.webp"
}
```

## Backend Implementation Checklist

### 1. File Validation
- Photo: reject jika bukan JPEG/PNG/WebP (meski frontend filter, validate di backend)
- Video: reject jika bukan MP4/WebM (meski frontend validasi, cek ulang di backend)
- Size check: ini optional karena sudah di-frontend (photo ~124KB, video max 20MB)

### 2. Photo Processing
- **Input:** JPEG/PNG/WebP data
- **Process:**
  - Decode dengan image library (Go: image/jpeg, image/png; image/webp)
  - Resize jika perlu (optional, frontend sudah maks 1600px)
  - Encode ke WebP dengan quality ~82-85
  - Simpan ke `/opt/goodiebox/uploads/`
- **Output:** `{id, url: "/uploads/abc123def456.webp"}`

### 3. Video Processing
- **Input:** MP4/WebM file
- **Process:**
  - Simpan langsung ke `/opt/goodiebox/uploads/` (jangan transcode, mahal)
  - Gunakan extension .mp4 atau .webm tergantung input
- **Output:** `{id, url: "/uploads/abc123def456.mp4"}`

### 4. Storage
- Directory: `/opt/goodiebox/uploads/`
- File naming: `{id}.{ext}` (e.g., `f47a2c9e-uuid.webp`)
- Permissions: 0644 (readable by web server)

### 5. Cleanup (Optional)
- Jika order dibayar: keep file
- Jika order expire/cancel: delete file (perlu track timestamp)

## Example Go Implementation (Pseudo)

```go
func handleUpload(w http.ResponseWriter, r *http.Request) {
  // Parse form
  file, header, err := r.FormFile("file")
  itemID := r.FormValue("itemId")
  assetType := r.FormValue("type")

  // Validate
  if assetType == "photo" {
    // Decode, validate JPEG/PNG/WebP
    img, _, err := image.Decode(file)
    // Encode to WebP
    buf := &bytes.Buffer{}
    webp.Encode(buf, img, &webp.Options{Quality: 82})
    
    // Save
    id := uuid.New().String()
    filePath := fmt.Sprintf("/opt/goodiebox/uploads/%s.webp", id)
    os.WriteFile(filePath, buf.Bytes(), 0644)
    
    // Return URL
    json.Marshal(map[string]string{"id": id, "url": fmt.Sprintf("/uploads/%s.webp", id)})
  } else if assetType == "video" {
    // Validate MP4/WebM
    // Save to uploads/
    // Return URL
  }
}
```

## Frontend Integration
- Frontend call `uploadAsset(blob, itemId, type)` from `api.ts`
- Mengirim FormData ke `/v1/uploads`
- Expect response `{id, url}`
- URL disimpan di item `imageUrl` atau `videoUrl`
- Saat create order, items sudah punya URLs (bukan data URIs)

## Testing
1. Upload photo (PNG/JPG ~2MB) → should convert to WebP, return URL
2. Upload video (MP4 ~10MB) → should save, return URL
3. Verify files exist di `/opt/goodiebox/uploads/`
4. Verify URLs bisa di-access dari browser (need to serve `/uploads/*` static)
