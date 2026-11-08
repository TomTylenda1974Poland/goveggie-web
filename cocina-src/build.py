"""Render the two languages to static pages. JavaScript enhances filtering and shopping."""
from html import escape as h
from pathlib import Path
import json
from catalog import ROOT, ingredients, recipes, products, used, copy_art

HOST = 'https://web.goveggie.life'
CUISINE = {'D':('Dominicana','Dominican'),'I':('Italiana','Italian'),'F':('Francesa','French'),'C':('Caribeña','Caribbean'),'A':('Inspiración asiática','Asian-inspired'),'H':('Inspiración india','Indian-inspired'),'M':('Inspiración mexicana','Mexican-inspired')}
MEALS = {'B':('Desayuno','Breakfast'),'L':('Almuerzo','Lunch'),'D':('Cena','Dinner'),'S':('Picadera','Small plates'),'X':('Postre','Dessert')}
COVER_RECIPE = 'arroz-auyama'
FIRST = ('panzanella','clafoutis','mangu-cebolla','risotto-hongos','chinola','rollitos-lechuga','crema-zanahoria','berenjenitas','arroz-auyama')
assert set(products) - used == {'ruda'}, 'Review new or removed catalogue items before publication.'
def path(lang, slug=''):
    return ('/recetas/' if lang=='es' else '/en/recipes/') + (slug+'/' if slug else '')

def dump(data):
    return json.dumps(data, ensure_ascii=False, separators=(',',':')).replace('<','\\u003c')

def picture(slug, size='card', alt=''):
    src = '/assets/cocina/' + slug
    large = size in ('hero', 'detail')
    sizes = '(max-width: 650px) 94vw, 550px' if large else '(max-width: 650px) 46vw, 320px'
    priority = 'fetchpriority="high"' if large else 'loading="lazy"'
    return (f'<img src="{src}-sm.webp" srcset="{src}-sm.webp 420w, {src}.webp 800w" '
            f'sizes="{sizes}" width="800" height="533" alt="{h(alt)}" {priority} decoding="async">')


def load_kitchen_guide():
    guide = {}
    for line in (ROOT / 'cocina-src/kitchen-guide.txt').read_text().splitlines():
        slug, *fields = line.split('|')
        pairs = [field.split('/') for field in fields]
        if slug in guide or any(len(pair) != 2 or not all(pair) for pair in pairs):
            raise ValueError(f'Invalid bilingual cooking guide: {slug}')
        guide[slug] = (pairs[:-1], pairs[-1])
    if guide.keys() != recipes.keys():
        raise ValueError('Every recipe must have a cooking guide.')
    for slug, recipe in recipes.items():
        headings, _ = guide[slug]
        if len(headings) != len(recipe['steps']):
            raise ValueError(f'Check the illustrated steps for {slug}')
        artwork = [slug + '.webp', slug + '-sm.webp']
        artwork.extend(f'pasos/{slug}-{n}.webp' for n in range(1, len(headings) + 1))
        for name in artwork:
            if not (ROOT / 'assets/cocina' / name).is_file():
                raise FileNotFoundError(f'Missing recipe artwork: {name}')
    return guide


