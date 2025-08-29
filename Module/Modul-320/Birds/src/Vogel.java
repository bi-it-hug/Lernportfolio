
public class Vogel {

    protected String name;
    protected String farbe;

    protected Vogel(String name, String farbe) {
        this.name = name;
        this.farbe = farbe;
    }

    protected void fliegen() {
        System.out.println("Der Vogel " + name + " fliegt");
    }

    protected void flattern() {
        System.out.println("Der Vogel " + name + " flattert mit seinen " + farbe + "en Flügeln");
    }
}
