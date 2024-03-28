# 2024-03-14 | 03 - Bash Übungen

**Übung 1 - Repetition: Navigieren in Verzeichnissen:**
- Wechseln Sie zwischen verschiedenen Verzeichnissen, sowohl mit absoluten als auch mit relativen Pfaden.

**Übung 2 - Wildcards:**
- Verwenden Sie Wildcards, um Verzeichnisse und Dateien zu erstellen, zu löschen, zu kopieren und umzubenennen.

**Übung 3 - Tilde-Erweiterungen:**
- Verstehen und anwenden von Tilde-Erweiterungen für Benutzerverzeichnisse.

**Übung 4 - grep, cut, awk:**
- Anwenden von Befehlen wie grep, cut und awk auf Textdateien, um Muster zu durchsuchen, zu extrahieren und zu manipulieren.

**Übung 5 - Für Fortgeschrittene:**
- Verstehen und Interpretieren von komplexen Befehlen, die reguläre Ausdrücke verwenden, um bestimmte Muster in Systemausgaben zu finden.

**Übung 6 - stdout, stdin, stderr:**
- Verstehen und Anwenden von Befehlen zum Umleiten von Ein- und Ausgaben sowie zur Fehlerbehandlung.
- Verwendung von Pipes (|) zum Weiterleiten von Ausgaben zwischen Befehlen.

Diese Übungen decken grundlegende und fortgeschrittene Konzepte der Arbeit mit der Befehlszeile in Unix-Systemen ab.

# 2024-03-07 | 02 - Bash Grundlagen

## Linuxbefehle
- `cd`, `ls`, `mkdir`, `rmdir`: Navigation im Dateisystem
- Dateiverwaltung: `cp`, `rm`, `mv`, `touch`, `cat`, `wc`
- Effizienzsteigerung durch Aliase, Wildcards und Brace-Expansion

## Shellprogrammierung
- Variablen, arithmetische Operatoren, Zeichenkettenverarbeitung
- Kontrollstrukturen: `for`, `while`, `until`, `if`, `case`
- Praktische Beispiele und Übungen zur Festigung des Verständnisses

##  Script erstellen und ausführen
1. Terminal öffnen und mit `cd *Verzeichnis*` in das gewünschte Verzeichnis wechseln
2. Script mit `touch *Dateiname*.sh` erstellen
3. Script mit `chmod +x *Dateiname*.sh` ausführbar machen
4. Script mit `./*Dateiname*.sh` ausführen

### Beispiel:

~~~bash
cd Schreibtisch
touch test.sh
chmod +x test.sh
~~~

## Rechte und Benutzerverwaltung
- Zugriffsrechte: `chmod`
- Benutzer- und Gruppenverwaltung: `chown`, `chgrp`

## Exkurs: Reguläre Ausdrücke und Textverarbeitungstools
- Suche in Texten mit regulären Ausdrücken
- Textverarbeitungstools: `grep`, `cut`, `sed`, `awk`, `xargs`

## Zusammenfassung und Lernprozess
- Schrittweises Durcharbeiten der Themen mit praktischen Übungen
- Kombination aus theoretischem Verständnis und praktischer Anwendung
- Vertiefung des Wissens durch zusätzliche Ressourcen wie das Openbook "Shell Programmierung"

## Persönliches Fazit und Ausblick
- Erfolgreiches Erlernen und Anwenden der BASH-Scripting-Grundlagen
- Nächste Schritte: Anwendung in praxisorientierten Projekten, Vertiefung fortgeschrittener Konzepte wie Funktionen und Skriptoptimierung
- Stärkung des Vertrauens durch regelmässiges Üben und Arbeiten an realen Anwendungen

***

# 2024-03-07 | 01 - Linux Einführung

## Linux-Geschichte
Linux wurde von Linus Torvalds als Neugierprojekt gestartet und hat sich seitdem zu einem vielseitigen Betriebssystem entwickelt, das von einer Vielzahl von Entwicklern unterstützt wird.

## Linux-Installation
- Möglichkeiten der Installation auf verschiedenen Plattformen wie iOS-Smartphones, Android-Smartphones, Windows und MacOS.

- Empfehlung zur Installation einer virtuellen Maschine (VM) für eine eigenständige Linux-Umgebung.

- Vorstellung von Linux-Distributionen wie Debian und Ubuntu, einschliesslich der Installationsschritte.

- Einführung in die Linux-Verzeichnishierarchie mit wichtigen Verzeichnissen wie /bin, /dev, /etc, /home, /lib, /opt, /run, /sbin, /tmp, /usr und /var.

- Checkpoint für den Fortschritt, einschliesslich der Bestätigung der Linux-Herkunft, der erfolgreichen Installation einer Distribution und der Durchführung der ersten Schritte nach der Installation.