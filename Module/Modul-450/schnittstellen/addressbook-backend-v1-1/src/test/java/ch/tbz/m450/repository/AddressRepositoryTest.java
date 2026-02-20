package ch.tbz.m450.repository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Date;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class AddressRepositoryTest {

    @Autowired
    private AddressRepository addressRepository;

    private Address persistedAddress;

    @BeforeEach
    void setUp() {
        addressRepository.deleteAll();
        persistedAddress = addressRepository.save(new Address(7, "Peter", "Portmann", "555-444", new Date()));
    }

    @Test
    void findByIdReturnsPersistedEntity() {
        Optional<Address> found = addressRepository.findById(persistedAddress.getId());

        assertThat(found).contains(persistedAddress);
    }

    @Test
    void findAllReturnsEntitiesFromDatabase() {
        assertThat(addressRepository.findAll()).containsExactly(persistedAddress);
    }

    @Test
    void deleteByIdRemovesEntity() {
        addressRepository.deleteById(persistedAddress.getId());

        assertThat(addressRepository.findAll()).isEmpty();
        assertThat(addressRepository.findById(persistedAddress.getId())).isEmpty();
    }
}

