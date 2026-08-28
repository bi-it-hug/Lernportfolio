package ch.tbz.m450.util;

import ch.tbz.m450.repository.Address;

import java.util.Comparator;

public class AddressComparator implements Comparator<Address> {

    @Override
    public int compare(Address a1, Address a2) {
        if (a1 == a2) {
            return 0;
        }

        if (a1 == null) {
            return 1;
        }

        if (a2 == null) {
            return -1;
        }

        int lastNameResult = compareStrings(a1.getLastname(), a2.getLastname());
        if (lastNameResult != 0) {
            return lastNameResult;
        }

        int firstNameResult = compareStrings(a1.getFirstname(), a2.getFirstname());
        if (firstNameResult != 0) {
            return firstNameResult;
        }

        return Integer.compare(a1.getId(), a2.getId());
    }

    private int compareStrings(String left, String right) {
        if (left == right) {
            return 0;
        }

        if (left == null) {
            return 1;
        }

        if (right == null) {
            return -1;
        }

        return left.compareToIgnoreCase(right);
    }

}
