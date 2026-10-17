from io import BytesIO
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from pypdf.generic import ContentStream, NameObject
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "Samson Tesfamichael Resume - Full Stack Developer.pdf"
OUTPUT = ROOT / "output" / "pdf" / "Samson Tesfamichael Resume - Full Stack Developer.pdf"

PAGE_W, PAGE_H = letter
LEFT = 34
RIGHT = 578
BODY_W = RIGHT - LEFT
NAVY = HexColor("#18283f")


def wrap(text: str, font: str, size: float, width: float) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = word if not current else f"{current} {word}"
        if stringWidth(candidate, font, size) <= width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_wrapped(c: canvas.Canvas, text: str, x: float, y: float, width: float,
                 font: str = "Helvetica", size: float = 9.4,
                 leading: float = 12.0) -> float:
    c.setFont(font, size)
    c.setFillColor(NAVY)
    for line in wrap(text, font, size, width):
        c.drawString(x, y, line)
        y -= leading
    return y


def draw_bullet(c: canvas.Canvas, text: str, y: float) -> float:
    c.setFillColor(NAVY)
    c.setFont("Helvetica", 10.1)
    c.drawString(LEFT, y, "•")
    y = draw_wrapped(c, text, LEFT + 13, y, BODY_W - 13, size=10.1, leading=13.2)
    return y - 3.2


def overlay_page_two() -> bytes:
    buf = BytesIO()
    c = canvas.Canvas(buf, pagesize=letter)
    c.setFillColor(white)
    c.rect(24, 22, 568, 700, stroke=0, fill=1)

    y = 707
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(LEFT, y, "Full Stack Developer")
    c.setFont("Helvetica", 10.2)
    c.drawRightString(RIGHT, y, "2025 - Present")
    y -= 18
    c.setFont("Helvetica-Bold", 10.4)
    c.drawString(LEFT, y, "Raymoch (Hybrid)")
    y -= 18

    overview = (
        "Full Stack Developer building and maintaining Raymoch, a scalable digital ecosystem "
        "for SMEs, entrepreneurs, investors, governments, and development organizations. "
        "Partner with product, design, and engineering stakeholders to deliver responsive React "
        "interfaces, secure PHP/Laravel services, and Python APIs in a fast-paced environment."
    )
    y = draw_wrapped(c, overview, LEFT, y, BODY_W, size=10.1, leading=13.2) - 9

    c.setFont("Helvetica-Bold", 10.4)
    c.drawString(LEFT, y, "Key Responsibilities")
    y -= 17

    bullets = [
        "Designed, developed, tested, and maintained full-stack web applications using React, JavaScript, Vite, Material UI, PHP 8.x, Laravel 11/12, MySQL, and PostgreSQL.",
        "Built responsive, user-friendly React experiences for business profiles, financial analytics, team management, document repositories, geolocation mapping, and investor workflows.",
        "Developed robust RESTful APIs, reusable Laravel service layers, database models, authentication flows, and integrations with third-party services including maps, email, payments, search, and AI providers.",
        "Created a Python/FastAPI verification and CTI scoring service using Pydantic and SQLAlchemy, with entity APIs, secure document intake, duplicate detection, audit events, weighted trust scoring, and scheduled score decay.",
        "Integrated the React frontend with Laravel and Python backends, supporting JSON APIs, file previews, verification decisions, business intelligence, and multi-country reference data.",
        "Implemented authentication and authorization with Laravel Sanctum, JWT-oriented API patterns, passkeys, social login, and role/permission controls.",
        "Improved scalability, reliability, and search performance through optimized SQL, Elasticsearch/Scout architecture, background queues, WebSockets with Reverb, caching, and cloud-ready deployment patterns.",
        "Wrote clean, maintainable, reusable code and automated tests with PHPUnit, Mockery, Laravel testing tools, and Python validation; participated in code reviews and architectural decisions.",
        "Troubleshot and optimized frontend, API, database, file-processing, and integration workflows; maintained Git-based CI/CD and Docker/AWS-ready delivery practices.",
    ]
    for bullet in bullets:
        y = draw_bullet(c, bullet, y)

    c.save()
    return buf.getvalue()


