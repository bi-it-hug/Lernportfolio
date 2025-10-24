package ch.schule;

/**
 * Sparkonto.
 *
 * @author Roger H. J&ouml;rg
 * @version 1.0
 */
public class SavingsAccount extends Account
{
	/**
	 * Initialisiert ein Sparkonto
	 *
	 * @param id die Kontonummer
	 */
	public SavingsAccount(String id)
	{
		super(id);
	}

	/**
	 * Hebt den gegebenen Betrag vom Konto ab.
	 *
	 * @param date das Transaktionsdatum
	 * @param amount der abzuhebende Betrag
	 *
	 * @return boolean <code>true</code>, falls die
	 * Abhebung erfolgreich war, andernfalls (z.B.
	 * bei negativem Betrag, oder nicht gen�gend
	 * Saldo) <code>false</code>.
	 */
	public boolean withdraw(int date, long amount)
	{
		if (getBalance() < amount)
			return false;

		return super.withdraw(date, amount);
	}
}
