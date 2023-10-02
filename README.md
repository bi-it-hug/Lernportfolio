# Lernportfolio

### Einfacher Java Taschenrechner

```java
import java.util.Scanner;
public class Calculator {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("\nZahl 1:");
        int x = scanner.nextInt();
        scanner.nextLine();

        System.out.println("\nOperator:");
        String y = scanner.nextLine();

        System.out.println("\nZahl 2:");
        int z = scanner.nextInt();
        scanner.close();

        String res_msg = "\nResultat:";

        if (y.equals("+")) {
            System.out.println(res_msg + "\n" +  (x + z) + "\n");
        }
        else if (y.equals("-")) {
            System.out.println(res_msg + "\n" +  (x - z) + "\n");
        }
        else if (y.equals("/")) {
            System.out.println(res_msg + "\n" +  (x / z) + "\n");
        }
        else if (y.equals("*")) {
            System.out.println(res_msg + "\n" +  (x * z) + "\n");
        }
    }
}
```

### D4A1<sub>16</sub> = ?<sub>10</sub>

1<sub>16</sub>  ->  1<sub>10</sub> * 16<sup>0</sup> = **1<sub>10</sub>**<br>
A<sub>16</sub>  ->  10<sub>10</sub> * 16<sup>1</sup> = **160<sub>10</sub>**<br>
4<sub>16</sub>  ->  4<sub>10</sub> * 16<sup>2</sup> = **1'024<sub>10</sub>**<br>
D<sub>16</sub>  ->  13<sub>10</sub> * 16<sup>3</sup> = **53'248<sub>10</sub>**<br>

1<sub>10</sub> + 160<sub>10</sub> + 1'024<sub>10</sub> + 53'248<sub>10</sub> = **54'433<sub>10</sub>**

# TEST
