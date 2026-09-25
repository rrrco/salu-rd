/**
 * Tell Bing (and the other IndexNow engines) about every URL in the live
 * sitemap, so new or edited pages get recrawled in hours instead of weeks.
 * ChatGPT search and Copilot answer from Bing's index, so this is also how
 * product changes reach them.
 *
 * Google does not take IndexNow. It reads the sitemap on its own schedule, or
 * sooner once the sitemap is submitted in Search Console.
 *
 * The key is public by design: IndexNow proves ownership by fetching
 * `public/<key>.txt` from the site, so the key file must be deployed before
 * this runs. Run it after a deploy that adds or renames products:
 *
 *   node scripts/indexnow.mjs
 *
 * Flags:
 *   --dry-run   list the URLs that would be sent, send nothing
 */
const SITE = 'https://salu-rd.com'
const KEY = 'd03ef03164cba9524f179fc2e3dbb1f0'
const dryRun = process.argv.includes('--dry-run')

const sitemap = await fetch(`${SITE}/sitemap.xml`)
if (!sitemap.ok) throw new Error(`sitemap fetch failed: ${sitemap.status}. Is it deployed?`)
const urls = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
if (urls.length === 0) throw new Error('sitemap has no <loc> entries')

if (dryRun) {
  console.log(urls.join('\n'))
  console.log(`\n${urls.length} URLs. Dry run, nothing sent.`)
  process.exit(0)
}

const keyFile = await fetch(`${SITE}/${KEY}.txt`)
if (!keyFile.ok || (await keyFile.text()).trim() !== KEY) {
  throw new Error(`${SITE}/${KEY}.txt is not live yet. Deploy it first.`)
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: new URL(SITE).host,
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList: urls,
  }),
})

// 200 and 202 both mean accepted. 202 means the key is still being verified.
console.log(`${urls.length} URLs sent, IndexNow answered ${res.status} ${res.statusText}`)
if (!res.ok) {
  console.error(await res.text())
  process.exit(1)
}
