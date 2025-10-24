package ch.schule;

/**
 * Promotional youth savings account.
 *
 * Each deposit is honoured by 1% bonus.
 *
 * @author Roger H. J&ouml;rg
 * @version 1.0
 */
public class PromoYouthSavingsAccount extends SavingsAccount
{
	/**
	 * Initializes a new instance of this account.
	 *
	 * @param id the identifier
	 */
	public PromoYouthSavingsAccount(String id)
	{
		super(id);
	}

	/**
	 * Zahlt den gegebenen Betrag (plus den von der
	 * Bank gew�hrten Bonus) aufs Konto ein.
	 *
	 * @param date das Transaktionsdatum
	 * @param amount der einzuzahlende Betrag
	 *
	 * @return boolean <code>true</code>, falls die
	 * Einzahlung erfolgreich war, andernfalls (z.B.
	 * bei negativem Betrag) <code>false</code>.
	 */
	public boolean deposit(int date, long amount)
	{
	    long bonus = amount / 100;

	    return super.deposit(date, amount + bonus);
	}
}
