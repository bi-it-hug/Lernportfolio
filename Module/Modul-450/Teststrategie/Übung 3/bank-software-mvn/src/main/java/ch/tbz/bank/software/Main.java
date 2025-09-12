package ch.tbz.bank.software;

import java.io.IOException;

/**
 * This console app simulates a bank counter that lets the user do basic banking business.
 * @author Thomas Trüb
 * @version 1.0
 */
public class Main {
    public static void main(String[] args) throws IOException {

        var bank = new Bank();

        bank.createAccount("Rockefeller", Currency.USD, 1500);
        bank.createAccount("Gates", Currency.EUR, 2000);
        bank.createAccount("Musk", Currency.CHF, 23500);
        bank.createAccount("Bezos", Currency.EUR, 100.50);
        bank.createAccount("Branson", Currency.USD, 1500000);

        System.out.printf("[Es gibt %d Konten mit den Nummern 1–%d.]\n\n", bank.getNumberOfAccounts(), bank.getNumberOfAccounts());

        var c1 = new Counter(bank);

        boolean editNextAccount;
        do {
            int accountNumber = c1.chooseAccount();
            if (accountNumber == 0) {
                System.exit(0);
            }
            editNextAccount = c1.editAccount(accountNumber);
        } while(editNextAccount);

    }
}

enum Currency {
    USD,
    EUR,
    CHF
}
