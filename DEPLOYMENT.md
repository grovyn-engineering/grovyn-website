# Grovyn — Docker + Dokploy deployment (Oracle Ubuntu 24.04)

One Docker Compose stack on Dokploy:

```
                       ┌────────────────────── Oracle Ubuntu 24.04 ──────────────────────┐
  Internet ──443──▶ Traefik (Dokploy) ──▶ frontend (Next.js :3000) ──/api/*──▶ backend (Express :8080)
                                                                                    │
                                              MongoDB Atlas ◀───────────────────────┤
                                              Upstash Redis ◀───────────────────────┤
                                              Cloudinary / Resend ◀─────────────────┘
```

- **Only the frontend is exposed.** The browser talks to one origin (`https://grovyn.in`). `/api/*` is proxied *inside* Next.js (`next.config.ts` → `rewrites()`) to the `backend` container, which strips the `/api` prefix so the backend's root-mounted routes still match. → no CORS, cookies are same-site.
- **Mongo + Redis are external** (Atlas + Upstash) — nothing to host on the box.

---

## 0. One-time: make the backend reachable in one clone

The frontend repo (`grovyn-website-2.0`) and backend repo (`grovyn-backend`) are separate, and `backend/` is gitignored here. Dokploy clones **one** repo, so the backend must come along as a **git submodule**.

Run locally, from the frontend repo root:

```bash
# 1. Make sure the backend's own work is committed & pushed to grovyn-backend first.
cd backend && git add -A && git commit -m "pre-submodule snapshot" && git push && cd ..

# 2. Remove the gitignore entry for backend (so it can be tracked as a submodule).
#    Edit .gitignore and delete the line `backend`.

# 3. Move the working copy aside, add as submodule, done.
mv backend ../grovyn-backend-tmp
git submodule add https://github.com/grovyn-team/grovyn-backend.git backend
git commit -m "Add grovyn-backend as submodule + Docker/Dokploy deploy"
git push
rm -rf ../grovyn-backend-tmp
```

> Alternative (simpler, if you don't need the backend as its own repo): just commit `backend/` straight into this repo as a normal folder (delete `backend/.git`, remove the gitignore line, `git add backend`). Then skip the submodule step in Dokploy below.

In **Dokploy → your app → General**, enable **"Enable Submodules"** so the clone pulls the backend.

---

## 1. Prepare the Oracle box

SSH in (`ubuntu@<public-ip>`), then:

### 1a. Open the firewall — the #1 Oracle gotcha

Oracle blocks ports in **two** places. You must open **80 & 443** in BOTH.

**(i) Oracle Cloud Console** → Networking → your VCN → Security List (or Network Security Group) → add **Ingress Rules**:

| Source CIDR | Protocol | Dest port |
|---|---|---|
| 0.0.0.0/0 | TCP | 80 |
| 0.0.0.0/0 | TCP | 443 |
| 0.0.0.0/0 | TCP | 3000 *(temporary, for the Dokploy panel — close later)* |

**(ii) The instance's own iptables** (Oracle Ubuntu images ship with a restrictive INPUT chain):

```bash
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3000 -j ACCEPT
sudo netfilter-persistent save
```

> If `https` times out but the container is healthy, it's almost always one of these two rules missing.

### 1b. Install Dokploy (installs Docker + Traefik for you)

```bash
curl -sSL https://dokploy.com/install.sh | sudo sh
```

Then open `http://<public-ip>:3000`, create the admin account.

---

## 2. Create the application in Dokploy

1. **Project → Create Service → Compose.**
2. **Provider:** GitHub (connect the `grovyn-team` org) → repo `grovyn-website-2.0`, branch `main`.
3. **Enable Submodules:** ON (pulls `grovyn-backend`).
4. **Compose Path:** `docker-compose.yml`.

### 2a. Environment (Compose "Environment" tab)

These feed the `${...}` build args in `docker-compose.yml` (frontend bundle is built with them):

```
NEXT_PUBLIC_API_URL=https://grovyn.in/api
NEXT_PUBLIC_CAL_COM_LINK=<your cal.com link>
NEXT_PUBLIC_GA_ID=<your GA id>
NEXT_PUBLIC_SUPPORT_EMAIL=support@grovyn.in
```

> `NEXT_PUBLIC_API_URL` **must be the public HTTPS URL ending in `/api`** (the client code rejects relative/non-https values, `lib/api.ts`). The `/api` is stripped again by the Next rewrite before it reaches the backend.

### 2b. Backend secrets (`./backend/.env` on the server)

The backend reads `./backend/.env` (via `env_file`). Create it on the server in the app's source directory (Dokploy → app → "Advanced/Volumes" or SSH into the cloned path), based on `backend/.env.example`:

```
MONGODB_URI=mongodb+srv://...@cluster.mongodb.net/grovyn?retryWrites=true&w=majority
FRONTEND_URL=https://grovyn.in
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
ADMIN_JWT_SECRET=<long random string>
ADMIN_SETUP_SECRET=<long random string — remove after first admin is created>
REDIS_URL=rediss://default:<password>@<endpoint>.upstash.io:6379
RESEND_API_KEY=...
EMAIL_FROM=Grovyn <noreply@grovyn.in>
PORT=8080

# Same-domain admin auth over HTTPS:
ADMIN_COOKIE_SECURE=true
# (Leave SameSite default = lax. No cross-domain cookie config needed — same origin.)
```

> Keeping `backend/.env` out of git is correct; create it directly on the server.

### 2c. Domain (Compose "Domains" tab)

- **Host:** `grovyn.in` (and/or `www.grovyn.in`)
- **Service:** `frontend`
- **Container Port:** `3000`
- **HTTPS:** ON, **Certificate:** Let's Encrypt

No domain entry for the backend — it stays internal.

---

## 3. DNS + external allowlists

- **DNS:** `A` record `grovyn.in` → `<oracle-public-ip>` (and `www` → same). Wait for propagation before issuing the cert.
- **MongoDB Atlas:** Network Access → add the Oracle box's public IP (or `0.0.0.0/0` if you can't pin it).
- **Upstash:** no IP allowlist needed (token auth), just use the `rediss://` URL.

