package ch.tbz.m450.repository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

class AddressTest {

    private Date registrationDate;
    private Address address;

    @BeforeEach
    void setUp() {
        registrationDate = new Date();
        address = new Address(10, "Nina", "Nussbaumer", "555-888", registrationDate);
    }

    @Test
    void allArgsConstructorStoresValues() {
        assertThat(address.getId()).isEqualTo(10);
        assertThat(address.getFirstname()).isEqualTo("Nina");
        assertThat(address.getLastname()).isEqualTo("Nussbaumer");
        assertThat(address.getPhonenumber()).isEqualTo("555-888");
        assertThat(address.getRegistrationDate()).isEqualTo(registrationDate);
    }

    @Test
    void settersUpdateFields() {
        Date newDate = new Date(registrationDate.getTime() + 1_000);

        address.setId(20);
        address.setFirstname("Lena");
        address.setLastname("Lanz");
        address.setPhonenumber("000-111");
        address.setRegistrationDate(newDate);

        assertThat(address.getId()).isEqualTo(20);
        assertThat(address.getFirstname()).isEqualTo("Lena");
        assertThat(address.getLastname()).isEqualTo("Lanz");
        assertThat(address.getPhonenumber()).isEqualTo("000-111");
        assertThat(address.getRegistrationDate()).isEqualTo(newDate);
    }

    @Test
    void noArgsConstructorCreatesEmptyAddress() {
        Address empty = new Address();

        assertThat(empty.getId()).isZero();
        assertThat(empty.getFirstname()).isNull();
        assertThat(empty.getLastname()).isNull();
        assertThat(empty.getPhonenumber()).isNull();
        assertThat(empty.getRegistrationDate()).isNull();
    }
}

