# Editing the website

This is the guide for whoever writes and updates the Kirana Cakrawala site.
It assumes no technical knowledge.
You do not need to install anything, ask a developer, or touch any code: everything on the site is edited from one dashboard in your browser.

**The one thing to know up front:** your changes do not appear on the site the moment you save them.
When you press **Publish**, the site rebuilds itself, which takes about two minutes.
Make your edit, publish, go and get a coffee, then look at the site.

## Getting in

The dashboard lives at **`/admin`** on the site itself.
So if the site is `https://kiranacakrawala.com`, the dashboard is `https://kiranacakrawala.com/admin`.

Sign in with the account you were invited on.
If you have never been invited, ask Galih to add you to the Sanity project - you cannot sign yourself up.

Bookmark the `/admin` address. It is the only one you need.

## What you are looking at

Down the left-hand side is a list headed **Kirana Cakrawala**, in three blocks.

**Site Settings** - the things that appear on every page: the company name, the tagline, the picture behind the dark band at the foot of the inner pages, the menu at the top, and the address, email and phone number.
Change the phone number here and it changes in the footer, on the contact card, and in the link that dials it. There is nowhere else to change it.

**The six pages** - Home, About Us, What We Do, News & Articles, Partners, Contact Us.
One entry each, and they cannot be deleted or duplicated. This is deliberate.

**The four collections** - Pillars, Articles, Partner Categories, Map Pins.
These are lists you can add to and remove from.
Articles are the news items. Pillars are the four things KCA does, each with its own page under What We Do. Partner Categories are the seven groups on the Partners page. Map Pins are the dots on the world map.

## Changing words

1. Click the page or item in the left-hand list.
2. Click into the field and type.
3. Press **Publish**, bottom right.

Sanity saves as you type, but saving is not publishing.
Until you press **Publish** your work is a draft: it is safe, it is yours, and it is not on the site.
An item with unpublished changes is marked in the list, so you can leave something half-written and come back tomorrow.

If you make a mess, the **⋮** menu next to Publish has **Discard changes**, which throws the draft away and puts back whatever is currently live.

Each of the six pages has two tabs at the top:

- **Content** - everything a visitor reads.
- **Page & SEO** - three fields that do not appear on the page itself. **Page name** is what the page is called on the site and in this dashboard. **Browser title** is the tab title and the blue headline in Google results, and it is capped at 70 characters because Google cuts it off. **Search description** is the grey paragraph underneath it in Google.

## Changing a picture

Every picture on the site works the same way.
Drag a new file onto the image box, or click it and choose one.

Two fields sit underneath it:

- **Alt text** - required. Describe what the picture shows, for people using a screen reader and for when the image fails to load. "Technician inspecting a turbine blade", not "our quality". Describe the scene, not the brand. You cannot publish without it.
- **Source** - where the picture came from and under what licence. Fill this in. Only free-licence images may go on this site, and this field is the record of which one it is.

Click the image and choose **Edit details** (or the crop icon) to set the crop and the hotspot.
The hotspot is the part that must stay visible when the picture is squeezed into a narrow shape on a phone. Put it on the subject.

Use pictures with no visible airline or military markings.

## Reordering the bands on a page

Every page is built from horizontal bands stacked top to bottom - a hero, then a block of text, then a grid, and so on.
On the **Content** tab, the **Sections** list is those bands, in the order they appear on the page.

Drag a row by the handle on its left to move it. The site follows the order in this list.

Each row shows two lines.
The bold line is the *kind* of band it is, and it never changes - `Hero`, `Pillars`, `Commitment`, `Closing band`.
The grey line underneath is a piece of your own copy from inside that band, usually its heading, which is how you tell two similar rows apart.
Click a row to open it and see everything in it.

You can reorder freely, but the hero is the top of the page and moving it down will look wrong.

## Switching a band off

Open the band and turn on **Hidden**, at the bottom of its fields.

