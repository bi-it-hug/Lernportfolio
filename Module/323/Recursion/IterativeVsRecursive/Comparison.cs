namespace Recursion.IterativeVsRecursive;

// Zwei Wörter vergleichen, ob sie gleich sind
public class Comparison
{
    public static bool Iterative(string[] words)
    {
        for (int i = 0; i < words.Length - 1; i++)
        {
            return words[i] == words[i + 1];
        }
        return false;
    }

    public static bool Recursive(string[] words, int index = 0)
    {
        if (index >= words.Length - 1) return false;
        if (words[index] == words[index + 1]) return true;
        return Recursive(words, index + 1);
    }

    public static void Main()
    {
        Random Random = new();

        string[] Words = ["apple", "banana", "watermelon", "kiwi", "orange"];
        string[] SelectedWords = [Words[Random.Next(Words.Length)], Words[Random.Next(Words.Length)]];
        Console.WriteLine($"Vergleiche: {SelectedWords[0]} und {SelectedWords[1]}");

        Console.WriteLine(Iterative(SelectedWords) ? "Wörter sind gleich!" : "Wörter sind unterschiedlich!");
        Console.WriteLine(Recursive(SelectedWords) ? "Wörter sind gleich!" : "Wörter sind unterschiedlich!");
    }
}
