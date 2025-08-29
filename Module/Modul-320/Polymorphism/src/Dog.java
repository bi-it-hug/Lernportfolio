
public class Dog extends Animal {

    String paws;

    public Dog(String name, int age, String paws) {
        super(name, age);
        this.paws = paws;
    }

    @Override
    public void speak() {
        System.out.println("Woof");
    }

    // Getters and Setters
    public String getPaws() {
        return paws;
    }

    public void setPaws(String paws) {
        this.paws = paws;
    }
}
