# Verification Assistant — React + Laravel

This package contains a complete OpenAI-backed assistant integration plus server validation and a private-file submission controller.

## Files

- `frontend/VerificationModal.jsx` — full component with async chatbot and submission calls.
- `frontend/verificationModal.css` — supplied modal stylesheet.
- `frontend/verificationModal.chatbot.css` — completed chatbot styling, including disabled/loading states.
- `backend/app/Http/Requests/AskVerificationAssistantRequest.php` — assistant payload validation.
- `backend/app/Http/Requests/StoreVerificationRequest.php` — all form and document validation.
- `backend/app/Http/Controllers/Api/VerificationAssistantController.php` — server-side OpenAI Responses API call.
- `backend/app/Http/Controllers/Api/VerificationController.php` — validated submission storage with a UUID reference.
- `backend/app/Support/VerificationValidationCatalog.php` — written rules supplied to the model as grounding.
- `backend/config/openai.php`, `backend/routes/api.php`, and `backend/.env.example` — configuration.

## Install

1. Copy each backend file into the matching Laravel path. Merge the two route declarations into your existing `routes/api.php`; do not overwrite unrelated routes.
2. Copy the frontend files into the component directory used by your React/Vite application.
3. Put `OPENAI_API_KEY=your_project_key` in Laravel's `.env`. Optionally set `OPENAI_MODEL`; the example defaults to `gpt-5-mini`.
4. Run `php artisan config:clear` after changing `.env` during local development. In deployment, use your normal encrypted secret store and rebuild Laravel's config cache.
5. Ensure PHP upload limits exceed 100 MB if you intend to keep that limit (`upload_max_filesize` and `post_max_size`). Your reverse proxy also needs a compatible request-size limit.
6. Confirm the frontend and Laravel API share the same origin. If not, configure Laravel CORS and use a configured API base URL instead of relative `/api/...` URLs.
7. Keep or merge your existing verification lookup endpoints. They are referenced by the supplied component but cannot be recreated without your database models/table names.

## Important production decisions

- The sample submission controller stores manifests and uploads on Laravel's private `local` disk. Replace or extend this with your database/service layer and encryption/retention policy.
- Add authentication/authorization if this flow is not public.
- Replace positive-integer lookup validation with database `exists` and parent-child relationship validation for your real schema.
- Run malware scanning before any reviewer opens an uploaded document.
- The model can improve guidance but cannot guarantee correctness. Deterministic Laravel validation remains authoritative, and legal/compliance approvals must stay outside the chatbot.
- `store: false` is sent to the Responses API, and highly sensitive identity values plus document contents are excluded from the model request.

## API response shapes

Assistant success:

```json
{ "answer": "The field-specific answer." }
```

Submission success (`201`):

```json
{
  "message": "Verification submitted successfully.",
  "reference": "uuid"
}
```

Laravel validation errors use the standard `422` JSON response and are surfaced by the React component.