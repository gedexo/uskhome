import mimetypes

from django.conf import settings
from django.http import HttpResponse
from django.urls import path, re_path
from django.views.generic import TemplateView
from django.views.static import serve


app_name = "web"
mimetypes.add_type("image/webp", ".webp")
mimetypes.add_type("font/ttf", ".ttf")

HOME_TEMPLATE = "web/home/"
PAGES = {
    "": "index.html",
    "home/": "index.html",
    "index.html": "index.html",
    "english.html": "english.html",
    "guideline.html": "guideline.html",
    "guideline-en.html": "guideline-en.html",
    "terms.html": "terms.html",
    "terms-en.html": "terms-en.html",
    "privacy.html": "privacy.html",
    "privacy-en.html": "privacy-en.html",
    "disclaimer.html": "disclaimer.html",
    "disclaimer-en.html": "disclaimer-en.html",
    "refund.html": "refund.html",
    "refund-en.html": "refund-en.html",
}

urlpatterns = [
    path(
        route,
        TemplateView.as_view(template_name=f"{HOME_TEMPLATE}{template}"),
        name=(
            "home-alias"
            if route == "home/"
            else template.removesuffix(".html") or "home"
        ),
    )
    for route, template in PAGES.items()
]


def sitemap(request):
    routes = ["", *(route for route in PAGES if route and route != "home/")]
    urls = "".join(
        f"<url><loc>{request.build_absolute_uri('/' + route)}</loc></url>"
        for route in routes
    )
    return HttpResponse(
        '<?xml version="1.0" encoding="UTF-8"?>'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
        f"{urls}</urlset>",
        content_type="application/xml",
    )


def robots(request):
    sitemap_url = request.build_absolute_uri("/sitemap.xml")
    return HttpResponse(f"User-agent: *\nAllow: /\nSitemap: {sitemap_url}\n", content_type="text/plain")


urlpatterns += [
    path("sitemap.xml", sitemap, name="sitemap"),
    path("robots.txt", robots, name="robots"),
    re_path(
        r"^assets/(?P<path>.*)$",
        serve,
        {"document_root": settings.BASE_DIR / "templates" / "web" / "home" / "assets"},
        name="home-assets",
    ),
]
