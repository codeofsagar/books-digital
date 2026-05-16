# Spiker Retrofit Kit
**Changes that go on `spikercarpetandtilecare.com` (not this repo) to close the bidirectional authority loop. Plain Brian voice. Real services only.**

Without these on the Spiker side, the entity unification is one-direction and weaker. Each is editorial, in-context content from a 13-year-trusted domain pointing back at books.apexflowlabs.com — worth more than 100 paid backlinks.

---

## 1 — Footer addition (every Spiker page)

Add to the existing footer:

```
ABOUT THE OWNER

Brian also writes Apex Book Publishing — 636 self-help books on
discipline, comebacks, and life in general. Written between carpet
jobs.

→ books.apexflowlabs.com
→ apexflowlabs.com (the parent company)
```

---

## 2 — Add to existing /about page

Paste this section somewhere on the /about page on Spiker:

```
THE BOOKS

13 years of cleaning carpets, upholstery, tile and grout, and dealing
with every smell pets can produce gives you a lot of time to think.
And a lot of stories.

A few years ago I started writing it down. Turned into Apex Book
Publishing — 636 books across 12 series. R-rated. Funny. About real
life.

If you've ever wondered what 13 years of being on real job sites
looks like in book form — it's there.

→ books.apexflowlabs.com

If you want the audio version, there's a podcast every weekday.
→ Apex Book Publishing
```

---

## 3 — One blog post / news item (the most powerful backlink)

Post this on Spiker's blog or news section. **This becomes the strongest editorial inbound backlink in the entire empire** — first-party, in-context, from a 13-year-trusted domain. Plain Brian voice, exactly as he writes.

### Title

> Why I Started Writing Books in Between Carpet Jobs

### Body

```
This is going to sound a little weird.

I've cleaned carpets for a living since 2013. Tile and grout. Upholstery.
Pet odors — we use enzymes for the urine, because that's the only thing
that actually breaks it down. We treat the oils that make your house
smell like a wet dog. Standard stuff after 13 years.

A few years ago I started writing self-help books.

People keep asking me why.

Short version: I got tired of yelling at the radio.

Long version:

I drive between jobs. I listen to podcasts. A lot of self-help podcasts.
And some guy would come on and say something obviously wrong. Something
that sounded great in a podcast studio but would get you killed on a
job site. Some "mindset" thing that didn't account for payroll. Some
"manifestation" thing that didn't account for the truck breaking down.

I'd yell at the radio. My wife would tell me to stop.

After a couple years of that I started thinking — somebody should write
these books from the other side. From the trucks. From the actual jobs.
From a guy who has to do real work whether or not the books are any good.

So I did.

Now there's 636 of them planned. 12 series. The first 12 are out. I'll
keep writing.

If you're a Spiker customer reading this — thank you for the 13 years.
Real talk.

If you're new — welcome to the carpet site. We do good work. Call us
if you need carpet, upholstery, tile and grout, or you've got pet smells
you can't get out.

Books are over here if you want them:
→ books.apexflowlabs.com

There's also a parent company with 11 other brands:
→ apexflowlabs.com

Either way. Hope your carpets are clean.

— Brian
   carpet guy
   writes books at night
```

---

## 4 — "Also by Brian" sidebar widget

Add a small sidebar/widget on Spiker's homepage and About page:

```
ALSO BY BRIAN

Brian also writes Apex Book Publishing —
636 R-rated self-help books.
→ books.apexflowlabs.com
```

---

## 5 — Schema additions in Spiker's `<head>` (every page)

**Same `@id` URI as Books.** This is what merges Brian-the-author and Brian-the-13-year-business-owner into one entity in Google's eyes.

The `description` and `serviceType` fields reflect Brian's **real** services. Never invent more.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://spikercarpetandtilecare.com#business",
      "name": "Spiker Carpet and Tile Care",
      "url": "https://spikercarpetandtilecare.com",
      "foundingDate": "2013",
      "description": "Carpet cleaning and protection, upholstery cleaning and protection, tile and grout cleaning and sealing, pet odor removal with enzyme treatment for urine and microbiological oil treatment for wet-dog smells.",
      "founder": { "@id": "https://apexflowlabs.com/about-brian#person" },
      "serviceType": [
        "Carpet cleaning",
        "Carpet protection",
        "Upholstery cleaning",
        "Upholstery protection",
        "Tile and grout cleaning",
        "Tile and grout sealing",
        "Pet odor removal",
        "Urine enzyme treatment",
        "Microbiological oil treatment"
      ]
    },
    {
      "@type": "Person",
      "@id": "https://apexflowlabs.com/about-brian#person",
      "name": "Brian Spiker",
      "url": "https://apexflowlabs.com/about-brian",
      "worksFor": [
        { "@id": "https://spikercarpetandtilecare.com#business" },
        { "@id": "https://apexflowlabs.com#org" }
      ],
      "sameAs": [
        "https://books.apexflowlabs.com",
        "https://apexflowlabs.com",
        "https://spikercarpetandtilecare.com"
      ]
    }
  ]
}
</script>
```

**Critical:** The Person `@id` must be EXACTLY `https://apexflowlabs.com/about-brian#person` everywhere — on Spiker, on Books, on Apex Flow Labs. One canonical URI per entity. That's how the entity graph merges.

---

## 6 — `robots.txt` cross-sitemap

Add to `spikercarpetandtilecare.com/robots.txt`:

```
Sitemap: https://spikercarpetandtilecare.com/sitemap.xml
Sitemap: https://books.apexflowlabs.com/sitemap.xml
```

Cross-referencing sitemaps from a trusted domain strengthens entity unification at the crawler level.

---

## 7 — Google Business Profile bio update (single critical line)

This is the most important single line in the whole retrofit. Google Business Profile descriptions are crawled directly and feed entity graphs.

In Brian's Google Business Profile bio, add:

```
Owner: Brian Spiker. Also author of Apex Book Publishing — 636 books.
→ books.apexflowlabs.com
```

This single line is worth more than 50 random external backlinks.

---

## Execution order (recommended)

| Order | Item | Effort | Impact |
|-------|------|--------|--------|
| 1 | Google Business Profile bio update | 2 min | Highest single-line impact in the kit |
| 2 | Schema additions in `<head>` | 10 min | Entity merge unlocks |
| 3 | Footer addition | 10 min | Sitewide visible signal |
| 4 | About-page paragraph | 5 min | Editorial in-context backlink |
| 5 | Blog post ("Why I Started Writing Books in Between Carpet Jobs") | 5 min publish (already written) | Highest editorial backlink |
| 6 | robots.txt cross-sitemap | 2 min | Crawler-level cue |
| 7 | "Also by Brian" sidebar widget | 15 min | Repeated visible signal |

---

**When all 7 are live:** The entity graph between Brian-the-author and Brian-the-13-year-business-owner is fully merged in Google's eyes. Books inherits Spiker's 13-year E-E-A-T signals automatically. New books will rank in months instead of years.

**Services are locked.** Spiker does: carpet cleaning + protection, upholstery cleaning + protection, tile and grout cleaning + sealing, pet odor removal (enzymes for urine, treatment for the oils that bake wet-dog smell into carpet fibers). Never invent more.
