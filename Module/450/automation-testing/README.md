# Automation Testing

## Testing-Tools und -Ausführung

### Backend (Spring Boot / Java)

- **JUnit 5 (JUnit Jupiter)**: Test-Framework für Unit- und MVC-Tests
- **Spring Boot Test**: `@WebMvcTest`, `MockMvc` für Controller-Tests ohne vollständigen Kontext
- **Mockito**: Mocking von Abhängigkeiten (`@MockBean`, `given(...)`/`verify(...)`)
- **AssertJ**: Ausdrückliche Assertions (`assertThat(...)`)

Tests liegen unter `spring-boot-angular-basic-lw2/src/test/java/...`.

Ausführen (aus dem Ordner `spring-boot-angular-basic-lw2`):

```bash
mvn test
```

Berichte werden unter `spring-boot-angular-basic-lw2/target/surefire-reports` erzeugt.

### Frontend (Angular)

- **Karma**: Test-Runner (Browser-basiert)
- **Jasmine**: Test-Framework für Spezifikationen (`*.spec.ts`)
- **Angular CLI**: Build- und Test-Kommandos (`ng test`)

Konfiguration/Abhängigkeiten: `spring-boot-angular-basic-lw2/src/main/js/my-app/package.json` und `angular.json`.
Tests liegen unter `spring-boot-angular-basic-lw2/src/main/js/my-app/src/**/*.spec.ts`.

Ausführen (aus dem Ordner `spring-boot-angular-basic-lw2/src/main/js/my-app`):

```bash
npm test
# oder
npx ng test
```

Coverage (optional):

```bash
npx ng test --code-coverage
```

Die Coverage-Ausgabe befindet sich anschließend im Ordner `coverage/` des Angular-Projekts.
