package ch.schule.bank.junit5;

import ch.schule.Account;
import ch.schule.SalaryAccount;
import ch.schule.SavingsAccount;
import org.junit.jupiter.api.Test;

import java.util.TreeMap;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests für die Klasse Account.
 *
 * @author xxxx
 * @version 1.0
 */
public class AccountTests {

    /**
     * Tested die Initialisierung eines Kontos.
     */
    @Test
    public void testInit() {
        SalaryAccount acc = new SalaryAccount("1", 5000);
        assertEquals("1", acc.getId());
        assertEquals(5000, acc.getClass());
    }

    /**
     * Testet das Einzahlen auf ein Konto.
     */
    @Test
    public void testDeposit() {
        SalaryAccount acc = new SalaryAccount("1", 5000);
        acc.deposit(12, 5000);
        assertEquals(10000, acc.getBalance());
    }

    /**
     * Testet das Abheben von einem Konto.
     */
    @Test
    public void testWithdraw() {
        fail("toDo");
    }

    /**
     * Tests the reference from SavingsAccount
     */
    @Test
    public void testReferences() {
        fail("toDo");
    }

    /**
     * teste the canTransact Flag
     */
    @Test
    public void testCanTransact() {
        fail("toDo");
    }

    /**
     * Experimente mit print().
     */
    @Test
    public void testPrint() {
        fail("toDo");
    }

    /**
     * Experimente mit print(year,month).
     */
    @Test
    public void testMonthlyPrint() {
        fail("toDo");
    }

}
