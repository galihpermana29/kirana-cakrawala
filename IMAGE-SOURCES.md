# Placeholder image sources

Every placeholder image in `public/images/`, its origin, and its license.
All are draft placeholders to be replaced with licensed or client photography before launch.
Update this file whenever an image is added, replaced, or removed.

| File | Source | License |
| --- | --- | --- |
| `pillar-parts.jpg` | [Wikimedia Commons - Inlet of jet engine](https://commons.wikimedia.org/wiki/File:Inlet_of_jet_engine.jpg) | CC BY 2.0 (attribution required if kept for launch) |
| `pillar-mro.jpg` | [Unsplash - Turbofan engine on a stand in a hangar, by Kaspars Eglitis](https://unsplash.com/photos/fkcjWXPRAZU) | Unsplash License (free; attribution appreciated, not required) |
| `pillar-technical.jpg` | [Unsplash - Technician inspecting the underside of an airliner wing, by Pandu Agus Wismoyo](https://unsplash.com/photos/7OgQ-Ze7BXQ) | Unsplash License (free; attribution appreciated, not required) |
| `pillar-network.jpg` | [Unsplash - Open cargo hold of a freighter with netted pallets, by Sevcan Alkan](https://unsplash.com/photos/D1H7jEwlWMU) | Unsplash License (free; attribution appreciated, not required) |
| `hero-aircraft.jpg` | [Wikimedia Commons - In For Landing (airliner silhouette)](https://commons.wikimedia.org/wiki/File:In_For_Landing_(191942727).jpeg) | CC BY 3.0 (attribution required if kept for launch; no visible livery) |
| `commitment-wing.jpg` | [Wikimedia Commons - Evening light at 25,000 ft (M McBey)](https://commons.wikimedia.org/wiki/File:Evening_light_at_25,000_ft_(Explored)_-_Flickr_-_M_McBey.jpg) | CC BY 2.0 (attribution required if kept for launch) |
| `news-hero.jpg` | [Unsplash - Widebody turbofan under a wing inside a maintenance hangar, by 鱼 鱼](https://unsplash.com/photos/ERed5HLKSYA) | Unsplash License (free; attribution appreciated, not required) |
| `news-aog-response.jpg` | [Unsplash - Engine nacelle and landing gear on a night ramp, by Jacob Hamm](https://unsplash.com/photos/5l3tj1LMBB8) | Unsplash License (free; attribution appreciated, not required) |
| `news-aftermarket-ecosystem.jpg` | [Unsplash - Apron at sunset with silhouetted airliners, by Yeray Sánchez](https://unsplash.com/photos/ZKEjw7oLmQQ) | Unsplash License (free; attribution appreciated, not required) |
| `news-quality-governance.jpg` | [Unsplash - Airliner glass cockpit at dusk, by Andrés Dallimonti](https://unsplash.com/photos/kjqTlMHLci4) | Unsplash License (free; attribution appreciated, not required) |
| `news-introducing-kca.jpg` | [Unsplash - Airliner silhouetted against the sun after takeoff, by Sean Davis](https://unsplash.com/photos/8FwJg9--peo) | Unsplash License (free; attribution appreciated, not required) |
| `about-hero.jpg` | [Unsplash - Rear view of a widebody airliner in a maintenance dock, by mos design](https://unsplash.com/photos/HjuC8iFy7O8) | Unsplash License (free; attribution appreciated, not required) |
| `contact-hero.jpg` | [Unsplash - Silhouetted person crossing a small-airport apron at dusk toward the tower, business jet parked against the sunset, by Kristina Delp](https://unsplash.com/photos/EZDUCs-yLWU) | Unsplash License (free; attribution appreciated, not required) |

The hero background is a generated canvas gradient, not an image.
The dotted world map is generated at build time by the `dotted-map` package - 60 dot rows on the homepage, 80 on the larger `/partners` map, whose HQ-to-region arcs are drawn from the same map coordinates.
The ecosystem marquee shows partner-category wordmarks, not company logos - real logos require each partner's brand assets and permission.
Removed 2026-08-27: the four military `domain-*.jpg` images from the KCN-derived draft (content pivoted to aviation aftermarket per `docs/positioning.md`).
Replaced 2026-08-28: `pillar-mro.jpg`, `pillar-technical.jpg`, and `pillar-network.jpg` swapped from U.S. military / DVIDS photos to civil-aviation, brand-free Unsplash images - the pillar pages (`/what-we-do/*`) promote them to full-bleed heroes, and the site must carry no military imagery or airline branding.
`hero-aircraft.jpg` is also used as the `/what-we-do` hub hero.
Added 2026-08-28: the five `news-*.jpg` images for `/news` (listing hero plus four article pictures), all civil-aviation Unsplash photos checked for airline branding before adoption.
The Component MRO and Technical Services articles reuse `pillar-mro.jpg` and `pillar-technical.jpg` rather than shipping duplicates of the same photos.
`news-aftermarket-ecosystem.jpg` is also the `/partners` hero (added 2026-08-28): silhouetted, brand-free airliners sharing one apron is the ecosystem picture, and the page's other imagery is the four pillar photos in its cross-link grid.
`contact-hero.jpg` is the `/contact` hero (added 2026-08-28): a civil general-aviation field, the aircraft a backlit silhouette with no readable registration or livery; the only marking in frame is a small national flag on the tower building, which sits under the hero's navy tint. The page's map is a keyless Google Maps embed of the printed address, not an image.
`about-hero.jpg` is the `/about` hero (added 2026-08-28): a widebody parked in a civil maintenance dock, tail edge-on so no livery shows; the shelving carries only generic size and dock labels. One parts cart at left-middle carried a small airline placard (illegible at the delivered 1800px, readable only in the 6000px original), which was blurred out of the delivered file so the frame carries no airline mark at any zoom. The page's vision band reuses `news-introducing-kca.jpg` (the airliner climbing into the sun) rather than shipping a duplicate.
