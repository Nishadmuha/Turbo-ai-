# Turbo AI blog CMS

The CMS manages **blog posts only**. The SEO team can edit article text, excerpts, authors, categories, tags, featured images, search metadata, social previews, canonical URLs, indexing, and draft/published status. The main website, services, industries, solutions, and product pages are authored in the website project and render independently of the CMS API.

The admin navigation contains Dashboard, Blog Posts, Media, and, for administrators, Settings and Team. Former page/product/industry/solution editor URLs no longer open editors. Existing non-blog database records are retained; they are not used as website content or exposed through the MongoDB blog entry endpoints.

## Start locally

1. Configure the ignored `.env.local` file using `.env.example` as a guide:
   - `VITE_CMS_PROVIDER=mongodb`
   - `VITE_CMS_ENABLED=true` to use published CMS blog posts
   - `VITE_CMS_API_URL=/api/cms`
   - `MONGODB_URI` set to your MongoDB or Atlas connection string
   - `MONGODB_DB=turbo_ai_cms`
2. Run `npm run cms:create-admin` once to create your first administrator. Enter an email and a unique 12–128 character password at the hidden prompt. There is no default password or public registration. This command does not overwrite existing accounts.
3. Run `npm run cms:seed:mongo` to import missing authored blog posts. Existing blog edits and other records are preserved. The command uses the database configured in `.env.local`, including Atlas when configured.
4. Run `npm run dev`. It starts the website and MongoDB blog API together. Open `http://localhost:5173/admin/login` and sign in.

Vite proxies `/api/cms` to the API at `127.0.0.1:4100`. Keep the development command running while editing blog posts. `npm run dev:site` starts only Vite if you are working on the authored website without the CMS. `npm run cms:server` starts the API separately when needed. `npm run preview` uses the same API proxy on port 4173; start the API separately when previewing a build.

The MongoDB connection string stays in the Node server. Never put it in a `VITE_` variable, frontend source, or Git. Optional `CMS_ADMIN_EMAIL` and `CMS_ADMIN_PASSWORD` variables are available for scripted account creation; remove them after use.

## Blog publishing

1. Open **Blog Posts**, create a post or edit an existing one, and enter its title, slug, excerpt, Markdown article, featured image, and article details.
2. Use **Media** to upload an image, then select it in the post editor. Uploads accept PNG, JPEG, WebP, AVIF, and GIF, up to 4 MB. Add descriptive alt text when uploading.
3. Review the Markdown preview and **Search & social** fields. Leaving the SEO title or description blank uses the post title or excerpt. Raw HTML in Markdown is not rendered.
4. Save as **Draft** while preparing the post. Choose **Published** and **Save & publish** when ready. Only published posts are available through the public blog API; the editor preview is not a public draft URL.
5. Refresh the static build after publishing, unpublishing, deleting, changing a slug, or updating SEO. Administrators can use **Settings → Refresh blog search pages** when `CMS_ALLOW_LOCAL_BUILD=true` is set on the server. Otherwise, run `npm run build` locally.

Publishing changes the blog API immediately; the browser may retain content for up to 30 seconds. Previously generated or deployed static HTML keeps its last built content until a new build replaces it. An unpublished post's old deployed HTML also requires a fresh deployment to remove it. A slug change does not create an automatic redirect; coordinate an HTTP redirect in the hosting configuration for public URLs that change.

The refresh action runs the fixed website build command. It rebuilds authored website pages alongside published blog pages and the sitemap; it does not make the rest of the site CMS-editable. Only one CMS-triggered build runs at a time. The admin displays progress and completion without exposing server logs or environment values. Avoid running a separate build at the same time. With CMS blog mode enabled, a blog API failure stops the build rather than generating an incomplete blog snapshot.

Saving posts and refreshing the local build do not commit, push, or deploy anything. Deployment is a separate technical workflow.

## Team and media

Editors can create, edit, and publish blog posts, update blog SEO, and upload images. Administrators also control deletion, team access, and build refresh. Use **Team** to create an editor or administrator account and to disable access. Share new account credentials securely.

Uploaded media is public at `/api/cms/media/files` and stored with its metadata in MongoDB's `cms_media` collection. Images and sessions survive function restarts and redeployments. The local server can still serve older files in ignored `.cms-data/uploads`; those older disk files must be uploaded again through Media before moving hosts. MongoDB also stores entries in `cms_entries`, accounts in `cms_users`, sessions in `cms_sessions`, and login attempt limits in `cms_rate_limits`. Back up the database. Global website title and Open Graph defaults are not editable through this blog workspace.

## Hosting and troubleshooting

### Vercel deployment

The repository deploys `api/cms.mjs` as a Vercel Node function alongside the Vite website. `vercel.json` routes `/api/cms/*` to that function and `/admin` plus nested admin paths to the application. Newly published blog slugs also open before the next static build. Existing prerendered pages keep their static SEO content.

In **Vercel → the project serving your domain → Settings → Environment Variables**, add these values for **Production** (and only for Preview when that environment should use the database):

| Variable | Value |
| --- | --- |
| `MONGODB_URI` | Your existing MongoDB Atlas connection string, stored as a sensitive server variable |
| `MONGODB_DB` | `turbo_ai_cms` |
| `VITE_CMS_ENABLED` | `true` (optional when `MONGODB_URI` is configured; remove an old `false` value) |

