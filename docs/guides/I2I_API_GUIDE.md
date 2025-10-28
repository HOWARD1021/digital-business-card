# I2I Transform API Guide

Overview
- Endpoint: POST /api/i2i/transform (Next.js route)
- Purpose: Transform an input image using AI with an iterative self-correction loop (Gemini models) and upload the final result to Cloudflare R2.
- Dev URLs:
  - Next.js: http://localhost:3001
  - Full endpoint: http://localhost:3001/api/i2i/transform

Prerequisites
- Next.js dev server running on port 3001
- .env.local contains:
  - PAID_API_KEY={{PAID_API_KEY}}
  - FREE_API_KEY={{FREE_API_KEY}}
  - MASTER_SECRET={{MASTER_SECRET}}
  - CLOUDFLARE_R2_* variables for upload

Request Formats
1) Multipart/form-data
- Fields:
  - image: file (required)
  - transformPrompt: string (required)
  - iterations: number (optional, default 5)

Example
curl -X POST http://localhost:3001/api/i2i/transform \
  -F "image=@public/sample.png" \
  -F "transformPrompt=make it more vibrant and colorful" \
  -F "iterations=3"

2) JSON payload
- Fields:
  - imageBase64: string (required, base64 image data)
  - mimeType: string (optional, default image/png)
  - transformPrompt: string (required)
  - iterations: number (optional, default 5)

Example
# base64 encode an image
base64 -i public/sample.png -o sample.b64

curl -X POST http://localhost:3001/api/i2i/transform \
  -H "Content-Type: application/json" \
  -d '{
    "imageBase64": "'"$(cat sample.b64)"'",
    "mimeType": "image/png",
    "transformPrompt": "make it artistic with watercolor feel",
    "iterations": 2
  }'

Response Schema (success)
{
  "success": true,
  "id": "<uuid>",
  "imageUrl": "https://<r2-endpoint>/<bucket>/i2i_success_YYYYMMDD_HHMMSS_xxxx.png",
  "status": "轉換成功 (第 N 次嘗試)",
  "evaluation": "<final evaluation text>",
  "attempts": N
}

Response Schema (failure)
- 400: { "error": "image is required" } or { "error": "transformPrompt is required" }
- 422: { "success": false, "status": "轉換未達成目標 (嘗試 X 次)" }
- 500: { "error": "<message>" }

Behavior Notes
- Iterative loop uses FREE model for description/evaluation and PAID model for image generation
- Uploads final image to Cloudflare R2 using S3-compatible API
- Writes metadata via D1 REST if D1_API_URL/TOKEN are set; otherwise in-memory fallback for dev

Troubleshooting
- R2 credentials missing → 500: Cloudflare R2 credentials are not set
- Invalid/expired API keys → upstream provider error → 500
- See docs/troubleshooting/I2I_TROUBLESHOOTING.md for more
