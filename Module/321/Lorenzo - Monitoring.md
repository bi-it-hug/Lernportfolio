# Vergleiche

## Monitoring

### Vergleich von Monitoring-Softwarelösungen

| Kriterium                | **Prometheus**                      | **Zabbix**                          | **Nagios Core**                             | **Grafana**                                             |
| ------------------------ | ----------------------------------- | ----------------------------------- | ------------------------------------------- | ------------------------------------------------------- |
| **Hauptzweck**           | Metriken und Time-Series-Monitoring | Komplettes Infrastruktur-Monitoring | Hosts, Dienste und Netzwerke überwachen     | Visualisierung und Analyse von Monitoring-Daten         |
| **Open Source**          |                                     |                                     |                                             | Core                                                    |
| **Weboberfläche**        | Einfach                             | Umfangreich                         | Einfach                                     | Sehr umfangreich                                        |
| **Dashboards**           | Grundlegend                         | Integriert                          | Grundlegend                                 | Sehr umfangreich                                        |
| **Alerting**             | Mit Alertmanager                    | Integriert                          | Integriert                                  | Integriert                                              |
| **Historische Daten**    | Time-Series-Datenbank               | Datenbank                           | Performance-Daten häufig über Erweiterungen | Daten liegen normalerweise in angebundenen Datenquellen |
| **Agent erforderlich**   | Nicht zwingend, häufig Exporter     | Agent oder agentless                | Plugins/Agents je nach Ziel                 |                                                         |
| **SNMP**                 | Über Exporter                       | Integriert                          | Über Plugins                                | Über Datenquelle                                        |
| **Netzwerk-Monitoring**  |                                     |                                     |                                             | Primär Visualisierung                                   |
| **Server-Monitoring**    |                                     |                                     |                                             | Benötigt Datenquelle                                    |
| **Container/Kubernetes** | Sehr gut geeignet                   |                                     | Möglich                                     | Sehr gute Visualisierung entsprechender Daten           |
| **Erweiterbarkeit**      | Exporter                            | Templates/API                       | Sehr viele Plugins                          | Plugins und Datenquellen                                |
| **Einrichtung**          | Mittel                              | Mittel                              | Eher aufwendig                              | Einfach bis mittel                                      |
| **Typischer Einsatz**    | Cloud, Container, Anwendungen       | Server- und Netzwerkinfrastruktur   | Klassisches IT-/Netzwerk-Monitoring         | Dashboards und Visualisierung                           |

### 1. Prometheus

