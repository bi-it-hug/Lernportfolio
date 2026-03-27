# Lernjournal

## 2026-03-06

### Rekursion

In diesem Beispiel ist ein Code der den grössten gemeinsamen Teiler zweier Zahlen berechnet:

```python
def calculate(a, b):
    if b == 0:
        return a
    return calculate(b, a % b)


a = 18
b = 60
result = calculate(a, b)

print(f"Der größte gemeinsame Teiler von {a} und {b} ist {result}!")
```

---

## 2026-02-20

### Rekursion

- **Indirekt**: Eine Methode, die eine andere Methode aufruft, welche wiederum die erste Methode aufruft.

```java
public class Main {
    public static void main(String[] args) {
        test1(10);
    }

    public static void test1(int n) {
        if (n <= 0) return;
        System.out.println("test1: " + n);
        test2(n - 1);
    }

    public static void test2(int n) {
        if (n <= 0) return;
        System.out.println("test2: " + n);
        test1(n - 1);
    }
}
```

- **Direkt**: Eine Methode, die sich selbst aufruft.

```java
public class Main {
    public static void main(String[] args) {
        test(10);
    }

    public static void test(int n) {
        if (n <= 0) return;
        System.out.println(n);
        test(n - 1);
    }
}
```
