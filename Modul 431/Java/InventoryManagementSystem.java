import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class InventoryManagementSystem {
    private static Map<String, Integer> inventory = new HashMap<>();
    private static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        boolean running = true;

        while (running) {
            System.out.println("\nInventory Management System");
            System.out.println("1. Add item to inventory");
            System.out.println("2. Display inventory");
            System.out.println("3. Sell item");
            System.out.println("4. Restock item");
            System.out.println("5. Exit");
            System.out.print("Enter your choice: ");
            
            int choice = scanner.nextInt();
            scanner.nextLine();  // Consume newline character
            
            switch (choice) {
                case 1:
                    addItemToInventory();
                    break;

                case 2:
                    displayInventory();
                    break;

                case 3:
                    sellItem();
                    break;

                case 4:
                    restockItem();
                    break;

                case 5:
                    running = false;
                    break;

                default:
                    System.out.println("Invalid choice. Please enter a number between 1 and 5.");
            }
        }
        scanner.close();
        System.out.println("Exiting Inventory Management System. Goodbye!");
    }

    private static void addItemToInventory() {
        System.out.print("Enter the name of the item: ");
        String itemName = scanner.nextLine();

        System.out.print("Enter the quantity: ");
        int quantity = scanner.nextInt();
        
        if (inventory.containsKey(itemName)) {
            int currentQuantity = inventory.get(itemName);
            inventory.put(itemName, currentQuantity + quantity);

        } else {
            inventory.put(itemName, quantity);
        }
        System.out.println(quantity + " " + itemName + "(s) added to inventory.");
    }

    private static void displayInventory() {
        System.out.println("\nCurrent Inventory:");

        for (Map.Entry<String, Integer> entry : inventory.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }

    private static void sellItem() {
        System.out.print("Enter the name of the item to sell: ");
        String itemName = scanner.nextLine();
        
        if (inventory.containsKey(itemName)) {
            System.out.print("Enter the quantity to sell: ");
            int quantityToSell = scanner.nextInt();
            int availableQuantity = inventory.get(itemName);

            if (availableQuantity >= quantityToSell) {
                inventory.put(itemName, availableQuantity - quantityToSell);
                System.out.println(quantityToSell + " " + itemName + "(s) sold.");

            } else {
                System.out.println("Insufficient quantity available.");
            }
        } else {
            System.out.println("Item not found in inventory.");
        }
    }

    private static void restockItem() {
        System.out.print("Enter the name of the item to restock: ");
        String itemName = scanner.nextLine();
        
        if (inventory.containsKey(itemName)) {
            System.out.print("Enter the quantity to restock: ");
            int quantityToRestock = scanner.nextInt();
            
            int currentQuantity = inventory.get(itemName);
            inventory.put(itemName, currentQuantity + quantityToRestock);
            System.out.println(quantityToRestock + " " + itemName + "(s) restocked.");
            
        } else {
            System.out.println("Item not found in inventory.");
        }
    }
}
