package ch.schule;

import java.util.*;

/**
 * "Vergleicher" f�rs Sortieren von Konten
 * nach Kontostand (absteigend).
 *
 * @author Roger H. J&ouml;rg
 * @version 1.0
 */
public class AccountBalanceComparator implements Comparator<Object>
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

	    return b1 < b2 ? 1 : (b1 > b2 ? -1 : 0);

	    // if (b1<b2) { return 1; }
	    // else if (b1 > b2) { return -1; }
	    // else return 0;
	}
}
