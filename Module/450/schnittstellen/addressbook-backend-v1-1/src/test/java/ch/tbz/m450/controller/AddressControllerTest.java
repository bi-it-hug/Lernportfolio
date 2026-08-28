package ch.tbz.m450.controller;

import ch.tbz.m450.repository.Address;
import ch.tbz.m450.service.AddressService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AddressControllerTest {

    @Mock
    private AddressService addressService;

    private AddressController addressController;
    private Address sampleAddress;
    private Address persistedAddress;

    @BeforeEach
    void setUp() {
        addressController = new AddressController(addressService);
        sampleAddress = new Address(1, "Max", "Muster", "555-111", new Date());
        persistedAddress = new Address(2, "Max", "Muster", "555-111", new Date());
    }

    @Test
    void createAddressReturnsCreatedStatus() {
        when(addressService.save(sampleAddress)).thenReturn(persistedAddress);

        ResponseEntity<Address> response = addressController.createAddress(sampleAddress);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isSameAs(persistedAddress);
        verify(addressService).save(sampleAddress);
    }

    @Test
    void getAddressesReturnsListFromService() {
        List<Address> addresses = List.of(sampleAddress);
        when(addressService.getAll()).thenReturn(addresses);

        ResponseEntity<List<Address>> response = addressController.getAddresses();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).containsExactlyElementsOf(addresses);
        verify(addressService).getAll();
    }

    @Test
    void getAddressesReturnsEmptyListWhenServiceHasNoEntries() {
        when(addressService.getAll()).thenReturn(List.of());

        ResponseEntity<List<Address>> response = addressController.getAddresses();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEmpty();
        verify(addressService).getAll();
    }

    @Test
    void getAddressReturnsAddressWhenPresent() {
        when(addressService.getAddress(1)).thenReturn(Optional.of(sampleAddress));

        ResponseEntity<Address> response = addressController.getAddress(1);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isSameAs(sampleAddress);
        verify(addressService).getAddress(1);
    }

    @Test
    void getAddressReturnsNotFoundWhenMissing() {
        when(addressService.getAddress(2)).thenReturn(Optional.empty());

        ResponseEntity<Address> response = addressController.getAddress(2);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isNull();
        verify(addressService).getAddress(2);
    }
}

