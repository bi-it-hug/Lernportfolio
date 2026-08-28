# Findings LB2

[TOC]

## Einleitung
Dieses Dokument gibt Hinweise, wo die extra unsicher programmierte [Applikation](https://gitlab.com/ch-tbz-it/Stud/m183/lb2-applikation) verwundbar ist gegenüber Angriffen. Wichtig: die Liste ist nicht abschliessend und auch nicht sehr konkret. Die Idee ist, wenn Sie keine Ideen haben, wo nach Fehlern zu suchen, dass Sie dieses Dokument etwas leitet und unterstützt.

## Empfohlenes vorgehen für die Fehlersuche
Im Zusammenhang mit der [OWASP TOP 10](https://owasp.org/www-project-top-ten/) haben Sie die häufigsten Fehler in Webapplikationen kennengelernt. Nehmen Sie diese Liste als Grundlage für eine systematische Suche im Code. Sie sollten für praktisch jedes der TOP 10 Themen Fehler in der unsichereren TODO-App finden.

Die kritischen Dinge bei einer Webapplikation sind die Teile der Applikation, auf die der Benutzer Einfluss nehmen kann (direkt oder indirekt). Starten Sie die Suche nach Schwachstellen bei den Formularen. Die Daten, die der Benutzer dort eingeben kann, werden an die in der Action angegebene URL. Serverseitig werden die Daten anschliessend durch das Script verarbeitet, verändert und in anderem Kontext weiterverwendet. Gehen Sie dem Datenfluss nach (also wo werden die Daten des Benutzers überall verwendet), um zu finden, worauf der Benutzer überall einfluss nehmen kann.

Gehen Sie davon aus, dass ein "bösartiger" Benutzer (Angreifer) alle Daten, die an die Serverseite gesendet werden, manipulieren kann. Dazu gehören auch Daten, an die im ersten Moment nicht gedacht wird. Insbesondere können, das Cookies oder auch hidden-fields bei Formularen sein. Häufig sind es Sonderzeichen, die in der Applikation in anderem Kontext verwendet werden und dann zu Steuerzeichen für Befehle werden, die den Ablauf des Programms / Scripts beeinflussen kann.

Überlegen Sie auch etwas weiter: Welche bekannten Attacken gibt es (Bruteforce, DDoS-Attacken, Man-in-the-middle-Angriffe, Phishing, Session Hijacking, Session fixation, etc.)? Und gegen welche Arten von Angriffen ist die Applikation anfällig?

Überlegen Sie auch, ob es Möglichkeiten für Benutzer oder Gäste gibt auf Bereiche zuzugreifen, wo kein Zugriff vorhanden sein sollte oder Daten anderer Benutzer zu manipulieren.

Die Applikation verwendet Docker und Docker Compose. Überlegen Sie auch da - insbesondere im Hinblick auf das Handling der Config-Files oder auch im Zusammenhang mit verwendeten Versionen, ob da auch alles in Ordnung ist.

## Anzahl vorhandener Schwachstellen
Teilweise lassen sich unterschiedliche Schwachstellen nicht scharf voneinander abgrenzen. Eine Person sieht etwas als eine Schwachstelle an, wo andere das Ganze in mehrere Schwachstellen aufteilen würden.

Aus diesem Grund ist die Angabe einer Anzahl der vorhandenen Schwachstellen nicht hilfreich / sinnvoll als Hilfestellung, ob Sie alles gefunden haben oder nicht. Was aber gesagt werden kann: Es sind sicher mehr als 20 unterschiedliche Schwachstellen vorhanden. 

Damit Sie sich etwas orientieren können, hier eine Empfehlung für die Suche:
- Sie haben nur 2-3 Fehler gefunden bisher: dann sollten Sie definitiv noch weitersuchen.
- Sie haben 10 - 20 Fehler gefunden: weitersuchen lohnt sich auch in diesem Fall. Eventuell hilft das Gespräch bzw. der Austausch mit anderen Gruppen oder der Lehrperson um noch weitere Fehler zu finden.
- Sie haben 20 - 30 Fehler gefunden: Suchen Sie nur noch dann weiter, wenn Ihnen gerade noch Dinge auffallen, die unsicher sein könnten und die Sie noch überprüfen möchten. Falls Ihnen da aber nichts mehr auffällt, haben Sie höchstwahrscheinlich die grosse Mehrheit der Fehler erfolgreich erkannt und können die weitere Suche beenden.
