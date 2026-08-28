namespace Recursion.Examples;

public class GGT
{
    public static int Calculate(int a, int b)
    {
        if (b == 0) return a;
        return Calculate(b, a % b);
    }

    public static void Main()
    {
        int FirstNumber = 18;
        int SecondNumber = 60;
        int Result = Calculate(FirstNumber, SecondNumber);

        Console.WriteLine($"Der größte gemeinsame Teiler von {FirstNumber} und {SecondNumber} ist {Result}!");
    }
}
