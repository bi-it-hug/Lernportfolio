# Schnittstellen

## Merksätze für Use-Cases

### 1. **Dummy**

**Wann:** Wenn man nur ein Objekt braucht, damit der Code kompiliert oder eine Signatur passt, aber **das Objekt im Test keine Rolle spielt**.

**Merksatz:** „Ich brauche das Ding, aber ich check’s nicht.“
**Beispiel:** Methode braucht einen User, aber Test interessiert sich nicht für ihn.

### 2. **Stub**

**Wann:** Wenn man **bestimmte Rückgaben** braucht, um ein Test-Szenario zu kontrollieren.
**Merksatz:** „Sag mir, was ich zurückkriege, egal was du echt machst.“
**Beispiel:** Datenbank liefert immer denselben User, damit du Logik ohne echte DB testen kannst.

### 3. **Spy**

**Wann:** Wenn man prüfen will, **ob eine Methode aufgerufen wurde**, mit welchen Parametern und wie oft.
**Merksatz:** „Ich guck dir heimlich zu.“
**Beispiel:** Prüfen, ob `sendEmail()` wirklich aufgerufen wurde.

### 4. **Mock**

**Wann:** Wenn man **genaue Erwartungen** hat, also „diese Methode muss genau einmal mit diesen Parametern aufgerufen werden“.
**Merksatz:** „Tu genau, was ich dir sage, sonst FAIL!“
**Beispiel:** Dein Service muss beim Registrieren **eine E-Mail genau einmal** verschicken.

### 5. **Fake**

**Wann:** Wenn man eine **funktionierende, aber einfache Version** einer Abhängigkeit braucht.
**Merksatz:** „Ich will echte Logik, aber ohne echten Aufwand.“
**Beispiel:** In-Memory-Repository statt echte Datenbank.

---

### Faustregel

| Ziel im Test                                       | Double wählen |
| -------------------------------------------------- | ------------- |
| Parameter nur übergeben, keine Logik               | Dummy         |
| Rückgaben kontrollieren                            | Stub          |
| Aufrufe prüfen, aber echte Logik nutzen            | Spy           |
| Aufrufe prüfen, Erwartungen strikt                 | Mock          |
| Reale Logik testen, echte Implementierung zu teuer | Fake          |