The band disappears from the site on the next build, and stays here with all its content intact.
Turn it off again whenever you want.
This is how you take something down: never delete it.

A hidden band is easy to spot in the Sections list, because its bold line reads `Commitment - hidden`.

## Adding a news article

Click **Articles** in the left-hand list, then the pencil-and-paper icon at the top to create one.

Fill in:

- **Title** - the headline.
- **Slug** - the end of the web address, `/news/<slug>`. Press **Generate** to make it from the title. Once an article is published, changing this breaks any link anyone has shared, so leave it alone afterwards.
- **Published** - the date. The news listing is ordered by this, newest first, so this is what decides where the article appears rather than when you created it.
- **Category** - **Capability**, **Insight**, or **Company**. Visitors filter the listing by these.
- **Excerpt** - two or three sentences. This is the summary on the article card *and* the standfirst under the headline on the article itself, so it has to read well in both places.
- **Image** - as above, alt text and all.
- **Related pillar** - which of the four pillars the article expands. This is the only optional field on the form: company news has no pillar, and leaving it empty is the right answer for a company announcement. When you do set it, that pillar's closing band ends the article.
- **Body** - the article itself.

The **Body** editor is deliberately narrow, so articles cannot drift apart in style.
You get paragraphs and one level of heading (the style dropdown says **Paragraph** and **Heading**), bullet points, **bold**, *italic*, and links.
There are no other heading levels, no numbered lists, and no font or colour controls. That is intended.

For a link, select the words first, then click the link button and paste the destination.
It accepts an address on this site (`/what-we-do/mro`), a full web address, an email (`mailto:`) or a phone number (`tel:`).

For a pull quote, put the cursor where you want it and press the **Pull quote** button in the editor's toolbar, over on the right with the other insert buttons.
It has the **Quote** itself and an optional **Source** line, for attributing it to something like "Mission 06 - Quality, Safety & Governance".

Press **Publish** when you are done.
The article appears in the news listing, on the homepage teaser if it is one of the newest, and links itself to the next and previous articles automatically.

To take an article down, open the **⋮** menu and choose **Unpublish**. Deleting it is rarely what you want.

## Publishing, and when it goes live

**Publish** is bottom right, and it is greyed out when there is nothing new to publish.

After you press it:

- Your change is saved to the content store immediately.
- The site starts rebuilding itself.
- **About two minutes later** the new version is live.

Nothing on the live site changes in between. Visitors keep seeing the old version until the new one is completely ready, so a half-finished build never reaches anyone.

There is no preview in this dashboard.
The way to check your work is to publish it and then look at the real site.
This is why **Hidden** and **Discard changes** are worth knowing: they are how you undo something without a preview.

If more than about five minutes pass and nothing has changed, something in the pipeline is broken rather than slow. Tell Galih, and point them at `docs/publishing.md`.

## Things worth knowing

**You cannot break the site by editing it.** If a required field is empty or a picture is missing its alt text, the build stops and the current site stays up. You get an out-of-date site, never a broken one.

**Some sentences are stored in two places on purpose.** The seven mission points appear both on the About page and on the page that expands each one. The field description tells you when this is the case. Change both together, or they will disagree.

**Some wording is not editable here.** Small interface labels - "min read", "Filter", "Copy link", "Newer", "Older" - live in the code. Every button that makes an argument, like the ones in the hero and the closing bands, is editable. If you need one of the small ones changed, ask.

**Red text means required.** A field outlined in red is empty and must be filled before Publish will work. The message names what is wrong.

**Site Settings and the six pages cannot be deleted.** There is no Delete on them, on purpose. The site expects exactly one of each.

## If you get stuck

- The field descriptions in grey under each label are the first place to look. They were written for this site, not by Sanity.
- `docs/positioning.md` in the repo is the source of truth for the vision, the mission and the positioning lines. Copy those verbatim rather than rewriting them.
- Anything about the site not updating: `docs/publishing.md`.
