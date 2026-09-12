import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class TestJdbc {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://127.0.0.1:5433/sentinel";
        String user = "sentinel";
        String password = "sentinel";
        try {
            Connection conn = DriverManager.getConnection(url, user, password);
            System.out.println("Connected to 5433!");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
