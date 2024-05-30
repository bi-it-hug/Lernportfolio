# 10 - Git

## 01 - Einführung

Gerne! Hier sind die grundlegenden Konzepte und Befehle von Git:

### Was ist Git?
Git ist ein verteiltes Versionskontrollsystem, das hauptsächlich zur Verwaltung von Quellcode verwendet wird. Es ermöglicht mehreren Entwicklern, gleichzeitig an Projekten zu arbeiten, Änderungen nachzuverfolgen und den Projektverlauf zu verwalten.

### Grundlegende Konzepte
1. **Repository (Repo)**: Ein Verzeichnis, das alle Dateien und den kompletten Verlauf eines Projekts enthält.
2. **Commit**: Eine Momentaufnahme des Projekts. Jeder Commit hat eine eindeutige ID und speichert den aktuellen Stand des Projekts.
3. **Branch**: Ein paralleler Entwicklungszweig. Der Hauptzweig heisst normalerweise "master" oder "main".
4. **Merge**: Das Zusammenführen von Änderungen aus verschiedenen Branches.
5. **Clone**: Eine Kopie eines existierenden Repositories.
6. **Remote**: Ein entferntes Repository, normalerweise auf einem Server wie GitHub oder GitLab.

### Grundlegende Befehle
- **Initialisierung eines neuen Repositories**
  ```ps
  git init
  ```

- **Klonen eines existierenden Repositories**
  ```ps
  git clone <repository-url>
  ```

- **Überprüfen des Repository-Status**
  ```ps
  git status
  ```

- **Hinzufügen von Änderungen zur Staging-Area**
  ```ps
  git add <datei1> <datei2>
  # oder alle Dateien hinzufügen
  git add .
  ```

- **Committen der Änderungen**
  ```ps
  git commit -m "Beschreibung der Änderungen"
  ```

- **Überprüfen des Commits-Verlaufs**
  ```ps
  git log
  ```

- **Erstellen eines neuen Branches**
  ```ps
  git branch <neuer-branch-name>
  ```

- **Wechseln zu einem anderen Branch**
  ```ps
  git checkout <branch-name>
  ```

- **Zusammenführen von Branches**
  ```ps
  git merge <branch-name>
  ```

- **Hochladen von Änderungen zu einem Remote-Repository**
  ```ps
  git push <remote-name> <branch-name>
  ```

- **Herunterladen von Änderungen von einem Remote-Repository**
  ```ps
  git pull <remote-name> <branch-name>
  ```

### Weitere nützliche Befehle
- **Remote hinzufügen**
  ```ps
  git remote add <remote-name> <repository-url>
  ```

- **Änderungen anzeigen**
  ```ps
  git diff
  ```

- **Stash Änderungen (Änderungen zwischenspeichern)**
  ```ps
  git stash
  ```

- **Stash anwenden**
  ```ps
  git stash apply
  ```

Diese Befehle und Konzepte sollten dir einen guten Start mit Git ermöglichen. Es gibt viele weitere Funktionen und Details, die Git bietet, aber dies deckt die Grundlagen ab.

***
