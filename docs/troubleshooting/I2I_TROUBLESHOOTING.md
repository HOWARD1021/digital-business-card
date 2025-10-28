# I2I Troubleshooting

Common Issues
- Missing environment variables
  - PAID_API_KEY, MASTER_SECRET, CLOUDFLARE_R2_* are required by the I2I route
- Invalid API keys
  - Gemini responses will fail; the route returns a 500 with provider error info
- R2 not configured
  - Upload step fails with: "Cloudflare R2 credentials are not set"
- Rate limiting or transient errors
  - Iterations might fail; the route retries within bounds
- Network or port conflicts
  - Another app on :3000; run Next on :3001 for this project

Diagnosis Commands
- Check Workers health (8787)
  - curl -sS http://localhost:8787/health
- Check Next admin status (3001)
  - curl -sS http://localhost:3001/api/admin/keys/status
- Test I2I endpoint (multipart)
  - curl -X POST http://localhost:3001/api/i2i/transform -F "image=@public/sample.png" -F "transformPrompt=test" -F "iterations=2"

Solutions
- Set .env.local for Next runtime
  - PAID_API_KEY={{PAID_API_KEY}}
  - FREE_API_KEY={{FREE_API_KEY}}
  - MASTER_SECRET={{MASTER_SECRET}}
  - CLOUDFLARE_R2_ACCOUNT_ID={{ACCOUNT_ID}}
  - CLOUDFLARE_R2_ACCESS_KEY_ID={{ACCESS_KEY_ID}}
  - CLOUDFLARE_R2_SECRET_ACCESS_KEY={{SECRET_ACCESS_KEY}}
  - CLOUDFLARE_R2_BUCKET={{BUCKET_NAME}}
  - CLOUDFLARE_R2_ENDPOINT={{OPTIONAL_ENDPOINT}}
- Restart Next dev server after changing envs
- Use port 3001 if 3000 is busy
  - PORT=3001 npm run dev

Debug Tips
- Inspect server logs in both terminals for stack traces
- Temporarily lower iterations to 1–2 for faster feedback
- Validate base64 payloads: ensure no data: prefix or wrap with correct JSON quoting

References
- docs/guides/I2I_API_GUIDE.md
- Cloudflare R2 S3 API docs
- Google Generative AI SDK docs