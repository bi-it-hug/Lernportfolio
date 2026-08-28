package ch.schule;
import java.util.*;

/**
 * Die Bank.
 *
 * @author luigicavuoti
 * @version 2.0
 */
public class Bank
{
	/**
	 * Liste aller Konti.
	 */
	private TreeMap<String, Account> accounts;

	/**
	 * N�chste Kontonummer (numerisch).
	 */
	private int nextAccountId;

	/**
	 * Initialisiert eine neue Bank.
	 */
	public Bank()
	{
		this.accounts = new TreeMap<String, Account>();
		this.nextAccountId = 1000;
	}

	/**
	 * Erzeugt ein neues Sparkonto
	 *
	 * @return die neue Kontonummer
	 */
	public String createSavingsAccount()
	{
		String id = "S-" + nextAccountId;

	    ++nextAccountId;
		accounts.put(id, new SavingsAccount(id));

		return id;
	}

	/**
	 * Erzeugt ein neues Promo-Jugendsparkonto
	 *
	 * @return die neue Kontonummer
	 */
	public String createPromoYouthSavingsAccount()
	{       // 
		String id = "Y-" + nextAccountId;

		++nextAccountId;

		accounts.put(id,
			new PromoYouthSavingsAccount(id));

		return id;
	}

	/**
	 * Erzeugt ein neues Lohnkonto
	 * @param creditLimit Kreditlimite (negative Zahl)
	 * @return String die neue Kontonummer
	 */
	public String createSalaryAccount(long creditLimit)
	{
		if (creditLimit > 0) // ung�ltiger Parameter?
		{
			return null;
		}
        String id = "P-" + nextAccountId;

		++nextAccountId;
		accounts.put(id,new SalaryAccount(id, creditLimit));

		return id;
	
        }
	/**
	 * Gibt den Kontostand der Bank zur�ck.
	 *
	 * @return long der Kontostand der Bank
	 */
	public long getBalance()
	{
		long balance = 0;
		Account[] aa = (Account[]) accounts.values().toArray(
			  new Account[accounts.size()]);

		for (int i = 0; i < aa.length; ++i)
		{
			balance -= aa[i].getBalance();
		}

		return balance;
	}

	/**
	 * Gibt den Kontostand des Kontos mit der gegebenen
	 * Kontonummer zur�ck.
	 *
	 * <p>
	 * Falls kein Konto mit der gesuchten Kontonummer
	 * existiert, gibt diese Methode 0 (zero) zur�ck.
	 * </p>
	 *
	 * @param id die Kontonummer
	 * @return long der Kontostand des Kontos
	 */
	public long getBalance(String id)
	{
		Account a = (Account) accounts.get(id);

	    if (a == null)
			return 0;

		return a.getBalance();
	}

	/**
	 * Zahlt den gegebenen Betrag auf das Konto mit
	 * der gegebenen Kontonummer ein.
	 *
	 * <p>
	 * Diese Methode kann <code>false</code> zur�ckgeben,
	 * falls das Konto nicht existiert, oder falls die
	 * Einzahlung auf dem Konto nicht funktioniert.
	 * </p>
	 *
	 * @param id die Kontonummer
	 * @param date das Transaktionsdatum
	 * @param amount der einzuzahlende Betrag
	 * @return boolean ob die Einzahlung erfolgreich war
	 */
	public boolean deposit(String id, int date,
						   long amount)
	{
		// 1. Konto suchen
		Account a = (Account) accounts.get(id);

		if (a == null)
			return false; // nicht gefunden

	    // Einzahlen und Erfolg zur�ckgeben
		return a.deposit(date, amount);
	}

	/**
	 * Hebt den gegebenen Betrag vom Konto mit
	 * der gegebenen Kontonummer ab.
	 *
	 * <p>
	 * Diese Methode kann <code>false</code> zur�ckgeben,
	 * falls das Konto nicht existiert, oder falls das
	 * Abheben vom Konto nicht funktioniert.
	 * </p>
	 *
	 * @param id die Kontonummer
	 * @param date das Transaktionsdatum
	 * @param amount der abzuhebende Betrag
	 * @return boolean ob das Abheben erfolgreich war
	 */
	public boolean withdraw(String id, int date,
							long amount)
	{
		// 1. Konto suchen
		Account a = (Account) accounts.get(id);

		if (a == null)
			return false; // nicht gefunden

		// Abheben und Erfolg zur�ckgeben
		return a.withdraw(date, amount);
	}

	/**
	 * Druckt den Kontoauszug des Kontos mit der gegebenen
	 * Kontonummer.
	 *
	 * @param id die Kontonummer des zu druckenden Kontos
	 */
	public void print(String id)
	{
		// 1. Konto suchen
		Account a = (Account) accounts.get(id);

	    if (a == null)
			return;

	    a.print();
	}

	/**
	 * Druckt den Kontoauszug des Kontos mit der gegebenen
	 * Kontonummer f�r den gegebenen Monat.
	 *
	 * @param id die Kontonummer des zu druckenden Kontos
	 * @param year das Jahr
	 * @param month der Monat
	 */
	public void print(String id, int year, int month)
	{
		// 1. Konto suchen
		Account a = (Account) accounts.get(id);

		if (a == null)
			return;

		a.print(year, month);
	}

	/**
	 * Druckt die f�nf Konten mit dem h�chsten Saldo.
	 */
	public void printTop5()
	{
		Account[] aa = (Account[]) accounts.values().toArray(
			  new Account[accounts.size()]);

	    Arrays.sort(aa, new AccountBalanceComparator());

	    for (int i = 0; (i < 5) && (i < aa.length); ++i)
		{
			System.out.println(aa[i].getId()
				+ ": " + aa[i].getBalance());
		}
	}

	/**
	 * Druckt die f�nf Konten mit dem h�chsten Saldo.
	 */
	public void printBottom5()
	{
		Account[] aa = (Account[]) accounts.values().toArray(
			  new Account[accounts.size()]);

		Arrays.sort(aa,
			new AccountInverseBalanceComparator());

		for (int i = 0; (i < 5) && (i < aa.length); ++i)
		{
			System.out.println(aa[i].getId()
				+ ": " + aa[i].getBalance());
		}
	}

	/** 
	 * @uml.property name="account"
	 * @uml.associationEnd aggregation="shared" inverse="bank:ch.schule.m326.bank.Account"
	 */
	private Account account;

	/** 
	 * Getter of the property <tt>account</tt>
	 * @return  Returns the account.
	 * @uml.property  name="account"
	 */
	public Account getAccount() {
		return account;
	}

	/** 
	 * Setter of the property <tt>account</tt>
	 * @param account  The account to set.
	 * @uml.property  name="account"
	 */
	public void setAccount(Account account) {
		this.account = account;
	}
}
