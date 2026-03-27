import express from "express";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

const HOST = "127.0.0.1";
const PORT = 8000;

const DB_HOST = "db.internal.local";
const DB_USER = "app_user";
const DB_PASSWORD = "SuperSecret123!"; // Unsicher: hardcoded secret

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const frontendDir = path.resolve(__dirname, "..", "..", "frontend");

function insecureExample() {
    return {
        mode: "unsicher",
        title: "Hardcoded Password (CWE-259 / CWE-798)",
        db_host: DB_HOST,
        db_user: DB_USER,
        db_password: DB_PASSWORD,
        message: `Verbinde mit ${DB_HOST} als ${DB_USER} mit hardcoded Passwort.`,
        risk: "Wenn der Code geleakt wird, ist das Passwort sofort kompromittiert.",
    };
}

function secureExample() {
    const password = process.env.DB_PASSWORD;
    if (!password) {
        throw new Error("DB_PASSWORD ist nicht gesetzt.");
    }

    return {
        mode: "sicher",
        title: "Secret aus Umgebungsvariable",
        db_host: process.env.DB_HOST || "db.internal.local",
        db_user: process.env.DB_USER || "app_user",
        password_present: true,
        message: "Passwort wurde aus einer Umgebungsvariable geladen.",
        benefit: "Secrets sind vom Quellcode getrennt und besser verwaltbar.",
    };
}

app.use(express.static(frontendDir));

app.get("/api/insecure-example", (req, res) => {
    res.json(insecureExample());
});

app.get("/api/secure-example", (req, res) => {
    try {
        res.json(secureExample());
    } catch (error) {
        res.status(400).json({
            mode: "sicher",
            title: "Secret aus Umgebungsvariable",
            error: error.message,
            hint: "Setze DB_PASSWORD in .env oder in PowerShell: $env:DB_PASSWORD='MeinSecret'",
        });
    }
});

app.listen(PORT, HOST, () => {
    console.log(`Server laeuft auf http://${HOST}:${PORT}`);
    console.log("Druecke Ctrl+C zum Stoppen.");
});
