package ch.tbz.m450;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

@SpringBootTest
class AddressbookApplicationTest {

    private String[] defaultArgs;

    @BeforeEach
    void setUp() {
        defaultArgs = new String[]{"--spring.main.web-application-type=none"};
    }

    @Test
    void contextLoads() {
        // Spring Boot will throw if the context cannot be initialized
    }

    @Test
    void mainStartsApplication() {
        assertDoesNotThrow(() -> AddressbookApplication.main(defaultArgs));
    }
}
