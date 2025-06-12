> [!IMPORTANT]
> Noch nicht fertig

erste version:

```dockerfile
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8080

ENV REFCARD_THEME=dark

ENTRYPOINT ["java", "-jar", "app.jar"]
```
