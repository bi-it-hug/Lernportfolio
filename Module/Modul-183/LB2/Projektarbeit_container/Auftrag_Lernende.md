# LB2 - Penetrationtesting Auftrag

[TOC]

## Lernziele
Die LB2 sollte Sie befähigen folgende Lernziele zu erreichen:
* Sie können Sicherheitslücken in einer bestehenden Applikation durch den Einsatz von Pentesting-Tools und durch Code-Reviews identifizieren.
* Sie können die identifizierten Schwachstellen durch Anpassung der Implementation und / oder einführen von Sicherheitsmassnahmen schliessen bzw. die Auswirkungen eines möglichen Vorfalls minimieren.
* Sie können eine Applikation systematisch durchtesten und die Tests wie auch die Testergebnisse sinnvoll dokumentieren.
* Sie können Findings aus den Testresultaten ableiten und Testresultate auch kritisch hinterfragen.

## Ablauf
Die Projektarbeit findet in Gruppen von 2-3 Personen statt. Jede Gruppe übernimmt im Laufe der Projektarbeit mal die Rolle der Entwickler und mal die Rolle der Tester.

Der Auftrag findet in 3 Phasen statt:
* **Phase 1:** Gegeben ist eine TODO-Listen-Applikation. Diese können Sie unter https://gitlab.com/ch-tbz-it/Stud/m183/lb2-applikation beziehen. Die Applikation enthält jedoch einige Sicherheitsmängel. Ihre Aufgabe in der Rolle als Entwickler ist es, diese Mängel zu identifizieren und möglichst viele davon zu schliessen. Sie sollten zudem die Applikation um eigene Features erweitern (Details im Kapitel [Erweiterung der Applikation](.#erweiterung-der-applikation)).
* **Phase 2:** Die Entwickler übergeben Ihre Applikation den Testern. Jetzt wechseln Sie Ihre Rolle und werden von Entwicklern zu Testern. Die Tester (also Sie) analysieren die Applikation auf noch vorhandene Schwachstellen und erstellen ein Testprotokoll aus welchem hervorgeht, was getestet wurde und welche allfälligen Schwachstellen noch gefunden wurden.
* **Phase 3:** Die Entwickler (wieder Sie - erneuter Rollenwechsel) erhalten das Testprotokoll der Tester und müssen Ihrerseits nun nochmals die Applikation überarbeiten und die noch gefundenen Schwachstellen fixen (sofern noch welche gefunden wurden). Zudem müssen die Entwickler den Testern schriftlich ein Feedback geben, was Sie von den Findings und dem Testprotokoll halten.

Die Zuteilung welche Gruppe die Applikation welcher anderen Gruppe testen wird, wird durch die Lehrperson vorgenommen und entsprechend kommuniziert.

## Erweiterung der Applikation
Der Umfang für die Erweiterung der Applikation in Phase 1 sollte 4-8 Stunden pro Person nicht übersteigen. Wichtig: die Behebung der Schwachstellen, die bereits vorhanden sind, ist in dieser Zeitangabe nicht enthalten. In der Wahl, welche Features Sie erweitern möchten, sind Sie frei. Wählen Sie jedoch etwas (oder auch 2-3 Dinge… je nach persönlichen Interessen), was keine andere Gruppe hat. Die Lehrperson wird über alle Gruppen hinweg koordinieren, welche Gruppe welche Features umsetzen wird. Die Features, die Sie erweitern, sollten etwas mit den drei Schutzzielen (CIA = Confidentiality, Integrity, Availability) zu tun haben.

Sollten Sie keine eigenen Ideen haben, können Sie sich an folgender Liste orientieren:
* User Registrierung - damit sich neue Benutzer für die TODO-Listen-App registrieren können
* Gruppen/Rollenverwaltung umsetzen - beispielsweise um gemeinsame TODO-Listen für Benutzer in derselben Gruppe zu ermöglichen
* MFA - Mehrfaktorauthentifizierung (zur Erhöhung der Sicherheit beim Login)
* PW-Reset - Self-Service-Funktionalität, wenn das PW vergessen wurde
* Schutz vor Brute-Force-Attacke auf die Login-Maske - beispielsweise blockieren des Logins für eine kurze Zeit bei vielen falschen Versuchen od. E-Mail-Info an den Inhaber des Kontos 
* Logging der Login-Aktivitäten oder auch eine Log-History beim Editieren der TODOs (Logging & Monitoring)
* Löschen eines Benutzerkontos inkl. allfälliger der Person zugewiesenen Tasks (Thema Datenschutz und Umsetzung Recht auf Vergessen)
* Einbinden eines Identity-Profiders (beispielsweise Login über Microsoft- od. Google-Account)
* Einsatz einer WAF (web application firewall)
* ...

