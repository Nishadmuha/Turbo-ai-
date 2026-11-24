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
2. Use **Media** to upload an image, then select it in the post editor. Uploads accept PNG, JPEG, WebP, AVIF, and GIF, up to 8 MB. Add descriptive alt text when uploading.
3. Review the Markdown preview and **Search & social** fields. Leaving the SEO title or description blank uses the post title or excerpt. Raw HTML in Markdown is not rendered.
4. Save as **Draft** while preparing the post. Choose **Published** and **Save & publish** when ready. Only published posts are available through the public blog API; the editor preview is not a public draft URL.
5. Refresh the static build after publishing, unpublishing, deleting, changing a slug, or updating SEO. Administrators can use **Settings → Refresh blog search pages** when `CMS_ALLOW_LOCAL_BUILD=true` is set on the server. Otherwise, run `npm run build` locally.

Publishing changes the blog API immediately; the browser may retain content for up to 30 seconds. Previously generated or deployed static HTML keeps its last built content until a new build replaces it. An unpublished post's old deployed HTML also requires a fresh deployment to remove it. A slug change does not create an automatic redirect; coordinate an HTTP redirect in the hosting configuration for public URLs that change.

The refresh action runs the fixed website build command. It rebuilds authored website pages alongside published blog pages and the sitemap; it does not make the rest of the site CMS-editable. Only one CMS-triggered build runs at a time. The admin displays progress and completion without exposing server logs or environment values. Avoid running a separate build at the same time. With CMS blog mode enabled, a blog API failure stops the build rather than generating an incomplete blog snapshot.

Saving posts and refreshing the local build do not commit, push, or deploy anything. Deployment is a separate technical workflow.

## Team and media

Editors can create, edit, and publish blog posts, update blog SEO, and upload images. Administrators also control deletion, team access, and build refresh. Use **Team** to create an editor or administrator account and to disable access. Share new account credentials securely.

Uploaded media is public at `/api/cms/media/files` and stored in ignored `.cms-data/uploads`. Back up that directory alongside MongoDB and use durable storage in production. MongoDB stores entries in `cms_entries`, accounts in `cms_users`, sessions in `cms_sessions`, image metadata in `cms_media`, and existing settings in `cms_settings`. Global website title and Open Graph defaults are not editable through this blog workspace.

## Hosting and troubleshooting

A live MongoDB blog CMS requires a Node server or a reverse proxy routing `/api/cms` to the backend on the same origin as the website. A static host alone cannot connect to MongoDB. Configure `NODE_ENV=production`, HTTPS, and exact allowed origins in `CMS_ORIGINS`. If changing the API port, update the Vite proxy target as well. Configure MongoDB network access and credentials for the application server.

Session cookies are HttpOnly and SameSite=Strict, and Secure in production. Write requests require an allowed Origin and the CMS request header. Passwords are salted and hashed with scrypt. Database sessions store token hashes and expire after eight hours. The API validates entries and image signatures and limits login attempts.

If the editor says it cannot connect, check that `npm run dev` is still running and that the backend can reach MongoDB. The API checks database connectivity before listening. The main authored website and product pages continue to work without the blog API. Blog pages show a scoped error with a retry action instead of reverting to authored articles that may have been unpublished. Set `VITE_CMS_ENABLED=false` and restart/rebuild to deliberately use the authored blog content instead of CMS posts.

## Verification

- `npx tsc -b --pretty false` and `npm run lint` check the source.
- `npm run test:cms-mongo` tests the API using a disposable local database at `127.0.0.1:27017`; it does not use the configured Atlas URI. It checks blog publishing, authentication, roles, input validation, media, and rejection of non-blog entry operations.
- `npm run test:cms-browser` exercises the blog publishing workflow in the browser.
- `npm run test:cms-build` tests the controlled build action.
- `npm run build` refreshes the static site and blog metadata. `npm run test:smoke` checks the resulting site.

## Optional legacy Supabase provider

The Supabase adapter remains available when `VITE_CMS_PROVIDER=supabase` is selected, with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. The admin UI and public CMS integration remain scoped to blog posts. MongoDB-only Team and build controls are not shown.

For a new Supabase project, review and apply `supabase/migrations/202609290001_cms.sql`, create an Auth user, and add their UUID to `public.cms_admins`. Database RLS policies are controlled by that migration and your project's configuration; this UI restriction is not a replacement for reviewing those policies. Privileged import credentials belong only in the local `CMS_SUPABASE_URL` and `CMS_SUPABASE_SECRET_KEY` variables, never frontend configuration. The main website continues to use its authored content with either provider.
