# Garbage Collector Aufgaben

1. **Speicherlecks**:
   Ein Speicherleck tritt auf, wenn ein Programm Speicher belegt, diesen aber nicht wieder freigibt, obwohl er nicht mehr benötigt wird. Dies führt dazu, dass der verfügbare Arbeitsspeicher nach und nach aufgebraucht wird, was letztendlich zur Verlangsamung oder sogar zum Absturz des Systems führen kann.

2. **Finalisierung**:
   Die Finalisierung ist ein Mechanismus in Programmiersprachen wie Java, der es ermöglicht, bestimmte Aktionen durchzuführen, bevor ein Objekt vom Garbage Collector (GC) gelöscht wird. Es wird in der Regel verwendet, um Ressourcen wie Dateien oder Netzwerkverbindungen freizugeben, die nicht automatisch von der Garbage Collection verwaltet werden.

3. **Determinismus (Im Zusammenhang mit dem Garbage Collector)**:
   Determinismus bezieht sich auf die Vorhersagbarkeit des Verhaltens eines Systems. Im Zusammenhang mit dem Garbage Collector bedeutet es, dass der Zeitpunkt, an dem der GC aktiviert wird, nicht unbedingt vorhersagbar ist. In nicht-deterministischen GC-Systemen kann es also zu unvorhergesehenen Zeitpunkten zu Speicherbereinigung kommen, was die Performance beeinflussen kann.

4. **Fragmentierung (Im Zusammenhang mit dem Garbage Collector)**:
   Fragmentierung tritt auf, wenn durch häufiges Anlegen und Löschen von Objekten der verfügbare Speicher in kleine, nicht zusammenhängende Bereiche aufgeteilt wird. Dies kann dazu führen, dass der Garbage Collector ineffizient arbeitet, da es schwieriger wird, zusammenhängende Speicherblöcke für neue Objekte zu finden.

5. **Defragmentierung (Im Zusammenhang mit dem Garbage Collector)**:
   Defragmentierung ist der Prozess, bei dem der Speicher neu organisiert wird, um zusammenhängende freie Speicherblöcke zu schaffen. Dies kann die Effizienz des Speichers verbessern und die Leistung des Systems steigern, da es dem Garbage Collector ermöglicht, den Speicher effektiver zu nutzen.