Die Liste ist nicht abschliessend. Einige der Features sind zudem aufwendiger als andere. Schauen Sie, dass es für Sie in der Gruppe vom Aufwand her passt, dass Sie aber ein Thema wählen, das Sie auch persönlich weiterbringt bzw. persönlich interessiert. Gewisse Themen - wenn diese nicht gleich umgesetzt werden - können auch mehrfach vergeben werden. Beispielsweise wenn Sie Google als Identityprovider einbinden und eine andere Gruppe Microsoft, dann ist das in Ordnung. Die abschliessende Entscheidung, ob Ihr gewünschtes Feature in Ordnung ist und auch vom Aufwand her passt, liegt aber bei der Lehrperson.

## Bewertung
In jeder Phase der Projektarbeit sind andere Kriterien wichtig. Pro Kriterium werden Punkte vergeben (siehe unten). Die Note berechnet sich aufgrund der Formel `[erreichte Punkte] / 24 * 5 + 1`.

**Phase 1**

Kriterium **Erweiterung funktional** (maximal 4 P.)
* 0 P. = Erweiterung nicht vorhanden 
* 1 P. = Etwas gemacht, aber Absicht / Ziel noch nicht erkennbar 
* 2 P. = Etwas gemacht, Absicht / Ziel erkennbar 
* 3 P. = Erweiterung grundsätzlich funktional - jedoch noch einige Fehler vorhanden (funktionale und sicherheitsrelevante Fehler)
* 4 P. = Erweiterung funktional - keine bis sehr wenige unbedeutende Fehler vorhanden

Kriterium **Umfang der Erweiterung** (maximal 2 P.)
* 0 P. = Sehr einfache und nur wenige Erweiterungen gewählt
* 1 P. = Umfang und Menge der Erweiterungen erwartungsgemäss
* 2 P. = Umfang und Menge der Erweiterungen übertrifft Erwartungen

Kriterium **Anzahl noch vorhandener Schwachstellen inkl. allfällig neu geschaffener Schwachstellen** (maximal 4 Punkte)
* 0 P. = Keine der Schwachstellen konnte gefixt werden
* 1 P. = Vereinzelt wurden Schwachstellen erkannt und behoben
* 2 P. = Ca. 50% der vorhandenen Schwachstellen konnte gefunden und eliminiert werden
* 3 P. = ca. 75% der vorhandenen Schwachstellen konnte gefunden und eliminiert werden
* 4 P. = Praktisch alle Schwachstellen konnten gefunden und eliminiert werden (Abhängig von der "schwere" der nicht eliminierten Schwachstellen entscheidet die Lehrperson darüber, was noch reicht für 4 Punkte)

**Phase 2**

Kriterium **Testabdeckung** (maximal 4 P.)
* 0 P. = Testbericht nicht abgegeben / keine Tests vorhanden
* 1 P. = Testbericht vorhanden, aber sehr einseitige Testabdeckung und sehr wenige Testcases
* 2 P. = Keine Systematik bezüglich der Testdefinition erkennbar, viele wichtige Testcases vergessen
* 3 P. = ca. 50 - 75 % der unterschiedlichen Sicherheitsaspekte durch Tests abgedeckt 
* 4 P. = > 75% der unterschiedlichen Sicherheitsaspekte durch Tests abgedeckt

Kriterium **Qualität Testbericht** (maximal 4 P.)
* 0 P. = Abgabe fehlt
* 1 P. = Testbericht vorhanden, aber in ungenügender Qualität
* 2 P. = Testbericht in genügender Qualität vorhanden
* 3 P. = Testbericht in guter Qualität vorhanden
* 4 P. = Testbericht in sehr guter Qualität vorhanden

**Phase 3**

Kriterium **Feedback auf Testbericht der anderen Gruppe** (maximal 2 P.)
* 0 P. = Kein Feedback bzw. keine Reaktion od. Bezug auf Testbericht von anderer Gruppe
* 1 P. = Feedback vorhanden, aber nicht vollständig (Kritischer Blick auf Testbericht fehlt und/oder Begründung ist nicht vorhanden, warum Findings aus Testbericht nicht gefixt bzw. ignoriert wurden) und/oder realistisch
* 2 P. = Feedback vorhanden, realistisch und vollständig in guter bis sehr guter Qualität

Kriterium **Qualität der Fixes** (maximal 4 P.)
* 0 P. = Keine Fixes umgesetzt, obwohl noch Mängel vorhanden waren (bzw. unbegründet / falsch begründet nicht umgesetzt)
* 1 P. = Fixes unbrauchbar bzw. öffnen selbst neue Sicherheitslücken, Fixes in ungenügender Qualität umgesetzt
* 2 P. = Grössere Mängel bei den Fixes erkennbar, Fixes in genügender Qualität umgesetzt
* 3 P. = Kleinere Mängel bei den Fixes erkennbar, Fixes generell in guter Qualität umgesetzt
* 4 P. = Keine Fixes mehr nötig (wenn alles schon perfekt war, d. h. der Code bereits sicherheitslückenfrei umgesetzt wurde) oder Fixes in sehr guter Qualität umgesetzt
