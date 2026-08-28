package lb2vorbereitung;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class Main {

    public static void main(String[] args) {
        List<Customer> customers = createCustomers();

        printSection("1) Daten bereitstellen und ausgeben");
        customers.forEach(System.out::println);

        printSection("1 Zusatz) Nur die ersten 10 Eintraege per Stream");
        customers.stream().limit(10).forEach(System.out::println);

        printSection("2) Sortieren mit eigener Comparator-Klasse (Nachname, Vorname)");
        List<Customer> byClass = copy(customers);
        byClass.sort(new CustomerByLastnameFirstname());
        byClass.forEach(System.out::println);

        printSection("3) Sortieren mit anonymer Klasse (Nachname, Vorname)");
        List<Customer> byAnonymous = copy(customers);
        byAnonymous.sort(new Comparator<Customer>() {
            @Override
            public int compare(Customer o1, Customer o2) {
                int lastNameCompare = o1.getLastName().compareTo(o2.getLastName());
                if (lastNameCompare != 0) {
                    return lastNameCompare;
                }
                return o1.getFirstName().compareTo(o2.getFirstName());
            }
        });
        byAnonymous.forEach(System.out::println);

        printSection("4) Sortieren mit Lambda Expression (Nachname, Vorname)");
        List<Customer> byLambda = copy(customers);
        byLambda.sort((o1, o2) -> {
            int lastNameCompare = o1.getLastName().compareTo(o2.getLastName());
            if (lastNameCompare != 0) {
                return lastNameCompare;
            }
            return o1.getFirstName().compareTo(o2.getFirstName());
        });
        byLambda.forEach(System.out::println);

        printSection("5) Sortieren mit Comparator-Chain (Nachname, Vorname)");
        List<Customer> byChain = copy(customers);
        byChain.sort(
                Comparator.comparing(Customer::getLastName)
                        .thenComparing(Customer::getFirstName));
        byChain.forEach(System.out::println);

        printSection("6) Natuerliche Ordnung mit Comparator.naturalOrder()");
        List<Customer> byNaturalOrder = copy(customers);
        byNaturalOrder.sort(Comparator.naturalOrder());
        byNaturalOrder.forEach(System.out::println);

        printSection("7) Reverse Sortierung mit reversed()");
        List<Customer> byReversed = copy(customers);
        byReversed.sort(Comparator.<Customer>naturalOrder().reversed());
        byReversed.forEach(System.out::println);

        printSection("8a) Nachname + Geburtsdatum (aelter -> juenger) mit eigener compare-Logik");
        List<Customer> byLastnameBirthdateManual = copy(customers);
        byLastnameBirthdateManual.sort((o1, o2) -> {
            int lastNameCompare = o1.getLastName().compareTo(o2.getLastName());
            if (lastNameCompare != 0) {
                return lastNameCompare;
            }
            return o1.getBirthdate().compareTo(o2.getBirthdate());
        });
        byLastnameBirthdateManual.forEach(System.out::println);

        printSection("8b) Nachname + Geburtsdatum (aelter -> juenger) mit Comparator-Chain");
        List<Customer> byLastnameBirthdateChain = copy(customers);
        byLastnameBirthdateChain.sort(Customer.BY_LASTNAME_BIRTHDATE_CHAIN);
        byLastnameBirthdateChain.forEach(System.out::println);

        printSection("9a) Nachname + Geburtsdatum (juenger -> aelter) - FALSCH mit .reversed() auf ganzer Chain");
        List<Customer> wrongYoungestFirst = copy(customers);
        wrongYoungestFirst.sort(Customer.BY_LASTNAME_BIRTHDATE_CHAIN.reversed());
        wrongYoungestFirst.forEach(System.out::println);
        System.out.println("Erklaerung: reversed() kehrt die gesamte Sortierung um, nicht nur das Geburtsdatum.");

        printSection("9b) Nachname + Geburtsdatum (juenger -> aelter) - OHNE Chain (manuell)");
        List<Customer> youngestFirstManual = copy(customers);
        youngestFirstManual.sort((o1, o2) -> {
            int lastNameCompare = o1.getLastName().compareTo(o2.getLastName());
            if (lastNameCompare != 0) {
                return lastNameCompare;
            }
            return o2.getBirthdate().compareTo(o1.getBirthdate());
        });
        youngestFirstManual.forEach(System.out::println);

        printSection(
                "9c) Nachname + Geburtsdatum (juenger -> aelter) - MIT Chain und reverseOrder() nur fuer birthdate");
        List<Customer> youngestFirstChain = copy(customers);
        youngestFirstChain.sort(Customer.BY_LASTNAME_BIRTHDATE_YOUNGEST_FIRST);
        youngestFirstChain.forEach(System.out::println);

        printSection("10a) Wiederverwendung: statisches Attribut mit anonymer Klasse");
        List<Customer> byStaticAnonymous = copy(customers);
        byStaticAnonymous.sort(Customer.BY_LASTNAME_BIRTHDATE_ANONYMOUS);
        byStaticAnonymous.forEach(System.out::println);

        printSection("10b) Wiederverwendung: statisches Attribut mit Lambda");
        List<Customer> byStaticLambda = copy(customers);
        byStaticLambda.sort(Customer.BY_LASTNAME_BIRTHDATE_LAMBDA);
        byStaticLambda.forEach(System.out::println);

        printSection("10c) Wiederverwendung: statisches Attribut mit Comparator-Chain");
        List<Customer> byStaticChain = copy(customers);
        byStaticChain.sort(Customer.BY_LASTNAME_BIRTHDATE_CHAIN);
        byStaticChain.forEach(System.out::println);

        printSection("11) Vertiefung: Stream-Sortierung ohne Original-Liste zu veraendern");
        List<Customer> streamSorted = customers.stream()
                .sorted(new CustomerByLastnameFirstname())
                .collect(Collectors.toList());
        System.out.println("Original unveraendert (erster Eintrag): " + customers.get(0));
        System.out.println("Neue sortierte Liste:");
        streamSorted.forEach(System.out::println);

        printSection("11 Zusatz) Weitere Comparator-Beispiele aus dem Artikel");
        List<String> names = List.of("anna", "Zoe", "bert");
        List<String> caseInsensitive = new ArrayList<>(names);
        caseInsensitive.sort(String.CASE_INSENSITIVE_ORDER);
        System.out.println("CASE_INSENSITIVE_ORDER: " + caseInsensitive);

        List<String> natural = new ArrayList<>(names);
        natural.sort(Comparator.naturalOrder());
        System.out.println("naturalOrder: " + natural);
    }

    private static List<Customer> createCustomers() {
        List<Customer> customers = new ArrayList<>();
        customers.add(new Customer("Anna", "Meier", date(1988, 3, 12), "079 111 11 11"));
        customers.add(new Customer("Max", "Muster", date(1990, 7, 20), "079 222 22 22"));
        customers.add(new Customer("Lara", "Muster", date(1995, 1, 5), "079 333 33 33"));
        customers.add(new Customer("Tom", "Knacknuss", date(2002, 8, 30), "079 444 44 44"));
        customers.add(new Customer("Eva", "Knacknuss", date(1998, 4, 18), "079 555 55 55"));
        customers.add(new Customer("Ben", "Knacknuss", date(2005, 11, 2), "079 666 66 66"));
        customers.add(new Customer("Sara", "Huber", date(1985, 9, 9), "079 777 77 77"));
        customers.add(new Customer("Noah", "Huber", date(1992, 2, 14), "079 888 88 88"));
        customers.add(new Customer("Mia", "Zimmermann", date(2000, 6, 1), "079 999 99 99"));
        customers.add(new Customer("Leo", "Zimmermann", date(1997, 12, 24), "079 000 00 00"));
        customers.add(new Customer("Emma", "Baumann", date(1993, 10, 10), "078 101 01 01"));
        customers.add(new Customer("Luca", "Baumann", date(1991, 5, 3), "078 202 02 02"));
        customers.add(new Customer("Nina", "Fischer", date(1989, 8, 8), "078 303 03 03"));
        customers.add(new Customer("Jan", "Fischer", date(1994, 3, 21), "078 404 04 04"));
        customers.add(new Customer("Tim", "Wagner", date(1987, 7, 7), "078 505 05 05"));
        return customers;
    }

    private static Date date(int year, int month, int day) {
        return Date.from(LocalDate.of(year, month, day)
                .atStartOfDay(ZoneId.systemDefault())
                .toInstant());
    }

    private static List<Customer> copy(List<Customer> source) {
        return new ArrayList<>(source);
    }

    private static void printSection(String title) {
        System.out.println();
        System.out.println("=== " + title + " ===");
    }
}
