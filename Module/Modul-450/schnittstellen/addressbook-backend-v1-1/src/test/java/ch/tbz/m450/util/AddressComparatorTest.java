package ch.tbz.m450.util;

import ch.tbz.m450.repository.Address;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

class AddressComparatorTest {

    private AddressComparator comparator;
    private Address anna;
    private Address zoe;

    @BeforeEach
    void setUp() {
        comparator = new AddressComparator();
        anna = new Address(2, "Anna", "Baumann", "111", new Date());
        zoe = new Address(5, "Zoe", "Zimmermann", "999", new Date());
    }

    @Test
    void compareOrdersByLastNameThenFirstName() {
        Address secondAnna = new Address(3, "Anna", "Zimmermann", "112", new Date());

        assertThat(comparator.compare(anna, zoe)).isNegative();
        assertThat(comparator.compare(zoe, anna)).isPositive();
        assertThat(comparator.compare(zoe, secondAnna)).isPositive();
    }

    @Test
    void compareFallsBackToIdWhenNamesMatch() {
        Address annaDuplicate = new Address(1, "Anna", "Baumann", "111", new Date());

        assertThat(comparator.compare(annaDuplicate, anna)).isNegative();
        assertThat(comparator.compare(anna, annaDuplicate)).isPositive();
    }

    @Test
    void compareHandlesNullValues() {
        assertThat(comparator.compare(null, null)).isZero();
        assertThat(comparator.compare(null, anna)).isPositive();
        assertThat(comparator.compare(anna, null)).isNegative();
    }
}

