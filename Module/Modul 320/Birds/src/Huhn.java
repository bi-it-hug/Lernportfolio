
public class Huhn extends Vogel {

    protected Huhn(String name, String farbe) {
        super(name, farbe);
    }

    @Override
    protected void fliegen() {
        System.out.println("Das Huhn " + name + " fliegt nicht");
    }

    @Override
    protected void flattern() {
        System.out.println("Das Huhn " + name + " flattert mit seinen " + farbe + "en Flügeln");
    }

    protected void gackern() {
        System.out.println("Das Huhn " + name + " gackert");
    }
}
