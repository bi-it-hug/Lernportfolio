package ch.schule.bank.junit5;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;
import ch.schule.Calculator;

public class CalculatorTests {

    @Test
    public void testAdd() {
        Calculator calc = new Calculator();
        double result = calc.add(2, 3);
        assertEquals(5, result, "2 + 3 sollte 5 ergeben");
    }

    @Test
    public void testSubtract() {
        Calculator calc = new Calculator();
        double result = calc.subtract(14, 5);
        assertEquals(9, result, "14 - 5 sollte 9 ergeben");
    }

    @Test
    public void testMultiply() {
        Calculator calc = new Calculator();
        double result = calc.multiply(3, 5);
        assertEquals(15, result, "3 * 5 sollte 15 ergeben");
    }

    @Test
    public void testDivide() {
        Calculator calc = new Calculator();
        double result = calc.divide(20, 4);
        assertEquals(5, result, "20 / 4 sollte 5 ergeben");
    }
}
