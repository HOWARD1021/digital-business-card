# FR017, FR021–FR025 Verification Report

Purpose: Validate Slideswipe (FR017) and the I2I pipeline (FR021–FR025) against the PRD.

Date: <fill-after-run>
Environment: macOS, Node/Next.js dev, Cloudflare Workers dev

1) Prerequisites
- Two terminals
  - Terminal A (Workers): npm run dev:workers (http://localhost:8787)
  - Terminal B (Next.js): PORT=3001 npm run dev (http://localhost:3001)
- .env.local (Next.js runtime)
  - PAID_API_KEY={{PAID_API_KEY}}
  - FREE_API_KEY={{FREE_API_KEY}} (optional)
  - MASTER_SECRET={{MASTER_SECRET}}
  - CLOUDFLARE_R2_ACCOUNT_ID={{ACCOUNT_ID}}
  - CLOUDFLARE_R2_ACCESS_KEY_ID={{ACCESS_KEY_ID}}
  - CLOUDFLARE_R2_SECRET_ACCESS_KEY={{SECRET_ACCESS_KEY}}
  - CLOUDFLARE_R2_BUCKET={{BUCKET_NAME}}
  - CLOUDFLARE_R2_ENDPOINT={{OPTIONAL_ENDPOINT}}
  - D1_API_URL={{OPTIONAL_D1_API_URL}}
  - D1_API_TOKEN={{OPTIONAL_D1_TOKEN}}

2) Quick Health Checks
- Workers: curl -sS http://localhost:8787/health
  - Expected: success: true JSON
- Next (Admin Keys): curl -sS http://localhost:3001/api/admin/keys/status
  - Expected: { configured: <bool>, updatedAt: <timestamp|null> }

3) FR025 Admin API Keys (Encryption) – Verification
3.1 Unconfigured state
- curl http://localhost:3001/api/admin/keys/status
- Expected: { configured: false, updatedAt: null }

3.2 POST without MASTER_SECRET (negative test)
- With MASTER_SECRET unset, POST /api/admin/keys should 500
- curl -X POST http://localhost:3001/api/admin/keys -H "Content-Type: application/json" -d '{"paidKey":"test"}'
- Expected: HTTP 500 with error message about MASTER_SECRET not configured

3.3 Successful configuration
- Ensure MASTER_SECRET is set in .env.local, restart Next.js dev server
- curl -X POST http://localhost:3001/api/admin/keys -H "Content-Type: application/json" -d '{"paidKey":"{{PAID_API_KEY}}","freeKey":"{{FREE_API_KEY}}"}'
- Expected: 200 { ok: true }
- Verify status again: configured: true, updatedAt set

Result: <pass/fail + evidence>

4) FR021–FR024 I2I Transform API – Verification
4.1 Multipart path
- curl -X POST http://localhost:3001/api/i2i/transform \
  -F "image=@public/sample.png" \
  -F "transformPrompt=make it vibrant" \
  -F "iterations=3"
- Expected (200): {
    success: true,
    id: "...",
    imageUrl: "https://<r2-endpoint>/<bucket>/i2i_success_...png",
    status: "轉換成功 (第 X 次嘗試)",
    evaluation: "...",
    attempts: X
  }
- If R2 not configured: 500 error "Cloudflare R2 credentials are not set"

4.2 JSON path
- base64 public/sample.png to sample.b64, then POST JSON with imageBase64, mimeType, transformPrompt, iterations
- Expected same schema as 4.1

4.3 Error cases
- Missing image: 400 { error: 'image is required' }
- Missing transformPrompt: 400 { error: 'transformPrompt is required' }
- Invalid API keys: upstream provider error returned as 500 JSON

4.4 Metadata storage
- With D1_API_URL/TOKEN set: verify records created remotely
- Without D1: in-memory fallback (used only for dev verification)

Result: <pass/fail + evidence>

5) FR017 Slideswipe UI – Verification
5.1 Fallback mode (no backend images)
- Navigate http://localhost:3001/slideswipe
- Verify: fallback assets under public/slides/ used, grid renders, "開始" button triggers sequential reveal (800ms step, 1200ms transition)

5.2 Backend-fed mode
- Ensure Workers uploads have Category 1 original and Category 2 style images
- Reload /slideswipe; verify apiClient-driven URLs resolve
- Style labels match CORE_STYLES

5.3 UX checks
- Grid layout responsive (2x4)
- Keyboard accessibility and toolbar buttons functional

Result: <pass/fail + evidence>

6) Pass/Fail Matrix
- FR017 Slideswipe UI: <pass/fail>
- FR021 I2I endpoint works end-to-end: <pass/fail>
- FR022 Iterative self-correction observed (attempts > 1 if needed): <pass/fail>
- FR023 Dual-model cost optimization (paid for generation, free for analysis/eval): <pass/fail>
- FR024 R2 upload + metadata persisted: <pass/fail>
- FR025 Admin key management + encryption: <pass/fail>

7) Notes & Follow-ups
- Any flakiness, performance notes, or further hardening items
- Screenshots and curl outputs saved to: docs/verification/evidence/<date>/
