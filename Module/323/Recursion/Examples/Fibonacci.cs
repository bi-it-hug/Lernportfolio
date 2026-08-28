namespace Recursion.Examples;

public class Fibonacci
{
    public static int Calculate(int n)
    {
        if (n <= 0) return 0;
        else if (n == 1) return 1;
        else return Calculate(n - 1) + Calculate(n - 2);
    }

    public static void Main()
    {
        for (int i = 0; i < 10; i++)
        {
            Console.WriteLine(Calculate(i));
        }
    }
}
