"""
LearnPath HTML -> React JSX converter
=======================================
Mirrors the approach from the reference conversion guide: keep the
existing working JavaScript logic intact, convert only the
presentation/markup layer into real JSX React components.

For each page this script:
  1. Extracts any page-specific <style> block from <head> -> written
     out as its own component-level <style> tag (kept, not deleted).
  2. Extracts the page's own inline <script>...</script> logic (the
     business logic — DB rendering, form handlers, routing, etc.)
     into public/legacy/js/<page>.js, UNCHANGED.
  3. Converts the remaining <body> markup into JSX (class->className,
     style string->object, void tags, onclick="fn()" -> onClick,
     comments, etc.)
  4. Writes a .jsx page component that renders the converted markup,
     then loads store.js -> app.js -> the page's own extracted script
     in that order via <LegacyScript>, exactly matching the original
     <script src> order in the source HTML.
"""

from pathlib import Path
from bs4 import BeautifulSoup, NavigableString, Comment
import re
import json

SRC = Path("/home/claude/work/package/frontend/html")
OUT_PAGES = Path("/home/claude/work/react/react-frontend/src/pages")
OUT_LEGACY = Path("/home/claude/work/react/react-frontend/public/legacy/js")

OUT_PAGES.mkdir(parents=True, exist_ok=True)
OUT_LEGACY.mkdir(parents=True, exist_ok=True)

PAGE_NAMES = {
    "index.html": "Home",
    "auth.html": "Auth",
    "dashboard.html": "Dashboard",
    "courses.html": "Courses",
    "learning.html": "Learning",
    "progress.html": "Progress",
}

ROUTES = {
    "index.html": "/",
    "auth.html": "/auth",
    "dashboard.html": "/dashboard",
    "courses.html": "/courses",
    "learning.html": "/learning",
    "progress.html": "/progress",
}

VOID_TAGS = {"area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"}

ATTRIBUTE_MAP = {
    "class": "className", "for": "htmlFor", "tabindex": "tabIndex",
    "readonly": "readOnly", "maxlength": "maxLength", "minlength": "minLength",
    "autocomplete": "autoComplete", "colspan": "colSpan", "rowspan": "rowSpan",
    "novalidate": "noValidate",
}

def quote(v):
    return json.dumps(str(v), ensure_ascii=False)

def convert_style(value):
    if not isinstance(value, str):
        return "{}"
    props = []
    for item in value.split(";"):
        if ":" not in item:
            continue
        k, v = item.split(":", 1)
        k, v = k.strip(), v.strip()
        if not k:
            continue
        k = re.sub(r"-([a-z])", lambda m: m.group(1).upper(), k)
        props.append(f"{k}: {quote(v)}")
    return "{" + ", ".join(props) + "}"

def convert_text(value):
    value = str(value)
    value = value.replace("{", "&#123;").replace("}", "&#125;")
    return value

BOOLEAN_ATTRS = {"required","disabled","checked","selected","readonly","multiple","autofocus","novalidate"}

def convert_attributes(tag):
    attrs = []
    for key, value in tag.attrs.items():
        if key == "style":
            attrs.append(f"style={{{convert_style(value)}}}")
            continue
        if key.startswith("on") and isinstance(value, str):
            event_name = key[2:].lower()
            event_name = "on" + event_name[0].upper() + event_name[1:]
            call = value.strip().rstrip(";")
            attrs.append(f"{event_name}={{() => {{ {call}; }}}}")
            continue
        new_key = ATTRIBUTE_MAP.get(key, key)
        if isinstance(value, list):
            value = " ".join(value)
        if key in BOOLEAN_ATTRS and value in (None, "", key):
            attrs.append(f"{new_key}={{true}}")
            continue
        if value is None or value == key:
            attrs.append(new_key)
            continue
        attrs.append(f"{new_key}={quote(value)}")
    return (" " + " ".join(attrs)) if attrs else ""

def convert_node(node, level=0):
    indent = "  " * level
    if isinstance(node, Comment):
        return indent + "{/* " + str(node).strip() + " */}"
    if isinstance(node, NavigableString):
        text = convert_text(node)
        if not text.strip():
            return ""
        return indent + text.strip()
    if not getattr(node, "name", None):
        return ""
    if node.name in ("script", "style"):
        return ""

    tag = node.name
    attrs = convert_attributes(node)

    if tag in VOID_TAGS:
        return f"{indent}<{tag}{attrs} />"

    children = [c for c in (convert_node(ch, level+1) for ch in node.children) if c]

    if not children:
        return f"{indent}<{tag}{attrs}></{tag}>"

    if len(children) == 1 and "\n" not in children[0] and not children[0].lstrip().startswith("<"):
        return f"{indent}<{tag}{attrs}>{children[0].lstrip()}</{tag}>"

    return f"{indent}<{tag}{attrs}>\n" + "\n".join(children) + f"\n{indent}</{tag}>"


for html_file in SRC.glob("*.html"):
    page = html_file.name
    component = PAGE_NAMES.get(page)
    if not component:
        continue

    html = html_file.read_text(encoding="utf-8")
    soup = BeautifulSoup(html, "html.parser")
    body = soup.body

    # 1. page-specific <style> (kept as its own style tag, not deleted)
    page_style = ""
    style_tag = soup.head.find("style") if soup.head else None
    if style_tag:
        page_style = style_tag.string or ""

    # 2. inline <script> with no src -> becomes standalone legacy JS file
    inline_scripts = [s for s in body.find_all("script") if not s.get("src")]
    inline_js = "\n\n".join(s.string or "" for s in inline_scripts)
    legacy_filename = None
    if inline_js.strip():
        legacy_filename = page.replace(".html", "") + ".js"
        (OUT_LEGACY / legacy_filename).write_text(inline_js, encoding="utf-8")

    # figure out which shared scripts this page loads, and in what order
    src_scripts = [s.get("src") for s in body.find_all("script") if s.get("src")]
    uses_store = any("store.js" in s for s in src_scripts)
    uses_app = any("app.js" in s for s in src_scripts)

    # remove ALL script tags before converting body -> jsx
    for s in body.find_all("script"):
        s.decompose()

    content_parts = [convert_node(child, 3) for child in body.children]
    content_parts = [c for c in content_parts if c]
    content_jsx = "\n".join(content_parts)

    legacy_tags = []
    if uses_store:
        legacy_tags.append('            <LegacyScript src="/legacy/js/store.js" />')
    if uses_app:
        legacy_tags.append('            <LegacyScript src="/legacy/js/app.js" />')
    if legacy_filename:
        legacy_tags.append(f'            <LegacyScript src="/legacy/js/{legacy_filename}" />')
    legacy_block = "\n".join(legacy_tags)

    style_block = ""
    if page_style.strip():
        style_block = (
            "      <style dangerouslySetInnerHTML={{ __html: `\n"
            + page_style
            + "\n      ` }} />\n"
        )

    component_code = (
        'import PageCss from "../components/PageCss";\n'
        'import LegacyScript from "../components/LegacyScript";\n\n'
        f"export default function {component}() {{\n"
        "  return (\n"
        "    <>\n"
        '      <PageCss href="/css/styles.css" />\n'
        + style_block +
        "      <>\n"
        + content_jsx + "\n"
        "      </>\n"
        + legacy_block + "\n"
        "    </>\n"
        "  );\n"
        "}\n"
    )

    (OUT_PAGES / f"{component}.jsx").write_text(component_code, encoding="utf-8")
    print("Created:", component + ".jsx", "| legacy js:", legacy_filename, "| style:", bool(page_style.strip()))

print("\nDone.")
