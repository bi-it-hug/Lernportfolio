# Mini Frontend + Mini Backend (Authentication Failures)

Dieses kleine Demo zeigt beide Beispiele aus `LB1/README.md`:

- Unsicher: hardcoded Passwort im Code
- Sicher: Passwort aus Umgebungsvariable

## Starten

1. In den Backend-Ordner wechseln:

```powershell
cd .\demo-auth\backend
```

2. Server starten:

```powershell
python .\server.py
```

3. Im Browser aufrufen:

```text
http://127.0.0.1:8000
```

## Sicheres Beispiel testen

Ohne gesetztes `DB_PASSWORD` gibt der sichere Endpoint einen Fehler zuruck.

Setze fur den Test zuerst:

```powershell
$env:DB_PASSWORD = "MeinSicheresPasswort!"
python .\server.py
```
