import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


HOST = "127.0.0.1"
PORT = 8000

DB_HOST = "db.internal.local"
DB_USER = "app_user"
DB_PASSWORD = "SuperSecret123!"  # Unsicher: hardcoded secret

BACKEND_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BACKEND_DIR.parent / "frontend"


def insecure_example():
    return {
        "mode": "unsicher",
        "title": "Hardcoded Password (CWE-259 / CWE-798)",
        "db_host": DB_HOST,
        "db_user": DB_USER,
        "db_password": DB_PASSWORD,
        "message": f"Verbinde mit {DB_HOST} als {DB_USER} mit hardcoded Passwort.",
        "risk": "Wenn der Code geleakt wird, ist das Passwort sofort kompromittiert.",
    }


def secure_example():
    password = os.getenv("DB_PASSWORD")
    if not password:
        raise ValueError("DB_PASSWORD ist nicht gesetzt.")

    return {
        "mode": "sicher",
        "title": "Secret aus Umgebungsvariable",
        "db_host": os.getenv("DB_HOST", "db.internal.local"),
        "db_user": os.getenv("DB_USER", "app_user"),
        "password_present": True,
        "message": "Passwort wurde aus einer Umgebungsvariable geladen.",
        "benefit": "Secrets sind vom Quellcode getrennt und besser verwaltbar.",
    }


class RequestHandler(BaseHTTPRequestHandler):
    def _send_json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _serve_file(self, filename, content_type):
        file_path = FRONTEND_DIR / filename
        if not file_path.exists():
            self.send_error(404, "Datei nicht gefunden")
            return

        content = file_path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", f"{content_type}; charset=utf-8")
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def do_GET(self):
        path = urlparse(self.path).path

        if path in ("/", "/index.html"):
            self._serve_file("index.html", "text/html")
            return
        if path == "/app.js":
            self._serve_file("app.js", "application/javascript")
            return
        if path == "/styles.css":
            self._serve_file("styles.css", "text/css")
            return

        if path == "/api/insecure-example":
            self._send_json(insecure_example())
            return
        if path == "/api/secure-example":
            try:
                self._send_json(secure_example())
            except ValueError as exc:
                self._send_json(
                    {
                        "mode": "sicher",
                        "title": "Secret aus Umgebungsvariable",
                        "error": str(exc),
                        "hint": "Setze DB_PASSWORD, z. B. in PowerShell: $env:DB_PASSWORD='MeinSecret'",
                    },
                    status=400,
                )
            return

        self._send_json({"error": "Endpoint nicht gefunden"}, status=404)

    def log_message(self, format, *args):
        return


def main():
    server = ThreadingHTTPServer((HOST, PORT), RequestHandler)
    print(f"Server läuft auf http://{HOST}:{PORT}")
    print("Drücke Ctrl+C zum Stoppen.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
