package ch.bbw.cardgame;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class CardDBConnector {

    public List<Car> getCarsFromDB() {
        List<Car> result = new ArrayList<>();

        String SQL_SELECT = "Select * from car";

        try (Connection conn = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/carCards?verifyServerCertificate=false&useSSL=false", "root", "root"); PreparedStatement preparedStatement = conn.prepareStatement(SQL_SELECT)) {

            ResultSet resultSet = preparedStatement.executeQuery();

            while (resultSet.next()) {
                Car c = new Car();
                c.setImageUrl(resultSet.getString("imageUrl"));
                c.setTradeName(resultSet.getString("tradeName"));
                c.setModel(resultSet.getString("model"));
                c.setPrize(resultSet.getDouble("prize"));
                result.add(c);

            }
            result.forEach(x -> System.out.println(x));

        } catch (SQLException e) {
            System.err.format("SQL State: %s\n%s", e.getSQLState(), e.getMessage());
        } catch (Exception e) {
            System.err.println(e.getMessage());
        }

        return result;
    }
}
