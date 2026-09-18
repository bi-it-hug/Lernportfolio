# Probleme & Lösungen — Aufbau des GlusterFS-Clusters mit Vagrant

Dokumentation der Probleme, die beim Aufsetzen des 3-Node-GlusterFS-Clusters (inkl. Client-VM) mittels Vagrant + VirtualBox unter Windows aufgetreten sind, sowie die jeweiligen Lösungen.

**Umgebung:** Windows, VirtualBox, Vagrant, Repo `halkyon/glusterfs-vagrant`
**Cluster:** 3× `dev-gluster-0X` (Server) + 1× `dev-client-01` (Client)

---

## Problem 1: Host-Only-Network-Konflikt beim ersten `vagrant up`

**Fehlermeldung:**
```
A host only network interface you're attempting to configure via DHCP
already has a conflicting host only adapter with DHCP enabled...
```

**Ursache:**
VirtualBox unterscheidet zwischen dem Netzwerk-**Adapter** und dem zugehörigen **DHCP-Server-Objekt** — beide werden getrennt verwaltet. Obwohl der bestehende Host-Only-Adapter (`VirtualBox Host-Only Ethernet Adapter`) laut `VBoxManage list hostonlyifs` DHCP als *Disabled* auswies, existierte parallel dazu ein aktives, eigenständiges DHCP-Server-Objekt (`VBoxManage list dhcpservers` → `Enabled: Yes`) für dasselbe Netz (`192.168.56.0/24`). Dieser Widerspruch verhinderte, dass Vagrant das benötigte Host-Only-Netzwerk sauber anlegen konnte.

**Lösung:**
Verwaisten DHCP-Server-Eintrag entfernen:
```powershell
& "C:\Program Files\Oracle\VirtualBox\VBoxManage.exe" dhcpserver remove --netname "HostInterfaceNetworking-VirtualBox Host-Only Ethernet Adapter"
```

**Diagnosebefehle, die zur Ursachenfindung genutzt wurden:**
```powershell
& "C:\Program Files\Oracle\VirtualBox\VBoxManage.exe" list hostonlyifs
& "C:\Program Files\Oracle\VirtualBox\VBoxManage.exe" list dhcpservers
```

---

## Problem 2: SSH-Timeout während der Provisionierung ("timeout during server version negotiating")

**Fehlermeldung:**
```
An error occurred in the underlying SSH library that Vagrant uses.
...
timeout during server version negotiating
```

**Ursache:**
Die betroffene VM war zu diesem Zeitpunkt der **erste** SSH-Connect an diesen Host/Port (`127.0.0.1:2222`), es existierte also noch kein Eintrag in der lokalen `known_hosts`-Datei. Ein interaktives SSH-Terminal fragt in diesem Fall nach Bestätigung des Host-Key-Fingerprints (`Are you sure you want to continue connecting (yes/no)?`). Vagrants interne Ruby-SSH-Bibliothek (`net-ssh`) kann auf diese interaktive Abfrage jedoch nicht reagieren und läuft stattdessen in einen Timeout, obwohl SSH-Port und Authentifizierung eigentlich funktionsfähig waren.

**Diagnose-Vorgehen:**
1. Geprüft, ob der SSH-Port vom Host aus überhaupt erreichbar ist:
   ```powershell
   Test-NetConnection -ComputerName 127.0.0.1 -Port 2222
   ```
   → Ergebnis: `TcpTestSucceeded: True` (Port war offen, Problem lag also nicht am Netzwerk/an der Firewall)

2. Geprüft, ob der SSH-Daemon in der VM überhaupt lauscht (direkt in der VM-Konsole über VirtualBox-GUI eingeloggt):
   ```bash
   sudo systemctl status ssh
   ss -tlnp | grep :22
   ```
   → SSH lief korrekt auf `0.0.0.0:22`

3. Manueller SSH-Verbindungsversuch vom Host aus mit dem von Vagrant erwarteten Private Key:
   ```powershell
   vagrant ssh-config dev-gluster-01
   ssh -i <IdentityFile-Pfad> vagrant@127.0.0.1 -p 2222
   ```
   → Verbindung erfolgreich nach manueller Bestätigung des Host-Key-Fingerprints mit `yes`

**Lösung:**
Im `Vagrantfile` die Host-Key-Prüfung global deaktivieren, damit `net-ssh` nicht mehr auf eine interaktive Bestätigung wartet:
```ruby
config.ssh.insert_key = false
config.ssh.verify_host_key = false
```

---

## Problem 3: Boot-Timeout bei paralleler VM-Ausführung ("Timed out while waiting for the machine to boot")

**Fehlermeldung:**
```
Timed out while waiting for the machine to boot. This means that
Vagrant was unable to communicate with the guest machine within
the configured ("config.vm.boot_timeout" value) time period.
```

**Ursache:**
Alle vier VMs (3× Server, 1× Client) sind mit `vagrant up` standardmässig parallel gestartet worden. Jede Server-VM ist mit 2 CPUs und 2048 MB RAM konfiguriert — bei gleichzeitigem Boot mehrerer VMs auf einem Host mit begrenzten Ressourcen (CPU/RAM/Disk-I/O) verlangsamt sich der Boot-Vorgang einzelner VMs so stark, dass Vagrants Standard-Boot-Timeout (default: 300 Sekunden) überschritten wird, bevor die VM überhaupt bereit für eine SSH-Verbindung ist.

**Lösung:**
1. Betroffene VM erneut einzeln hochfahren (VM war nach Timeout meist schon fast bereit):
   ```powershell
   vagrant up dev-gluster-03
   ```
2. Zusätzlich präventiv den Boot-Timeout im Vagrantfile grosszügiger gesetzt, um erneute Timeouts bei parallelem Start zu vermeiden:
   ```ruby
   config.vm.boot_timeout = 600
   ```

**Empfehlung für zukünftige Durchläufe:** VMs bei knappen Host-Ressourcen einzeln statt parallel starten (`vagrant up <name>` statt `vagrant up`), um Ressourcenkonkurrenz beim Boot von vornherein zu vermeiden.

---

## Zusammenfassung der finalen Vagrantfile-Anpassungen

Folgende Zeilen wurden im `Vagrant.configure`-Block ergänzt, um die oben beschriebenen Probleme zu beheben:

```ruby
Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  servers.each do |hostname, server|
    config.ssh.insert_key = false
    config.ssh.verify_host_key = false
    config.vm.boot_timeout = 600
    config.vm.define hostname do |cfg|
      # ...
```

---

## Nützliche Diagnosebefehle (Referenz)

| Zweck | Befehl |
|---|---|
| Host-Only-Adapter auflisten | `VBoxManage list hostonlyifs` |
| DHCP-Server auflisten | `VBoxManage list dhcpservers` |
| DHCP-Server entfernen | `VBoxManage dhcpserver remove --netname <Name>` |
| SSH-Port-Erreichbarkeit testen | `Test-NetConnection -ComputerName 127.0.0.1 -Port <Port>` |
| SSH-Konfiguration einer VM anzeigen | `vagrant ssh-config <vm-name>` |
| Verbose SSH-Debug | `ssh -vvv -i <key> vagrant@127.0.0.1 -p <port>` |
| SSH-Status in der VM prüfen | `sudo systemctl status ssh` |
| Lauschende Ports in der VM prüfen | `ss -tlnp \| grep :22` |
