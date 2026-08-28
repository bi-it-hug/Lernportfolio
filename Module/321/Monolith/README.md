# Monolith

## 1. Features der LMS-Applikation

- **Benutzerverwaltung**
    - Anmeldung / Login
    - Verwaltung von Lernenden, Lehrenden und Administratoren
    - Rollen und Berechtigungen

- **Kursverwaltung**
    - Kurse erstellen
    - Kurse bearbeiten
    - Teilnehmer zu Kursen hinzufügen
    - Zugriff auf Kurse steuern
    - Individuelle Lernpfade festlegen

- **Lerninhalte / Materialien**
    - Lernmaterialien hinzufügen
    - Videos bereitstellen
    - Dokumente bereitstellen
    - Quizze bereitstellen
    - Aufgaben bereitstellen
    - Inhalte in Module bzw. Kursabschnitte gliedern

- **Lernfortschritt**
    - Fortschritt pro Kurs speichern
    - Abgeschlossene Aufgaben speichern
    - Bestandene Prüfungen speichern
    - Fortschritt für Lernende anzeigen

- **Prüfungs- und Aufgabenverwaltung**
    - Prüfungen erstellen
    - Aufgaben erstellen
    - Multiple-Choice-/automatisch auswertbare Tests
    - Freitextaufgaben
    - Manuelle Korrektur
    - Automatische Korrektur
    - Ergebnisse speichern
    - Ergebnisse anzeigen

- **Kommunikation**
    - Nachrichten zwischen Benutzern
    - Diskussionsforen
    - Fragen stellen
    - Diskussionen führen
    - Rückmeldungen von Lehrenden
    - Ankündigungen

- **Reporting / Administration**
    - Aktivitäten der Lernenden auswerten
    - Fortschrittsberichte erstellen
    - Kursstatistiken erstellen
    - Benutzer verwalten
    - Kurse überwachen

---

## 2. Mögliche Microservices

| Microservice              | Verantwortlichkeit                                     |
| ------------------------- | ------------------------------------------------------ |
| **User Service**          | Benutzer, Login, Rollen und Berechtigungen             |
| **Course Service**        | Kurse, Teilnehmer, Kursstruktur und Lernpfade          |
| **Content Service**       | Videos, Dokumente und andere Lernmaterialien           |
| **Assessment Service**    | Prüfungen, Quizze, Aufgaben und Korrekturen            |
| **Progress Service**      | Lernfortschritt, abgeschlossene Inhalte und Ergebnisse |
| **Communication Service** | Nachrichten, Foren und Ankündigungen                   |
| **Reporting Service**     | Statistiken und Berichte über Kurse und Lernende       |

---

## 3. Was arbeitet womit zusammen?

**User Service ↔ Course Service**<br />
Der Course Service muss wissen, welche Benutzer an einem Kurs teilnehmen und welche Benutzer Lehrende sind.

**Course Service ↔ Content Service**<br />
Ein Kurs enthält Module und Lernmaterialien.

**Course Service ↔ Assessment Service**<br />
Prüfungen und Aufgaben gehören zu bestimmten Kursen bzw. Kursabschnitten.

**Assessment Service ↔ Progress Service**<br />
Nach einer Prüfung muss das Ergebnis zum Lernfortschritt hinzugefügt werden.

**Content Service ↔ Progress Service**<br />
Wenn ein Lernender ein Modul oder Lernmaterial abgeschlossen hat, wird dies als Fortschritt gespeichert.

**User Service ↔ Communication Service**<br />
Nachrichten und Forenbeiträge benötigen Absender und Empfänger.

**Reporting Service ↔ Course / Assessment / Progress Service**<br />
Der Reporting Service benötigt Informationen über Kurse, Prüfungen und Fortschritte, um Statistiken zu erstellen.

---

## 4. Zeichnung

```text
                         ┌─────────────────┐
                         │   User Service  │
                         │-----------------│
                         │ Benutzer        │
                         │ Rollen          │
                         │ Login           │
                         └────────┬────────┘
                                  │
                     ┌────────────┼──────────────┐
                     │            │              │
                     ▼            ▼              ▼
             ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐
             │Course Service│ │Communication │ │ Reporting Service│
             │--------------│ │   Service    │ │------------------│
             │Kurse         │ │--------------│ │Statistiken       │
             │Teilnehmer    │ │Nachrichten   │ │Berichte          │
             │Lernpfade     │ │Foren         │ └────────┬─────────┘
             └──────┬───────┘ │Ankündigungen │          │
                    │         └──────────────┘          │
             ┌──────┴───────────┐                       │
             │                  │                       │
             ▼                  ▼                       │
     ┌────────────────┐ ┌──────────────────┐            │
     │Content Service │ │Assessment Service│────────────┤
     │----------------│ │------------------│            │
     │Videos          │ │Prüfungen         │            │
     │Dokumente       │ │Quizze            │            │
     │Module          │ │Aufgaben          │            │
     └───────┬────────┘ │Bewertungen       │            │
             │          └────────┬─────────┘            │
             │                   │                      │
             └─────────┬─────────┘                      │
                       ▼                                │
                ┌────────────────┐                      │
                │Progress Service│──────────────────────┘
                │----------------│
                │Fortschritt     │
                │Abschlüsse      │
                │Resultate       │
                └────────────────┘
```

## 5. Kurze Begründung für die Aufteilung

> Die Applikation wird anhand ihrer fachlichen Verantwortlichkeiten in verschiedene Microservices aufgeteilt. Jeder Microservice übernimmt einen klar abgegrenzten Bereich des LMS. Beispielsweise verwaltet der Course Service ausschliesslich Kurse und Teilnehmer, während der Assessment Service für Prüfungen und Aufgaben zuständig ist. Der Progress Service speichert unabhängig davon den Lernfortschritt der Benutzer. Dadurch können die einzelnen Bereiche unabhängig entwickelt, gewartet und skaliert werden. Die Services kommunizieren miteinander, wenn Informationen aus einem anderen Fachbereich benötigt werden.
