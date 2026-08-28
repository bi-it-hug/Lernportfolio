# Projektarbeit (mit vorgegebener Applikation)
Die Projektarbeit findet in Gruppen statt. Jede Gruppe übernimmt im Laufe der Projektarbeit mal die Rolle der Entwickler und mal die Rolle der Tester. 

## Ablauf
* **Phase 1:** Die Lernenden erhalten von der Lehrperson eine Applikation. Diese enthält bereits selbst viele Sicherheitslücken und soll durch die Lernenden optimiert und erweitert werden. Eine mögliche Applikation ist unter https://gitlab.com/ch-tbz-it/Stud/m183/lb2-applikation abgelegt. Die eingebauten Fehler dieser Applikation sind unter [Findings.md](./Findings.md) dokumentiert. Unter [Findings_Stud.md](./Findings_Stud.md) befindet sich eine etwas reduzierte Variante, die den Lernenden als Hilfestellung abgegeben werden kann, wenn die Lernenden nicht recht wissen, wo suchen oder unsicher sind, ob alles gefunden wurde. Die Empfehlung ist, dass dieses dokument erst abgegeben wird, wenn die Lernenden bereits etwas gesucht haben.
* **Phase 2:** Die Entwickler übergeben Ihre Applikation den Testern. Die Tester analysieren die Applikation auf noch vorhandene Schwachstellen und erstellen ein Testprotokoll aus welchem hervorgeht, was getestet wurde und welche allfälligen Schwachstellen noch gefunden wurden.
* **Phase 3:** Die Entwickler erhalten das Testprotokoll der Tester und müssen Ihrerseits nun nochmals die Applikation überarbeiten und die noch gefundenen Schwachstellen fixen (sofern noch welche gefunden wurden). Zudem müssen die Entwickler den Testern schriftlich ein Feedback geben, was Sie von dem Findings und dem Testprotokoll halten.

## Bewertung
* **Phase 1:** Erweitertes Produkt wird bewertet. Bewertungskriterien: Ist die Erweiterung funktional? Wie viele Schwachstellen existieren im fertigen Produkt noch?
* **Phase 2:** Testing. Bewertungskriterien: Wurden alle noch vorhandenen Fehler gefunden bzw. wie viel wurde übersehen? Was wurde getestet (Testabdeckung)? Wie wurde protokolliert (Testprotokoll)?
* **Phase 3:** Gefundene Schwachstellen schliessen. Bewertungskriterien: Konnten alle Schwachstellen eliminiert werden? Wurden neue Schwachstellen durch die Anwendung der Fixes geschaffen? Wurde bei bemängelten Schwachstellen, die nicht geschlossen wurden eine gute Begründung geliefert (z. B. false-positiv... eine bemängelte Schwachstelle die keine ist)?

## Auftrag für die Lernenden
Eine Vorlage / möglicher Vorschlag wie die LB2 den Lernenden kommuniziert werden kann, ist unter [Auftrag_Lernende.md](./Auftrag_Lernende.md) abgelegt.