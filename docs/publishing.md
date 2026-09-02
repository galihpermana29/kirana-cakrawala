# Publishing

How an edit in the Studio becomes a live page, and how to wire that pipeline up once.

The site is static.
Every page is rendered at build time from the Sanity dataset, so nothing an editor publishes shows up until the site is built again.
Rebuild-on-publish closes that gap:

```
Studio /admin  ->  Publish  ->  Sanity webhook  ->  Cloudflare deploy hook  ->  build  ->  live
                                                                         about two minutes
```

Publishing a document fires a Sanity webhook, which POSTs to a Cloudflare Pages deploy hook, which starts a build, which fetches the dataset again and replaces the live site.
Nobody has to touch the repo, and the editor's side of this is `docs/EDITING.md`.

## Where this stands

Not wired yet.
`npx sanity hooks list` prints nothing for project `ipx0k2h7`, and no Pages project exists.
Work through the four steps below once and delete this section.

The deploy hook URL is the one secret in the chain: anyone who has it can trigger a build.
It lives in the Sanity webhook config and in the Cloudflare dashboard, never in this repo and never in `.env`.

## 1. The Pages project

1. Push this repo to GitHub.
2. In the Cloudflare dashboard, go to **Workers & Pages**, create a Pages project, and connect the repo.
3. Build command `npm run build`, output directory `dist`, production branch `main`.
4. Set three build environment variables, all three of them required:

   | Variable | Value | Why |
   | --- | --- | --- |
   | `PUBLIC_SANITY_PROJECT_ID` | `ipx0k2h7` | Without it `astro.config.mjs` throws and the build stops. |
   | `PUBLIC_SANITY_DATASET` | `production` | Which dataset to render. |
   | `PUBLIC_WEB3FORMS_KEY` | the Web3Forms access key | Without it the contact form renders disabled, with a "not yet connected" notice. |

No token is needed to build: the dataset is readable without one.

## 2. The deploy hook

In the Pages project, go to **Settings** > **Builds** and select **Add deploy hook**.
It asks for two things:

- **Deploy hook name** - `sanity-publish`.
- **Branch to build** - `main`.

Cloudflare then shows the hook URL and a POST snippet.
Copy the URL; it is what step 3 needs.
The hook takes an unauthenticated POST and ignores the request body, which is why the webhook below sends a token-sized one.

## 3. The Sanity webhook

Two ways to create it. They produce the same thing, so use whichever is at hand.

Both need the values in this table.
The API version is pinned to the one the site queries with in `astro.config.mjs`, so the filter is evaluated the way the build reads the data.

| Field | Value |
| --- | --- |
| Name | `Rebuild the site` |
| Description | `Publishing any document rebuilds the static site on Cloudflare Pages.` |
| URL | the deploy hook URL from step 2 |
| Dataset | `production` |
| Trigger on | Create, Update **and** Delete - all three |
| Filter | `!(_type in ["sanity.imageAsset", "sanity.fileAsset"])` |
| Projection | `{"_id": _id, "_type": _type}` |
| HTTP method | `POST` |
| API version | `v2025-06-01` |
| Drafts and versions | off |
| Secret | leave empty |
| Status | Enabled |

The filter is an exclusion rather than a list of the site's eleven document types, so a type added later triggers a rebuild without anyone remembering to come back here.
What it leaves out is the asset documents: uploading a picture writes a `sanity.imageAsset` *and* updates the document that points at it, and only the second of those changes a page.
Against the current dataset the filter selects 29 documents of 43 - every page, setting, pillar, article, partner category and map pin, and none of the 14 image assets.

Drafts stay off because the build asks for the `published` perspective.
An editor typing into a draft must not queue a build; publishing must.

### In the browser

```
npx sanity hooks create
```

That command creates nothing itself - it opens the right page in the manage UI, which for this project is:

```
https://www.sanity.io/organizations/otcmmr2q4/project/ipx0k2h7/api/webhooks/new
```

Fill in the table above and save.

### Or in one command

```
set -a; . ./.env; set +a
curl -X POST "https://$PUBLIC_SANITY_PROJECT_ID.api.sanity.io/v2025-02-19/hooks/projects/$PUBLIC_SANITY_PROJECT_ID" \
  -H "Authorization: Bearer $SANITY_WRITE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "document",
    "name": "Rebuild the site",
    "description": "Publishing any document rebuilds the static site on Cloudflare Pages.",
    "url": "PASTE_THE_DEPLOY_HOOK_URL",
    "dataset": "production",
    "apiVersion": "v2025-06-01",
    "httpMethod": "POST",
    "includeDrafts": false,
    "rule": {
      "on": ["create", "update", "delete"],
      "filter": "!(_type in [\"sanity.imageAsset\", \"sanity.fileAsset\"])",
      "projection": "{\"_id\": _id, \"_type\": _type}"
    }
  }'
```

`SANITY_WRITE_TOKEN` in `.env` has the Developer role, which is enough to create webhooks.

Either way, confirm it landed:

```
npx sanity hooks list
```

## 4. CORS origins

The Studio at `/admin` talks to the dataset from the browser, so every origin it is served from needs to be allowed, with credentials.
`http://localhost:4321` and `http://localhost:3333` are already registered on project `ipx0k2h7`; the deployed origins are not.

```
npx sanity cors add https://<the pages.dev subdomain Cloudflare gave the project> --credentials
npx sanity cors add https://<the custom domain> --credentials
```

Add the `pages.dev` origin even once a custom domain exists, since Cloudflare keeps serving it.
Preview deployments get their own per-branch subdomains, which are not covered by the two above; add `https://<branch>.kirana-cakrawala.pages.dev` only if the Studio needs to work from a preview.

```
npx sanity cors list
```

`--credentials` matters.
Without it the Studio loads and then fails to authenticate, which looks like an empty document list rather than an error.

## Verifying the pipeline end to end

Once steps 1 to 4 are done, prove the whole chain rather than assuming it:

1. Open `/admin`, go to **Site Settings**, and make a trivial visible edit - a trailing full stop on the tagline will do.
2. Press **Publish**.
3. `npx sanity hooks list` names the webhook; `npx sanity hooks logs` should show a delivery within seconds, with a 2xx response from Cloudflare.
4. The Pages project shows a build starting. Wait for it to finish.
5. Load the live site and confirm the edit is there.
6. Undo the edit in the Studio and publish again, then confirm the site returns to what it was after the second build.

If a delivery attempt failed, `npx sanity hooks attempt <id>` prints the request and the response body.

## Troubleshooting

**Published, but nothing happened.**
Check `npx sanity hooks logs` first, because it separates the two halves of the chain.
No delivery means the filter or the trigger events are wrong.
A delivery with a non-2xx response means the deploy hook URL is wrong or has been rotated.

**The build failed.**
That is by design when the dataset cannot be read or a document is missing: `src/lib/sanity.ts` throws rather than rendering a page with a hole in it, and the failed build leaves the previous site live.
The Pages build log names the missing document.

**Several builds queued at once.**
Publishing five documents fires five webhooks.
Cloudflare queues the builds and the last one wins, so the result is correct; it is just slower than one build.
Publishing related documents together does not batch them - a document webhook fires once per document.

**The Studio is blank or shows no documents in production.**
Its origin is missing from CORS, or was added without `--credentials`. See step 4.

## What does not trigger a rebuild

- Saving a draft. Only publishing does.
- Uploading an image on its own, which the filter excludes; the document that references it triggers the build when it is published.
- A change to the code in this repo, which rebuilds through the normal git push to `main` instead.
