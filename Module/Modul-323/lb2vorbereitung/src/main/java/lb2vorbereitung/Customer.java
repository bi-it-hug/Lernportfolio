package lb2vorbereitung;

import java.util.Comparator;
import java.util.Date;
import lombok.Value;

@Value
public class Customer implements Comparable<Customer> {

    private String firstName;
    private String lastName;
    private Date birthdate;
    private String phone;

    @Override
    public int compareTo(Customer other) {
        int lastNameCompare = lastName.compareTo(other.lastName);
        if (lastNameCompare != 0) {
            return lastNameCompare;
        }
        return firstName.compareTo(other.firstName);
    }

    public static final Comparator<Customer> BY_LASTNAME_BIRTHDATE_ANONYMOUS = new Comparator<Customer>() {
        @Override
        public int compare(Customer o1, Customer o2) {
            int lastNameCompare = o1.getLastName().compareTo(o2.getLastName());
            if (lastNameCompare != 0) {
                return lastNameCompare;
            }
            return o1.getBirthdate().compareTo(o2.getBirthdate());
        }
    };

    public static final Comparator<Customer> BY_LASTNAME_BIRTHDATE_LAMBDA = (o1, o2) -> {
        int lastNameCompare = o1.getLastName().compareTo(o2.getLastName());
        if (lastNameCompare != 0) {
            return lastNameCompare;
        }
        return o1.getBirthdate().compareTo(o2.getBirthdate());
    };

    public static final Comparator<Customer> BY_LASTNAME_BIRTHDATE_CHAIN = Comparator.comparing(Customer::getLastName)
            .thenComparing(Customer::getBirthdate);

    public static final Comparator<Customer> BY_LASTNAME_BIRTHDATE_YOUNGEST_FIRST = Comparator
            .comparing(Customer::getLastName)
            .thenComparing(Customer::getBirthdate, Comparator.reverseOrder());
}
