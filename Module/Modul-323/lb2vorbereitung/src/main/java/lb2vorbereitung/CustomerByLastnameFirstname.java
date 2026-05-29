package lb2vorbereitung;

import java.util.Comparator;

public class CustomerByLastnameFirstname implements Comparator<Customer> {

    @Override
    public int compare(Customer o1, Customer o2) {
        int lastNameCompare = o1.getLastName().compareTo(o2.getLastName());
        if (lastNameCompare != 0) {
            return lastNameCompare;
        }
        return o1.getFirstName().compareTo(o2.getFirstName());
    }
}
