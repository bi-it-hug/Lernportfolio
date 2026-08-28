# Vergleiche

## Failover

### Vergleich von Failover-Softwarelösungen

| **Kriterium**              | **Keepalived**                                   | **Pacemaker + Corosync**                         | **Proxmox VE HA**                                         | **Windows Server Failover Clustering**        |
| -------------------------- | ------------------------------------------------ | ------------------------------------------------ | --------------------------------------------------------- | --------------------------------------------- |
| **Hauptzweck**             | Netzwerk-/Service-Failover                       | HA-Cluster und Ressourcenverwaltung              | Hochverfügbarkeit von VMs und Containern                  | Hochverfügbarkeit von Windows-Workloads       |
| **Plattform**              | Linux                                            | Vorwiegend Linux                                 | Proxmox VE / Linux                                        | Windows Server                                |
| **Failover**               | Automatisch                                      | Automatisch                                      | Automatisch                                               | Automatisch                                   |
| **Ausfallerkennung**       | VRRP, Health Checks, BFD                         | Über Cluster und Resource Monitoring             | Node-/Service-Überwachung                                 | Cluster-/Ressourcenüberwachung                |
| **Virtuelle IP**           | Sehr gut unterstützt                             | Als Cluster-Ressource möglich                    | Nicht Hauptzweck                                          | Möglich                                       |
| **VM-Failover**            |                                                  | Nicht Hauptzweck                                 | Kernfunktion                                              | Mit Hyper-V                                   |
| **Service-Failover**       | Begrenzt bzw. über Skripte/Checks                | Sehr umfangreich                                 | Primär VM/Container-Ebene                                 |                                               |
| **Load Balancing**         | Über IPVS                                        | Nicht eigentliche Aufgabe                        | Nicht eigentliche Aufgabe                                 | Abhängig vom Workload                         |
| **Datenreplikation**       | Keine eigene Datenreplikation                    | Benötigt zusätzliche Storage-/Replikationslösung | Abhängig von Storage-Konfiguration                        | Abhängig vom Workload/Storage                 |
| **GUI**                    |                                                  | Hauptsächlich CLI bzw. zusätzliche Tools         | Umfangreiche Weboberfläche                                | Windows Admin Center / andere Microsoft-Tools |
| **Komplexität**            | Niedrig bis mittel                               | Hoch                                             | Mittel                                                    | Mittel bis hoch                               |
| **Kosten**                 | Kostenlos / Open Source                          | Kostenlos / Open Source                          | Open Source, optionale kostenpflichtige Subscriptions     | Windows-Server-Lizenz erforderlich            |
| **Gut geeignet für**       | Zwei Linux-Server mit gemeinsamer virtueller IP  | Komplexe Linux-HA-Cluster                        | Virtualisierte Server-Infrastruktur                       | Microsoft-/Windows-Infrastruktur              |
| **Wichtige Einschränkung** | Kein vollständiges Cluster- oder Datenmanagement | Deutlich komplexere Einrichtung                  | Für zuverlässiges HA wird ein Cluster mit Quorum benötigt | Stark an Windows-Server-Umgebung gebunden     |

### 1. Keepalived

**Keepalived** ist besonders für einfaches **Active-Passive-Failover** geeignet. Über **VRRP** kann eine virtuelle IP zwischen zwei Hosts wechseln. Zusätzlich bietet Keepalived verschiedene Health Checks und kann über **IPVS** Layer-4-Load-Balancing durchführen. ([Keepalived][1])

**Vorteile:** relativ einfache Konfiguration, leichtgewichtig, kostenlos und für ein kleines Linux-Failover-System sehr gut geeignet.

**Nachteile:** Keepalived repliziert nicht automatisch die Daten oder Anwendungen der beiden Server. Diese müssen separat synchron gehalten werden. Außerdem ist es kein vollständiger Cluster-Manager.

### 2. Pacemaker + Corosync

**Pacemaker** ist ein vollständiger **High-Availability Cluster Resource Manager**. Zusammen mit **Corosync** kann er Nodes, Dienste und andere Ressourcen überwachen und bei einem Ausfall auf andere Cluster-Nodes verschieben bzw. dort wiederherstellen. ([ClusterLabs][2])

**Vorteile:** wesentlich mächtiger als Keepalived und für komplexe HA-Umgebungen geeignet. Unterschiedliche Ressourcen und Abhängigkeiten können zentral verwaltet werden.

**Nachteile:** Die Einrichtung und Administration ist deutlich komplexer. Für ein kleines Failover-System kann das schnell zum Konfigurations-Pferdeschiss werden.

### 3. Proxmox VE HA

**Proxmox VE** besitzt einen eigenen **HA Manager**. Dieser überwacht VMs und Container und kann sie nach einem Node-Ausfall automatisch auf einem anderen Node starten. Proxmox empfiehlt für zuverlässiges Quorum mindestens drei Cluster-Nodes; für kleinere Zwei-Node-Cluster kann ein QDevice eine dritte Stimme bereitstellen. ([GitHub][3])

**Vorteile:** komfortable Weboberfläche, gute Integration in die Virtualisierung und automatisches Failover kompletter VMs/Container.

**Nachteile:** Für einen einfachen Dienst ist Proxmox HA wesentlich umfangreicher als Keepalived. Außerdem müssen Storage, Quorum und Cluster-Kommunikation korrekt geplant werden.

### 4. Windows Server Failover Clustering

**Windows Server Failover Clustering (WSFC)** ist Microsofts Lösung für hochverfügbare Windows-Server-Workloads. Es eignet sich besonders für Microsoft-Infrastrukturen und kann beispielsweise zusammen mit Hyper-V oder SQL Server eingesetzt werden.

**Vorteile:** starke Integration in die Microsoft-/Windows-Server-Umgebung und Unterstützung komplexer Enterprise-Szenarien.

**Nachteile:** Windows-Server-Lizenzen werden benötigt und die Lösung ist wesentlich stärker an das Microsoft-Ökosystem gebunden.

### **Fazit**

Für ein **einfaches Failover-System mit zwei Linux-Servern** würde ich **Keepalived** wählen. Es konzentriert sich auf die wesentlichen Failover-Funktionen und ist dadurch einfacher einzurichten und zu verstehen. **Pacemaker + Corosync** bietet deutlich mehr Möglichkeiten für komplexe Cluster, benötigt aber auch mehr Konfigurationsaufwand. **Proxmox VE HA** eignet sich besonders, wenn komplette virtuelle Maschinen oder Container hochverfügbar sein sollen. **Windows Server Failover Clustering** ist vor allem für bestehende Microsoft-Infrastrukturen interessant.

**Quellen:** [Keepalived Dokumentation](https://www.keepalived.org/documentation/user-guide/) · [ClusterLabs Pacemaker-Dokumentation](https://clusterlabs.org/projects/pacemaker/doc/3.0/Clusters_from_Scratch/pdf/Clusters_from_Scratch.pdf) · [Proxmox VE HA-Dokumentation](https://github.com/proxmox/pve-docs/blob/master/ha-manager.adoc)

[1]: https://keepalived.org/documentation/user-guide/quick-start/ "Quick Start - Keepalived"
[2]: https://clusterlabs.org/projects/pacemaker/doc/3.0/Clusters_from_Scratch/pdf/Clusters_from_Scratch.pdf "Clusters from Scratch"
[3]: https://github.com/proxmox/pve-docs/blob/master/ha-manager.adoc "pve-docs/ha-manager.adoc at master · proxmox/pve-docs · GitHub"
