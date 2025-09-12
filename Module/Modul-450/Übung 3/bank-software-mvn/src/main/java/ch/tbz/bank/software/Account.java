package ch.tbz.bank.software;

/*
3	Bank Simulation with Account class (Competence O2)

We want to simulate a bank account and allow the user to pay in money, withdraw money and also check the balance.
Create a class “Account” which has information about the user, currency and balance.
Add methods so you can add money and take money from your account. Include a method which shows how much money you have.

Extension: make the bank interactive
We want the user to interact with the bank. He should be able to use a small menu where he can add amount,
withdraw money within a certain limit, check the balance….
Implement a user-menu which is user friendly. It should do basic validations and check that the user enters correct data.
Make sure that you work with the correct datatypes.

Extension 2: dealing with several accounts
How can we deal with several accounts? Is there a way how we can keep a list of elements?
Try and figure out a solution.
Create a bank class which has an array of accounts. Add a method which allows the user to show all accounts.
The user can also transfer money from one account to another.
 */

public class Account {

    static int counter = 0;
    private int id;
    private String userLastName;
    private Currency currency;
    private double balance;


    public Account(String userLastName, Currency currency, double startBalance) {
        counter++;
        id = counter;
        this.userLastName = userLastName;
        this.currency = currency;
        this.balance = startBalance;
    }

    public void deposit(double amount) {
        balance += amount;
    }

    public void printBalance() {
        System.out.printf("Aktueller Kontostand: %.2f %s\n", this.balance, this.currency);
    }


    public boolean withdraw(double amount) {
        if (amount > balance) {
            return false;
        } else {
            balance -= amount;
            return true;
        }
    }

    public double getBalance() {return balance;}
    public Currency getCurrency() {
        return currency;
    }
    public String getUserLastName() {
        return userLastName;
    }
    public int getId() {return id;}

    public void pseudoDeleteAccount() {
        this.userLastName = null;
        this.balance = 0;
        this.currency = null;
        this.id = 0;
    }

}
