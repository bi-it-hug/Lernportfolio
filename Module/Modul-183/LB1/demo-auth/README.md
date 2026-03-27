# Mini Frontend + Mini Backend (Authentication Failures)

Dieses kleine Demo zeigt beide Beispiele aus `LB1/README.md`:

- Unsicher: hardcoded Passwort im Code
- Sicher: Passwort aus Umgebungsvariable

## Starten

1. In den Backend-Ordner wechseln:

```powershell
cd .\demo-auth\backend
```

2. Abhangigkeiten installieren:

```powershell
npm install
```

3. Server starten:

```powershell
npm start
```

4. Im Browser aufrufen:

```text
http://127.0.0.1:8000
```

## Sicheres Beispiel testen

Das Backend liest automatisch `demo-auth/backend/.env` (via `dotenv`).

1. Kopiere bei Bedarf die Vorlage:

```powershell
Copy-Item .env.example .env
```

2. Passe in `.env` den Wert fur `DB_PASSWORD` an.

3. Server starten:

```powershell
npm start
```

Alternative ohne `.env` (direkt in PowerShell):

```powershell
$env:DB_PASSWORD = "MeinSicheresPasswort!"
npm start
```
