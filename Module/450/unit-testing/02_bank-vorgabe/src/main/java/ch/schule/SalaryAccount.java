package ch.schule;

/**
 * Lohnkonto.
 *
 * @author Roger H. J&ouml;rg
 * @version 1.0
 */
public class SalaryAccount extends Account {

    /**
     * Kreditlimite dieses Sparkontos. Bis zu diesem Betrag darf das Saldo
     * absinken, d.h. der Wert dieses Attributs ist normalerweise negativ.
     */
    private long creditLimit;

    /**
     * Erzeugt ein neues Lohnkonto.
     *
     * @param id die Kontonummer
     * @param creditLimit die Kreditlimite (eine negative Zahl!)
     */
    public SalaryAccount(String id, long creditLimit) {
        super(id);

        this.creditLimit = creditLimit;
    }

    /**
     * Hebt den gegebenen Betrag vom Konto ab.
     *
     * @param date das Transaktionsdatum
     * @param amount der abzuhebende Betrag
     *
     * @return boolean <code>true</code>, falls die Abhebung erfolgreich war,
     * andernfalls (z.B. bei negativem Betrag, oder nicht gen�gend Saldo)
     * <code>false</code>.
     */
    public boolean withdraw(int date, long amount) {
        long finalBalance = getBalance() - amount;

        if (finalBalance < creditLimit) {
            return false;
        }

        return super.withdraw(date, amount);
    }
}
