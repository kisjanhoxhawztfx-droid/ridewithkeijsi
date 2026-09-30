import json

with open("scratch/ig_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

def find_edges(obj):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k == "edge_owner_to_timeline_media":
                return v
            res = find_edges(v)
            if res:
                return res
    elif isinstance(obj, list):
        for item in obj:
            res = find_edges(item)
            if res:
                return res
    return None

timeline = find_edges(data)
if timeline:
    edges = timeline.get("edges", [])
    page_info = timeline.get("page_info", {})
    print(f"Found {len(edges)} edges in timeline!")
    print("Page info:", page_info)
    for i, e in enumerate(edges):
        node = e.get("node", {})
        sc = node.get("shortcode")
        caption_edges = node.get("edge_media_to_caption", {}).get("edges", [])
        cap = caption_edges[0]["node"]["text"] if caption_edges else ""
        print(f"#{i+1} [{sc}]: {cap[:70]}...")
else:
    print("Timeline edges not directly found, searching for shortcodes...")
    def extract_nodes(obj):
        nodes = []
        if isinstance(obj, dict):
            if "shortcode" in obj:
                nodes.append(obj)
            for k, v in obj.items():
                nodes.extend(extract_nodes(v))
        elif isinstance(obj, list):
            for item in obj:
                nodes.extend(extract_nodes(item))
        return nodes

    nodes = extract_nodes(data)
    print(f"Found {len(nodes)} objects with shortcode!")
    seen = set()
    for n in nodes:
        sc = n.get("shortcode")
        if sc and sc not in seen:
            seen.add(sc)
            cap_edges = n.get("edge_media_to_caption", {}).get("edges", [])
            cap = cap_edges[0]["node"]["text"] if cap_edges else n.get("caption", "")
            if isinstance(cap, dict):
                cap = cap.get("text", "")
            print(f"[{sc}]: {str(cap)[:70]}...")
