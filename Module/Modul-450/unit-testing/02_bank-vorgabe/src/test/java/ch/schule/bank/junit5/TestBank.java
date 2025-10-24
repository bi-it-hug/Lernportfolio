/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package ch.schule.bank.junit5;


import ch.schule.Bank;

/**
 * @author       Luigi Cavuoti
 * @uml.dependency  supplier="ch.schule.m326.bank.Bank"
 */
public class TestBank {

    public static void main(String[] args)
    {
        //Bank instanzieren
        Bank ubs = new Bank();
        // KOnto kreiren
        ubs.createSavingsAccount();
        // Einzahlung von 12000.- mmRappen
        ubs.deposit("S-1000", 13576, 12000);
        // Konto Saldo ausgeben
        long balance = ubs.getBalance("S-1000");
        System.out.println("Saldo des Kontos S-1000 ist: " + balance +" mmRp." );
        // 2. Konto kreiren
        ubs.createSavingsAccount();
        // Einzahlung auf 2. Kontos
        ubs.deposit("S-1001", 13560, 10000);
        // Konto Saldo ausgeben
        System.out.println("Saldo des Kontos S-1001 ist: " + ubs.getBalance("S-1001")+" mmRp." );
        // 3. Konto ubs kreiren
        ubs.createSavingsAccount();
        ubs.deposit("S-1002",13576, 8000);
        ubs.deposit("S-1002", 13576, 200);
        // Konto Saldo ausgeben
        System.out.println("Saldo des Kontos S-1002 ist: " + ubs.getBalance("S-1002")+" mmRp." );
        // erstes Konto -> Saldo ausgeben
        System.out.println("Konti absteigend nach Konstosaldo sortiert");
        ubs.createPromoYouthSavingsAccount();
        // Konto Saldo ausgeben
        System.out.println("saldo de Kontos Y-1003: " + ubs.getBalance("Y-1003")+" mmRp.");
        ubs.deposit("Y-1003", 14000, 50000);
        ubs.printTop5() ;
        // letzes Konto -> Saldo ausgeben
        System.out.println("Konti aufsteigend nach Konstosaldo sortiert");
        ubs.printBottom5();

        // Migros Bank instnzieren
        Bank migros = new Bank();
        // 1. Konto der Migros Bank
        migros.createPromoYouthSavingsAccount();
        // Einzahlung auf Migros Konto 24000
        migros.deposit("Y-1000",13456, 24000);
        // Konto Saldo ausgeben
        System.out.println("Saldo des Kontos Y-1000 ist: " + migros.getBalance("Y-1000")+" mmRp." );
        // erstes Konto -> Saldo ausgeben
        migros.printTop5();
        // letzes Konto -> Saldo ausgeben
        migros.printBottom5();

    }

}
