### **1. Docker Networks**

Docker-Compose nutzt standardmässig ein isoliertes Bridge-Netzwerk. Es gibt jedoch mehrere Netzwerk-Optionen:

- **Standard-Netzwerk**: Automatisch erstelltes Bridge-Netzwerk ohne spezielle Konfiguration.
- **Benutzerdefinierte Netzwerke**: Ermöglichen direkte Kommunikation zwischen Containern ohne Portfreigaben. Diese können im `networks` Abschnitt definiert werden.
- **Externe Netzwerke**: Können genutzt werden, um z. B. Container aus verschiedenen Projekten zu verbinden.

Beispiel:

```yaml
version: "3"
services:
    web:
        image: nginx
        networks:
            - my_network
    db:
        image: mysql
        networks:
            - my_network
        environment:
            MYSQL_ROOT_PASSWORD: example
networks:
    my_network:
        driver: bridge
```

- **Kommunikation**: Container können sich über die Servicenamen im Netzwerk ansprechen.
- **Vermeidung externer Ports**: Interner Netzwerkzugriff macht viele externe Portfreigaben überflüssig.
- **Nützliche Befehle**:

    - `docker network ls` – listet alle Netzwerke
    - `docker network inspect <name>` – zeigt Details zu einem Netzwerk
    - `docker inspect <container>` – zeigt u.a. Netzwerkdetails eines Containers

---

### **2. Docker Volumes**

Volumes dienen zur **dauerhaften Datenspeicherung** unabhängig vom Container-Lifecycle.

- **Definition in Docker Compose**:

```yaml
version: "3"
services:
    web:
        image: nginx
        volumes:
            - my_volume:/usr/share/nginx/html
volumes:
    my_volume:
```

- Daten im Volume bleiben erhalten, auch wenn der Container gelöscht wird.
- Volumes können von mehreren Containern gleichzeitig genutzt werden (für geteilte Daten).
- **Nützliche Befehle**:

    - `docker volume ls` – zeigt alle Volumes
    - `docker inspect <container>` – zeigt, welche Volumes ein Container nutzt
