# Modul 347

1. **Container-Virtualisierung (CV)** ist eine Form der Virtualisierung, bei der Anwendungen zusammen mit ihren Abhängigkeiten in einem Prozess-Isolationscontainer laufen. Diese Container teilen sich den gleichen Kernel des Host-Betriebssystems, sind aber voneinander isoliert, was eine effiziente Nutzung der Systemressourcen ermöglicht und die Konsistenz über Entwicklung, Test und Produktion hinweg sicherstellt.

2. Ein **Betriebssystem**, das Container-Virtualisierung unterstützen soll, muss über Funktionen zur Prozess- und Ressourcenisolierung verfügen. Dazu gehört die Unterstützung von **Namespaces** zur Isolation von Prozessen, Netzwerken und Benutzern sowie **Control Groups (Cgroups)** zur Ressourcenkontrolle, wie CPU, Speicher und Netzwerkressourcen.

3. **Namespaces** und **Cgroups** sind zwei entscheidende Komponenten, die Container-Virtualisierung ermöglichen:

    - **Namespaces**: Sie schaffen eine Abstraktion der Systemressourcen, die es einem Prozess erlaubt, seine eigene isolierte Instanz der globalen Ressourcen zu haben, einschließlich Dateisystemen, Netzwerkstacks und Prozess-IDs.
    - **Cgroups**: Sie ermöglichen das Ressourcenmanagement, indem sie limitieren und überwachen, wie viel CPU, Speicher, Netzwerkbandbreite und andere Ressourcen ein Container nutzen kann.

4. **Vorteile von Container-Virtualisierung**:

    - **Effizienz und Geschwindigkeit**: Container benötigen weniger Ressourcen als traditionelle virtuelle Maschinen und starten fast augenblicklich.
    - **Portabilität**: Da sie ihre Abhängigkeiten mitbringen, können Container problemlos zwischen verschiedenen Systemen und Cloud-Umgebungen verschoben werden.
    - **Skalierbarkeit**: Leichtes Hinzufügen oder Entfernen von Container-Instanzen zur Lastverteilung und Ressourcennutzung.
    - **Konsistenz**: Entwickler können sich darauf verlassen, dass ihre Anwendungen in verschiedenen Umgebungen gleich funktionieren.

5. **Risiken bei Container-Virtualisierung**:
    - **Sicherheit**: Da Container denselben Kernel nutzen, könnte eine Schwachstelle oder ein Angriff auf den Kernel alle darauf laufenden Container beeinflussen.
    - **Isolationsfehler**: Fehlerhafte Konfigurationen können dazu führen, dass die Isolation zwischen Containern nicht vollständig ist, was zu Sicherheits- und Leistungsproblemen führen kann.
    - **Ressourcenkontingentierung**: Ohne ordnungsgemäße Konfiguration können "gierige" Container mehr als ihren fairen Anteil an Ressourcen verbrauchen und die Leistung anderer Container beeinträchtigen.
