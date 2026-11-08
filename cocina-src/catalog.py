"""Build the ingredient index from the active catalogue, keeping retail packs as varieties."""
from pathlib import Path
from urllib.parse import urlparse
import json
import re
import shutil
import os

SRC = Path(__file__).resolve().parent
ROOT = SRC.parent
CAT = Path(os.environ.get('GOVEGGIE_CATALOG_DIR', ROOT.parent / 'Katalog WWW'))
feed_path = re.search(r'/(assets/surtido-[a-f0-9]+\.js)', (CAT / 'index.html').read_text())[1]
feed = (CAT / feed_path).read_text()
groups = json.JSONDecoder().raw_decode(feed[feed.index('{'):])[0]['groups']
by_group = {g['name']: [v['slug'] for v in g['varieties']] for g in groups}
products = {v['slug']: v for g in groups for v in g['varieties']}
media_js = (CAT / 'assets/media-index.js').read_text()
media = json.JSONDecoder().raw_decode(media_js[media_js.index('{'):])[0]
ingredients = {}
for line in (SRC / 'ingredients.txt').read_text().splitlines():
    if not line or line.startswith('#'):
        continue
    key, es, en, ids = line.split('|')
    slugs = by_group[ids[1:]] if ids.startswith('@') else ids.split()
    assert all(slug in products for slug in slugs), (key, slugs)
    ingredients[key] = {'es': es, 'en': en, 'products': slugs}

recipes = {}
for block in (SRC / 'recipes.txt').read_text().strip().split('\n\n'):
    header, quantities, *instructions = block.splitlines()
    slug, es, en, cuisine, meals, minutes, family = header.split('|')
    lines = []
    for item in quantities.split(','):
        quantity, unit, key = item.split()
        assert key in ingredients and unit in ('g','ml','ud') and float(quantity)>0, item
        lines.append((float(quantity),unit,key))
    assert slug not in recipes and len(instructions)>=2
    steps = [s.split('|') for s in instructions]
    assert all(len(pair)==2 and all(pair) for pair in steps)
    keys = {key for _,_,key in lines}
    recipes[slug] = dict(slug=slug, es=es,en=en,cuisine=cuisine,meals=meals,minutes=int(minutes),kids=family=='K',
        vegan=not bool(keys & {'milk','egg','butter','yogurt','honey'}),dairyfree=not bool(keys & {'milk','butter','yogurt'}),
        lines=lines,steps=steps,products=[p for _,_,key in lines for p in ingredients[key]['products']])
used = {p for r in recipes.values() for p in r['products']}
print(len(recipes),'recipes,',len(used),'of',len(products),'catalogue items. Unused:', sorted(products.keys()-used))

def copy_art():
    target = ROOT / 'assets/cocina/productos'
    target.mkdir(exist_ok=True, parents=True)
    for slug in sorted(used):
        path = Path(urlparse(products[slug]['img']).path)
        stem = media[path.name]
        shutil.copyfile(CAT / 'media' / (stem + '-t.webp'), target / (slug + '.webp'))

if __name__ == '__main__':
    copy_art()
