package ch.schule;

import java.util.*;

public class AccountInverseBalanceComparator
	implements Comparator<Object>
{
	/**
	 * Vergleicht zwei Konten nach ihrem Kontostand
	 *
	 * @param o1 erstes Konto
	 * @param o2 zweites Konto
	 *
	 * @return int (Ganzzahl gem�ss "compare"-Definition)
	 */
	public int compare(Object o1, Object o2)
	{
		Account a1 = (Account) o1;
		Account a2 = (Account) o2;

		long b1 = a1.getBalance();
		long b2 = a2.getBalance();

		return b1 < b2 ? -1 : (b1 > b2 ? 1 : 0);

		// wenn b1 und b2 ein "int" w�re, k�nnte man
		// schreiben:
		// return b1 - b2;
	}
}
