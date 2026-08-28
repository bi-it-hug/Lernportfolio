package ch.tbz.m450.service;

import ch.tbz.m450.repository.Address;
import ch.tbz.m450.repository.AddressRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AddressServiceTest {

    @Mock
    private AddressRepository addressRepository;

    private AddressService addressService;
    private Address alice;
    private Address bob;

    @BeforeEach
    void setUp() {
        addressService = new AddressService(addressRepository);
        alice = new Address(2, "Alice", "Wonderland", "555-333", new Date());
        bob = new Address(1, "Bob", "Builder", "555-222", new Date());
    }

    @Test
    void saveDelegatesToRepository() {
        when(addressRepository.save(alice)).thenReturn(alice);

        Address stored = addressService.save(alice);

        assertThat(stored).isSameAs(alice);
        verify(addressRepository).save(alice);
    }

    @Test
    void getAllReturnsComparatorSortedList() {
        when(addressRepository.findAll()).thenReturn(List.of(alice, bob));

        List<Address> result = addressService.getAll();

        assertThat(result).containsExactly(bob, alice);
        verify(addressRepository).findAll();
    }

    @Test
    void getAddressReturnsRepositoryValue() {
        when(addressRepository.findById(99)).thenReturn(Optional.of(bob));

        Optional<Address> result = addressService.getAddress(99);

        assertThat(result).contains(bob);
        verify(addressRepository).findById(99);
    }

    @Test
    void getAddressReturnsEmptyWhenRepositoryMissesEntry() {
        when(addressRepository.findById(123)).thenReturn(Optional.empty());

        Optional<Address> result = addressService.getAddress(123);

        assertThat(result).isEmpty();
        verify(addressRepository).findById(123);
    }
}