def overlay_page_three() -> bytes:
    buf = BytesIO()
    c = canvas.Canvas(buf, pagesize=letter)
    # Preserve the next role, which begins at PDF top coordinate 493.8 (y ~= 298.2).
    c.setFillColor(white)
    c.rect(24, 299, 568, 493, stroke=0, fill=1)

    y = 770
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 10.2)
    c.drawString(LEFT, y, "Selected Raymoch Engineering Work")
    y -= 17
    selected = [
        "Python project: FastAPI service for business verification and CTI (Confidence, Trust & Integrity) scoring, using SQLAlchemy, Pydantic, SQLite/PostgreSQL-compatible data access, APScheduler, CORS middleware, document storage, SHA-256 deduplication, and health/diagnostic endpoints.",
        "PHP/Laravel platform: modular APIs and application services for subscriptions, verification, search, permissions, communications, analytics exports, document workflows, real-time events, and AI-assisted insights.",
        "Collaborated across product, UX/UI, data, and engineering to translate requirements into maintainable architecture, technical documentation, API contracts, and incremental releases.",
    ]
    for bullet in selected:
        y = draw_bullet(c, bullet, y)

    y -= 2
    c.setFont("Helvetica-Bold", 10.2)
    c.drawString(LEFT, y, "PHP / Composer Libraries Used at Raymoch")
    y -= 16
    libraries = (
        "Laravel Framework, Laravel Cashier, Scout, Socialite, Reverb, Passkeys, Tinker, UI, "
        "Spatie Laravel Permission, AWS SDK for PHP, Elasticsearch PHP Client, OpenAI PHP Client "
        "and Laravel integration, Dompdf, Doctrine DBAL, Intervention Image, Maatwebsite Excel, "
        "Yajra DataTables, libphonenumber-for-PHP, league/iso3166, Resend PHP, Symfony HTTP Client, "
        "Mailgun Mailer, Postmark Mailer, Illuminate Mail, PHPUnit, Mockery, Laravel Telescope, "
        "Pail, Pint, and Sail."
    )
    y = draw_wrapped(c, libraries, LEFT, y, BODY_W, size=10.0, leading=13.0) - 10

    c.setFont("Helvetica-Bold", 10.2)
    c.drawString(LEFT, y, "Technology Stack")
    y -= 16
    stack = (
        "React.js, JavaScript (ES6+), Vite, Material UI, HTML5, CSS3, PHP 8.x, Laravel 11/12, "
        "Python, FastAPI, SQLAlchemy, Pydantic, REST APIs, MySQL, PostgreSQL, SQLite, Elasticsearch, "
        "Laravel Scout, AWS, Docker, Git, GitHub, PHPUnit, PyTest-style validation, Agile/Scrum, "
        "CI/CD, API documentation, database modeling, performance optimization, and system design."
    )
    draw_wrapped(c, stack, LEFT, y, BODY_W, size=10.0, leading=13.0)

    c.save()
    return buf.getvalue()


def remove_original_text(page, reader: PdfReader, keep_from: str | None) -> None:
    """Remove superseded text-show operators while retaining the original page geometry."""
    stream = ContentStream(page.get_contents(), reader)
    filtered = []
    show_ops = {b"Tj", b"TJ", b"'", b'"'}
    preserving = False
    for operands, operator in stream.operations:
        if operator in show_ops and keep_from and not preserving:
            pieces = []
            for value in operands:
                if isinstance(value, str):
                    pieces.append(value)
                elif isinstance(value, list):
                    pieces.extend(item for item in value if isinstance(item, str))
            preserving = keep_from in "".join(pieces)
        remove = operator in show_ops and not preserving
        if not remove:
            filtered.append((operands, operator))
    stream.operations = filtered
    page[NameObject("/Contents")] = stream


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    reader = PdfReader(str(SOURCE))
    overlays = {1: PdfReader(BytesIO(overlay_page_two())).pages[0],
                2: PdfReader(BytesIO(overlay_page_three())).pages[0]}
    writer = PdfWriter()
    for index, page in enumerate(reader.pages):
        if index in overlays:
            remove_original_text(page, reader, None if index == 1 else "Senior Software Engineer")
            page.merge_page(overlays[index], over=True)
        writer.add_page(page)
    writer.add_metadata(reader.metadata or {})
    with OUTPUT.open("wb") as f:
        writer.write(f)
    print(OUTPUT)


if __name__ == "__main__":
    main()
