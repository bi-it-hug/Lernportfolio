# Lernjournal

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
