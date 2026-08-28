package ch.schule;

/**
 * Buchung.
 *
 * @author Roger H. J&ouml;rg
 * @version 1.0
 */
public class Booking {

    /**
     * Datum der Transaktion (Banktage seit 1.1.1970).
     *
     * @uml.property name="date"
     */
    private int date;

    /**
     * Transaktionsbetrag (Millirappen).
     *
     * @uml.property name="amount"
     */
    private long amount;

    /**
     * Erzeugt eine neue Buchung
     *
     * @param date int Datum der Transaktion (Banktage seit 1.1.1970)
     * @param amount long Transaktionsbetrag (Millirappen)
     */
    public Booking(int date, long amount) {
        this.date = date;
        this.amount = amount;
    }

    /**
     * Gibt das Datum der Buchung zur�ck.
     *
     * @return int Datum (Banktage seit 1.1.1970)
     * @uml.property name="date"
     */
    public int getDate() {
        return date;
    }

    /**
     * Gibt den Betrag zur�ck.
     *
     * @return long Betrag (in Millirappen)
     * @uml.property name="amount"
     */
    public long getAmount() {
        return amount;
    }

    /**
     * Druckt die Buchungszeile
     */
    public void print(long balance) {
        System.out.println(BankUtils.formatBankDate(date)
                + " " + BankUtils.formatAmount(amount)
                + " " + BankUtils.formatAmount(balance + amount));
    }
}
