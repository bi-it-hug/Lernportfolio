public class StringSort {

    // Task b function
    public static char[] taskB(String str) {
        char arr[] = str.toCharArray();
        char temp;
        int i = 0;
        while (i < arr.length) {
            int j = i + 1;
            while (j < arr.length) {
                if (arr[j] < arr[i]) {
                    temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
                j += 1;
            }
            i += 1;
        }
        return arr;
    }

    // Main function
    public static void main(String[] args) throws Exception {
        String str = "DieserStringwirdsortiert";
        char[] arr = taskB(str);
        System.out.println(arr);
    }
}