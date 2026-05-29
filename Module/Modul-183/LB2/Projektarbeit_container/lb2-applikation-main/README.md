# LB2 Applikation
Diese Applikation ist bewusst unsicher programmiert und sollte nie in produktiven Umgebungen zum Einsatz kommen. Ziel der Applikation ist es, Lernende für mögliche Schwachstellen in Applikationen zu sensibilisieren, diese anzuleiten, wie die Schwachstellen aufgespürt und geschlossen werden können.

Die Applikation wird im Rahmen der LB2 im [Modul 183](https://gitlab.com/ch-tbz-it/Stud/m183/m183) durch die Lernenden bearbeitet.

## Hinweise zur Installation
Die Applikation steht als PHP- oder NodeJS-Applikation zur Verfügung. Abhängig davon, ob Sie die LB2 mit PHP oder NodeJS umsetzen möchten, müssen Sie entweder compose.php.yaml oder compose.node.yaml dem Docker-Compose-Befehl mit übergeben:
* PHP: `docker compose -f compose.php.yaml up`
* NodeJS: `docker compose -f compose.node.yaml up`

Bei NodeJS müssen vor dem Start der Container noch mit `npm install` die Abhängigkeiten installiert werden (wichtig: der Befehl muss innerhalb vom `todo-list-node`-Verzeichnis ausgeführt werden).

Der include-Befehl in den YAML-Files steht erst ab der Docker Compose Version 2.20.3 zur Verfügung (https://docs.docker.com/compose/multiple-compose-files/include/). Sollte der Rechner beim Ausführen des `docker compose`-Befehls einen Fehler bezüglich include werfen, da müssten Sie entweder Docker Compose auf die letzte Version aktualisieren oder die Containerdefinition von `compose.db.yaml` für den Datenbank-Container ins `compose.php.yaml` oder `compose.node.yaml` rein kopieren (unter services).

Wichtig: der Port 80 muss auf Ihrem Lokalen Rechner zur Verfügung stehen. Wird dieser bereits verwendet, können Sie in der `compose.php.yaml` respektive in der `compose.node.yaml` den Port so anpassen, dass die Applikation auf einem anderen Port wie dem Port 80 zur Verfügung steht.