namespace Recursion.IterativeVsRecursive;

// Index-Position von x in einem Array finden
public class Position
{
    public static int Iterative(string[] array, string target)
    {
        for (int i = 0; i < array.Length; i++)
        {
            if (array[i] == target) return i;
        }
        return -1;
    }

    public static int Recursive(string[] array, string target, int index = 0)
    {
        if (index >= array.Length) return -1;
        if (array[index] == target) return index;
        return Recursive(array, target, index + 1);
    }

    public static void Main()
    {
        string[] Fruits = ["apple", "banana", "watermelon"];
        string Target = Fruits[1];

        Console.WriteLine($"Iteration: {Iterative(Fruits, Target)}");
        Console.WriteLine($"Recursive: {Recursive(Fruits, Target)}");
    }
}