[Prometheus](https://prometheus.io/) ist ein Open-Source-System für **Monitoring und Alerting**. Es sammelt Messwerte und speichert diese als **Zeitreihen**, also beispielsweise:

```text
cpu_usage       34 %
memory_usage    71 %
http_requests   1254
response_time   43 ms
```

Eine besondere Stärke liegt beim Monitoring moderner Anwendungen, Microservices und Container-Infrastrukturen. Für Benachrichtigungen wird üblicherweise **Alertmanager** eingesetzt. Dieser kann Alerts gruppieren, unterdrücken und beispielsweise an E-Mail- oder Chat-Systeme weiterleiten. ([Prometheus][1])

**Vorteile:** Sehr gut für Metriken und Zeitreihen geeignet, leistungsfähige Abfragesprache, starke Integration in Cloud-/Container-Umgebungen und große Auswahl an Exportern.

**Nachteile:** Für ein vollständiges Monitoring-System benötigt man häufig zusätzliche Komponenten. Für besonders schöne Dashboards wird Prometheus deshalb beispielsweise oft mit Grafana kombiniert.

---

### 2. Zabbix

[Zabbix](https://www.zabbix.com/) ist eher das **Schweizer Taschenmesser** unter diesen Lösungen. Es bringt sehr viele Monitoring-Funktionen direkt mit.

Zabbix unterstützt unter anderem SNMP, IPMI, JMX, VMware, eigene Checks sowie Agents für Linux und Windows. Dazu kommen integrierte Graphen, Dashboards, historische Daten, Discovery, Templates und ein umfangreiches Alerting-System. ([Zabbix][2])

**Vorteile:** Sehr umfangreiches Komplettpaket, integrierte Weboberfläche, automatische Discovery, Netzwerk- und Server-Monitoring sowie flexibles Alerting.

**Nachteile:** Durch den großen Funktionsumfang ist Zabbix komplexer als eine kleine spezialisierte Lösung. Für eine winzige Umgebung können die Einrichtung und Administration unnötig umfangreich sein.

---

### 3. Nagios Core

[Nagios Core](https://www.nagios.org/projects/nagios-core/) ist eine klassische Open-Source-Monitoring-Lösung für **Server, Netzwerkgeräte, Anwendungen und Dienste**.

Nagios arbeitet stark mit **Plugins**. Ein Plugin führt einen bestimmten Check aus und meldet anschließend beispielsweise:

```text
OK
WARNING
CRITICAL
UNKNOWN
```

Dadurch kann Nagios sehr flexibel erweitert werden. Es gibt Checks für CPU, Arbeitsspeicher, Festplatten, HTTP, SSH, Datenbanken, Netzwerkgeräte und vieles mehr. Eigene Plugins können ebenfalls geschrieben werden. ([Nagios Open Source][3])

**Vorteile:** Sehr flexibel, kostenlos, lange etabliert und durch die Plugin-Architektur auf sehr viele Systeme erweiterbar.

**Nachteile:** Viele Funktionen hängen von Plugins oder zusätzlichen Komponenten ab. Die Oberfläche und Konfiguration von Nagios Core wirken im Vergleich zu moderneren Komplettlösungen eher technisch. Nagios selbst weist beispielsweise darauf hin, dass die eigentlichen Checks von externen Plugins durchgeführt werden. ([Nagios Enterprises][4])

---

### 4. Grafana

[Grafana](https://grafana.com/) ist der kleine Sonderling im Vergleich. Grafana ist hauptsächlich für die **Visualisierung und Analyse** von Daten gedacht.

Grafana kann Daten aus verschiedenen Quellen darstellen, beispielsweise:

```text
Prometheus ─┐
InfluxDB ───┤
MySQL ──────┼──► Grafana ──► Dashboard
PostgreSQL ─┤
Loki ───────┘
```

Grafana ersetzt daher nicht unbedingt Prometheus oder Zabbix. Häufig wird es **zusammen mit einer Monitoring-Datenquelle** eingesetzt.

**Vorteile:** Sehr gute und flexible Dashboards, zahlreiche Datenquellen und besonders für die Visualisierung von Zeitreihen geeignet.

**Nachteile:** Grafana allein sammelt nicht automatisch sämtliche Systemmetriken. Für ein vollständiges Monitoring benötigt es entsprechende Datenquellen bzw. weitere Komponenten.

---

### Fazit

Für ein klassisches **Server- und Netzwerk-Monitoring** würde ich **Zabbix** als besonders vollständige Lösung einstufen. Viele benötigte Funktionen sind bereits integriert.

**Prometheus** eignet sich besonders für moderne Anwendungen, Container und das Sammeln großer Mengen von Metriken. Zusammen mit **Grafana** entsteht eine sehr leistungsfähige Kombination für Monitoring und Visualisierung.

**Nagios Core** eignet sich gut für klassisches Host- und Service-Monitoring und ist durch seine Plugins extrem flexibel, erfordert dafür aber teilweise mehr Konfigurationsarbeit. ([Nagios Open Source][5])

[1]: https://prometheus.io/docs/introduction/overview/ "Overview | Prometheus"
[2]: https://www.zabbix.com/documentation/7.4/en/manual/introduction/features "3 Zabbix features"
[3]: https://www.nagios.org/projects/nagios-core/features/ "Features | Nagios Open Source"
[4]: https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/4/en/plugins.html "Nagios Plugins · Nagios Core Documentation"
[5]: https://www.nagios.org/projects/nagios-core/ "Nagios Core | The #1 Open Source Monitoring Solution | Nagios Open Source"
****