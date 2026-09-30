with open("scratch/ig_data.json", "r", encoding="utf-8") as f:
    text = f.read()

import re
print("Length of file:", len(text))
sc_matches = re.findall(r'"code":"([A-Za-z0-9_-]+)"', text)
print("Code matches:", len(sc_matches), sc_matches)
caption_matches = re.findall(r'"text":"([^"]{20,100})"', text)
print("Text matches:", len(caption_matches))
for tm in caption_matches[:10]:
    print(" -", tm[:80])
