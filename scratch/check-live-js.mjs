const res = await fetch("https://ridewithkeijsi.com/motorra");
const html = await res.text();
const matches = html.matchAll(/src="(\/_next\/static\/[^"]+\.js)"/g);
const scripts = Array.from(matches).map(m => m[1]);
console.log("Total scripts in HTML:", scripts.length);

for (const s of scripts) {
  const r = await fetch("https://ridewithkeijsi.com" + s);
  const text = await r.text();
  if (text.includes("youtube-nocookie")) {
    console.log("FOUND youtube-nocookie in:", s);
  }
  if (text.includes("Po ngarkohet video")) {
    console.log("FOUND OLD 'Po ngarkohet video' in:", s);
  }
}