def render(lang, guide):
    other='en' if lang=='es' else 'es'
    def t(es,en): return es if lang=='es' else en
    def cuisine(r): return t(*CUISINE[r['cuisine']])
    def base(slug,title,description,body,data):
        htmltitle=h(title+' · Go Veggie Life')
        img='/assets/cocina/'+(slug or COVER_RECIPE)+'.webp'
        return f'''<!doctype html><html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{htmltitle}</title><meta name="description" content="{h(description,quote=True)}"><link rel="canonical" href="{HOST}{path(lang,slug)}">
<link rel="alternate" hreflang="es" href="{HOST}{path('es',slug)}"><link rel="alternate" hreflang="en" href="{HOST}{path('en',slug)}">
<meta property="og:title" content="{htmltitle}"><meta property="og:description" content="{h(description,quote=True)}"><meta property="og:image" content="{HOST}{img}">
<link rel="icon" href="/assets/goveggie-mark-white-v2.svg"><link rel="stylesheet" href="/assets/cocina/book.css?v=platos2">
<script src="/assets/cocina/book.js?v=1" defer></script></head><body>
<a class="skip" href="#main">{t("Ir al contenido","Skip to content")}</a>
<header class="mast"><div class="bar"><a class="brand" href="/?lang={lang}" aria-label="Go Veggie Life"><img src="/assets/goveggie-mark-white-v2.svg" width="34" height="34" alt="">goveggie.life</a>
<nav aria-label="{t("Navegación","Navigation")}"><a href="{path(lang)}">{t("Recetario","Cookbook")}</a>
<a href="{path(lang)}?guardadas=1#buscar" class="saved-nav">{t("Guardadas","Saved")}</a><a id="lang" hreflang="{other}" lang="{other}" href="{path(other,slug)}">{other.upper()}</a></nav></div></header>
<main id="main">{body}</main><footer class="bar"><a href="/?lang={lang}">Go Veggie Life</a><a href="https://catalog.goveggie.life/">{t("Catálogo de productos","Produce catalogue")} ↗</a></footer>
<script type="application/json" id="book-data">{dump(data)}</script></body></html>'''

    def card(r):
        slug=r['slug']; meta=h(cuisine(r))+' · '+str(r['minutes'])+' min'
        return f'''<article class="card" data-slug="{slug}"><a href="{path(lang,slug)}"><div class="card-art">{picture(slug)}</div><div class="card-info"><p class="meta">{meta}</p><h3>{h(r[lang])}</h3><p class="diet">{t('Vegana','Vegan') if r['vegan'] else t('Vegetariana','Vegetarian')}</p></div></a></article>'''

    def select(name,title,all_label,options):
        return f'<label>{title}<select id="{name}" name="{name}"><option value="">{all_label}</option>'+''.join(f'<option value="{k}">{h(v)}</option>' for k,v in options)+'</select></label>'
    cuisine_select=select('cocina',t('Cocina','Cuisine'),t('Todas','All cuisines'),[(k,t(*v)) for k,v in CUISINE.items()])
    meal_select=select('momento',t('Momento del día','Meal'),t('Todos','All meals'),[(k,t(*v)) for k,v in MEALS.items()])
    diet_select=select('dieta',t('Alimentación','Diet'),t('Todas','All diets'),[('vegan',t('Vegana','Vegan')),('vegetarian',t('Vegetariana (incluye veganas)','Vegetarian (includes vegan)')),('ovo',t('Con huevo, lácteos o miel','With eggs, dairy or honey')),('dairyfree',t('Sin ingredientes lácteos','No dairy ingredients'))])
    index_order=[recipes[k] for k in dict.fromkeys([*FIRST,*recipes])]
    idxdata={'items':{},'products':{p:products[p]['name'] for p in sorted(used)},'type':'index'}
    for r in index_order:
        idxdata['items'][r['slug']]={k:r[k] for k in ('products','meals','cuisine','kids','vegan','dairyfree','minutes')}
        idxdata['items'][r['slug']]['names']=' '.join(ingredients[key][lang] for _,_,key in r['lines'])
    select_products=''.join(f'<option value="{p}">{h(products[p]["name"])}</option>' for p in sorted(used,key=lambda s:products[s]['name'].casefold()))
    title=t('El recetario','The cookbook')
    intro=t('Elige un ingrediente y encuentra qué preparar con él.','Pick an ingredient and find something to cook with it.')
    index=f'''<section class="cover"><div><p class="eyebrow">Go Veggie Life</p><h1>{title}</h1><p class="intro">{intro}</p><a class="primary" href="#buscar">{t('Buscar una receta','Find a recipe')} ↓</a></div>
<a class="cover-art" href="{path(lang,COVER_RECIPE)}">{picture(COVER_RECIPE,'hero')}<span>{h(recipes[COVER_RECIPE][lang])} <b aria-hidden="true">↗</b></span></a></section>
<section id="buscar" class="finder"><div class="find-head"><h2>{t('¿Qué tienes en la cocina?','What’s in your kitchen?')}</h2></div>
<form id="filters" role="search"><label class="search">{t('Buscar por ingrediente o plato','Search by ingredient or dish')}<input type="search" id="q" placeholder="{t('Por ejemplo, tomate Barceló o mangú','Try avocado, Barceló or mangú')}" autocomplete="off"></label>
<button id="filter-toggle" class="filter-toggle" type="button" aria-expanded="false" aria-controls="filter-options">{t("Filtros de recetas","Recipe filters")} <span aria-hidden="true">＋</span></button><div id="filter-options"><div class="selects">{cuisine_select}{meal_select}{diet_select}<label>{t('Producto del catálogo','Catalogue product')}<select id="producto"><option value="">{t('Todos los productos','All products')}</option>{select_products}</select></label></div>
<div class="quick"><label><input type="checkbox" id="familia">{t('Para niños','For children')}</label><label><input type="checkbox" id="rapidas">{t('Hasta 30 minutos','30 minutes or less')}</label><label><input type="checkbox" id="guardadas">{t('Mis guardadas','Saved on this device')}</label><button id="clear" type="button" hidden>{t('Quitar filtros','Clear filters')}</button></div></div></form>
<p id="result" role="status">{len(recipes)} {t('recetas','recipes')}</p>
<div class="cards">{''.join(card(r) for r in index_order)}</div><p id="empty" hidden>{t('Prueba con otro ingrediente o quita un filtro.','Try a different ingredient or clear a filter.')}</p><button class="secondary" type="button" id="more" hidden>{t('Ver más recetas','Show more recipes')}</button></section>'''
    def write(slug,page):
        directory=ROOT/path(lang,slug).strip('/')
        directory.mkdir(parents=True,exist_ok=True)
        (directory/'index.html').write_text(page)
    write('',base('',title,intro,index,idxdata))

    for r in recipes.values():
        slug=r['slug']; title=r[lang]
        items=[]; line_data=[]
        for i,(amount,unit,key) in enumerate(r['lines']):
            ing=ingredients[key]
            unit_label='' if unit=='ud' else ' '+unit
            prod_ids=ing['products']
            line_data.append(dict(q=amount,u=unit_label,n=ing[lang],products=prod_ids))
            items.append(f'<li><label><input type="checkbox" data-have="{i}"><span><strong data-qty="{i}">{amount:g}{unit_label}</strong> {h(ing[lang])}<small data-choice="{i}"></small></span></label><img hidden class="chosen-art" data-variant-art="{i}" alt="" width="68" height="68"></li>')
        variants={p:products[p]['name'] for p in r['products']}
        options=''.join(f'<option value="{p}">{h(v)}</option>' for p,v in variants.items())
        tags=' · '.join(t(*MEALS[m]) for m in r['meals'])
        diet=t('Vegana','Vegan') if r['vegan'] else t('Vegetariana','Vegetarian')
        child=t(' · Para niños',' · For children') if r['kids'] else ''
        headings, family_task = guide[slug]
        step_cards = []
        for n, (heading, instruction) in enumerate(zip(headings, r['steps']), 1):
            step_cards.append(
                f'<li><img class="step-image" src="/assets/cocina/pasos/{slug}-{n}.webp" '
                f'width="480" height="320" loading="lazy" decoding="async" alt="">'
                f'<div class="step-copy"><h3><span>{n}.</span> {h(t(*heading))}</h3>'
                f'<p>{h(t(*instruction))}</p></div></li>'
            )
        step_html = ''.join(step_cards)
        family_note = (f'<aside class="family-task"><strong>{t("Para las manos pequeñas", "For little hands")}</strong>'
                       f'<p>{h(t(*family_task))}</p><small>{t("Deja los cuchillos, el fuego y los aparatos eléctricos a una persona adulta.", "Let an adult handle knives, heat and electrical appliances.")}</small></aside>')
        serving_options=''.join(f'<option value="{n}" {"selected" if n==2 else ""}>{n}</option>' for n in (2,4,6,8))
        detail=f'''<a class="back" href="{path(lang)}#buscar">← {t("Todas las recetas","All recipes")}</a><section class="recipe-head"><div><p class="eyebrow">{h(cuisine(r))} · {r["minutes"]} min</p><h1>{h(title)}</h1><p class="intro small">{tags} · {diet}{child}</p>
<button class="secondary fav" type="button" aria-pressed="false">{t("Guardar receta","Save recipe")}</button></div><div class="dish">{picture(slug,'detail',title)}</div></section>
<nav class="recipe-shortcuts" aria-label="{t('Ir a una sección del plato','Jump to a recipe section')}"><a href="#ingredientes">{t('Ingredientes','Ingredients')}</a><a href="#preparacion">{t('Paso a paso','Step by step')} ↓</a></nav>
<div class="method"><section id="ingredientes" class="shopping"><div class="section-title"><h2>{t("Ingredientes","Ingredients")}</h2><label>{t("Porciones","Servings")} <select id="servings">{serving_options}</select></label></div>
<p class="hint">{t("Marca lo que ya tienes. El resto irá a tu lista de compras.","Tick what you already have. The rest goes on your shopping list.")}</p><ul id="ingredients">{''.join(items)}</ul>
<a id="wa" class="primary" target="_blank" rel="noopener noreferrer">{t("Compartir lista por WhatsApp","Share list on WhatsApp")} ↗</a>
<button type="button" class="link-button" id="copy">{t("Copiar lista","Copy list")}</button><p id="feedback" role="status"></p>
<label id="manual-wrap" hidden>{t("Lista para copiar","List to copy")}<textarea id="manual" readonly rows="5"></textarea></label></section>
<section class="steps" id="preparacion"><h2>{t("Preparación paso a paso","Step-by-step method")}</h2><ol role="list">{step_html}</ol>{family_note}<details><summary>{t("Variedades del catálogo para esta receta","Catalogue varieties for this recipe")}</summary>
<label>{t("Estoy cocinando con","I’m cooking with")}<select id="variety"><option value="">{t("Elegir producto","Choose produce")}</option>{options}</select></label><a id="catalog-link" hidden href="https://catalog.goveggie.life/">{t("Ver producto en el catálogo","View catalogue product")} ↗</a></details></section></div>'''
        data={'type':'recipe','slug':slug,'lines':line_data,'products':variants}
        write(slug,base(slug,title,tags+' · '+diet+' · '+str(r['minutes'])+' min',detail,data))

if __name__=='__main__':
    guide = load_kitchen_guide()
    copy_art()
    for locale in ('es','en'):
        render(locale, guide)
