
public class Ente extends Vogel {

    protected Ente(String name, String farbe) {
        super(name, farbe);
    }

    @Override
    protected void fliegen() {
        System.out.println("Die Ente " + name + " fliegt nicht");
    }

    @Override
    protected void flattern() {
        System.out.println("Die Ente " + name + " flattert mit seinen " + farbe + "en Flügeln");
    }

    protected void schwimmen() {
        System.out.println("Die Ente " + name + " schwimmt");
    }
}