Use the existing database to retain existing accounts and posts; do not recreate or reseed it. Never prefix the connection string with `VITE_`, commit it, or put it in frontend source. `.env.local` is deliberately not pushed to GitHub, so its values do not automatically reach Vercel. If both GitHub repositories have separate Vercel projects, configure the intended production project in each account separately.

No separate API URL is required: the browser uses `/api/cms` on the same HTTPS domain. MongoDB is the default provider; remove an old `VITE_CMS_PROVIDER=supabase` override if present. The API automatically permits `https://turbo-ai.ca`, `https://www.turbo-ai.ca`, and its Vercel production/deployment URL. Optional `CMS_ORIGINS` accepts additional exact HTTPS origins. Do **not** copy the local `localhost` origins into production.

Allow the hosting environment to reach Atlas using your Atlas Network Access configuration. Keep the database username/password valid. Vercel's `NODEJS_HELPERS=0` setting is supplied by `vercel.json` so Express can parse JSON and file uploads. Local build subprocesses are disabled in the deployed function.

After setting the variables, **redeploy** the latest commit. The build reads only published blog posts directly from MongoDB; it does not need a local server on port 4100 and it does not change database content. A configured but unavailable database fails the build with a sanitized error rather than publishing an incomplete blog. Builds without CMS configuration still work for source checks/static previews, and the admin API reports the missing production configuration clearly.

Verify `https://turbo-ai.ca/api/cms/health` returns JSON with `ok: true`, then open `https://turbo-ai.ca/admin` and use the existing CMS account. Run `npm run test:deployment -- https://turbo-ai.ca` to check live routes, API connectivity, authentication protection, and public blog responses without changing content.

Publishing changes the live blog API immediately. Redeploy in Vercel after publishing, unpublishing, deleting, changing a slug, or changing SEO to refresh static HTML and the sitemap. The CMS Settings page explains this requirement. The local refresh button cannot deploy Vercel.

Both repositories use Vercel's connected Git deployment. The optional GitHub Actions CLI deploy job runs only if the repository variable `VERCEL_CLI_DEPLOY=true` is explicitly enabled and the Vercel token/project/organization secrets are configured; it is not needed for Git integration deployments.

When an administrator already maintains `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` as GitHub Actions secrets, the manual **Configure production CMS** workflow can inspect the hosting setup. Its `apply` mode requires `MONGODB_URI` as an encrypted Actions secret when production has no database connection. It verifies the `turbo-ai.ca` domain and linked repository, preserves existing database credentials, applies only production CMS settings, and requests a deployment of the selected main-branch commit. It never prints connection strings or tokens.

### Other hosting

A live MongoDB blog CMS requires a Node server or a reverse proxy routing `/api/cms` to the backend on the same origin as the website. Copying `dist` to a static host alone cannot connect to MongoDB. Netlify's existing static configuration does not deploy this Vercel function; use a separate Node backend or implement a host-specific function adapter. For a standalone Node deployment, configure `NODE_ENV=production`, HTTPS, and exact allowed origins in `CMS_ORIGINS`. If changing the API port, update the Vite proxy target as well.

Session cookies are HttpOnly and SameSite=Strict, and Secure in production. Write requests require an allowed Origin and the CMS request header. Passwords are salted and hashed with scrypt. Database sessions store token hashes and expire after eight hours. The API validates entries and image signatures and limits login attempts.

If the editor says it cannot connect, check that `npm run dev` is still running and that the backend can reach MongoDB. The API checks database connectivity before listening. The main authored website and product pages continue to work without the blog API. Blog pages show a scoped error with a retry action instead of reverting to authored articles that may have been unpublished. Set `VITE_CMS_ENABLED=false` and restart/rebuild to deliberately use the authored blog content instead of CMS posts.

## Verification

- `npx tsc -b --pretty false` and `npm run lint` check the source.
- `npm run test:cms-mongo` tests the API using a disposable local database at `127.0.0.1:27017`; it does not use the configured Atlas URI. It checks blog publishing, authentication, roles, input validation, media, and rejection of non-blog entry operations.
- `npm run test:cms-browser` exercises the blog publishing workflow in the browser.
- `npm run test:cms-build` tests the controlled build action.
- `npm run test:cms-deployment` tests production configuration, published-only build snapshots, cold starts, persistent images/sessions, and secure API routing using disposable local databases.
- `npm run build` refreshes the static site and blog metadata. `npm run test:smoke` checks the resulting site.

## Optional legacy Supabase provider

The Supabase adapter remains available when `VITE_CMS_PROVIDER=supabase` is selected, with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. The admin UI and public CMS integration remain scoped to blog posts. MongoDB-only Team and build controls are not shown.

For a new Supabase project, review and apply `supabase/migrations/202609290001_cms.sql`, create an Auth user, and add their UUID to `public.cms_admins`. Database RLS policies are controlled by that migration and your project's configuration; this UI restriction is not a replacement for reviewing those policies. Privileged import credentials belong only in the local `CMS_SUPABASE_URL` and `CMS_SUPABASE_SECRET_KEY` variables, never frontend configuration. The main website continues to use its authored content with either provider.
