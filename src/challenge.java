public class challenge {
    public static void main(String[] args) {
        try {
            int first = 0;
            int last = 1;

            while (first + last < 1000) {
                Thread.sleep(500);
                int result = first + last;
                System.out.println("result: " + result);

                first = last;
                last = result;
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
