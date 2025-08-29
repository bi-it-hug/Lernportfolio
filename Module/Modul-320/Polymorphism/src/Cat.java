
public class Cat extends Animal {

    String claws;

    public Cat(String name, int age, String claws) {
        super(name, age);
        this.claws = claws;
    }

    @Override
    public void speak() {
        System.out.println("Meow");
    }

    // Getters and Setters
    public String getClaws() {
        return claws;
    }

    public void setClaws(String claws) {
        this.claws = claws;
    }
}