---

## 4. Deploy

In Dokploy hit **Deploy**. It will: clone (+ submodule) → `docker compose build` (passing the build args) → `up`. Watch the build/runtime logs in the UI.

Verify:

```bash
curl -I https://grovyn.in/en                 # 200 (or 307 → /en) from Next.js
curl -s https://grovyn.in/api/ | head        # {"message":"Server is up and running"} from Express
```

Then create the first admin:

```bash
curl -X POST https://grovyn.in/api/admin/auth/bootstrap \
  -H 'Content-Type: application/json' \
  -d '{"email":"you@grovyn.in","password":"<strong>","setupSecret":"<ADMIN_SETUP_SECRET>"}'
```

…then remove `ADMIN_SETUP_SECRET` from `backend/.env` and redeploy.

Finally, **close the temporary port 3000** ingress rule (panel access can be tunneled via SSH instead).

---

## 5. Updating / redeploying

- **Frontend change:** push to `grovyn-website-2.0` → Dokploy auto-deploys (enable the webhook) or hit Deploy.
- **Backend change:** push to `grovyn-backend`, then in the frontend repo bump the submodule pointer:
  ```bash
  cd backend && git pull origin main && cd ..
  git add backend && git commit -m "bump backend" && git push
  ```
  then redeploy.

---

## 6. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `https://grovyn.in` times out | Oracle firewall — check **both** the VCN Security List *and* `iptables` (§1a). |
| Cert won't issue | DNS not pointing at the box yet, or port 80 closed (Let's Encrypt HTTP-01 needs it). |
| Frontend up but forms fail / "API URL not configured" | `NEXT_PUBLIC_API_URL` wasn't set at **build** time, or isn't `https://…/api`. Rebuild after setting it. |
| `/api/...` returns 404 from Next, not Express | Backend container down or not named `backend`; check `docker compose ps` and backend logs. |
| Admin login sets cookie but next request is 401 | `ADMIN_COOKIE_SECURE=true` requires HTTPS (you have it); confirm you're hitting `https://`, not `http://`. |
| `backend/` empty after clone | Submodules not enabled in Dokploy, or backend not pushed to `grovyn-backend`. |
| bcrypt build fails | Already handled — backend Dockerfile installs `python3 make g++`; ensure base stays `bookworm-slim`, not alpine. |
