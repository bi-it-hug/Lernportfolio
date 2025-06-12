package ch.bsfh.jw.weather;

import com.mongodb.client.*;
import org.bson.BsonDateTime;
import org.bson.Document;

import java.util.Date;
import java.util.List;
import java.util.function.Consumer;

import javax.print.Doc;

/**
 * Try out mongoDB
 *
 * @author p.r.
 * @version 02.06.2025
 */
public class App {
    public static void main(String[] args) {
        System.out.println("Hello Weather");

        // Verbindung aufbauen
        String connectionString = "mongodb://root:example@localhost:27017";
        MongoClient mongoClient = MongoClients.create(connectionString);

        // Alle Datenbanken anzeigen
        System.out.println("List all databases:");
        mongoClient.listDatabases().forEach((Consumer<? super Document>) result -> System.out.println(result.toJson()));

        //---------------------------------------------------------------------------------------------------------------

        // Aufgabe Erstes vereinfachtes Document schreiben

        MongoDatabase statisticDB = mongoClient.getDatabase("weathermeasuredb");
        MongoCollection<Document> statisticCollection = statisticDB.getCollection("measures");
        Document doc = new Document();

        doc.append("type", "Wettermessung");

        // Aufgabe Erweitern um timestamp

        doc.append("timestamp", new BsonDateTime(new Date().getTime()));

        // Aufgabe Erweitern um station

        Document station = new Document()
            .append("city", "Winterthur")
            .append("plz", "8400");

        doc.append("station", station);

        // Aufgabe Erweitern um measures mehrere Messungen

        Document measure1 = new Document()
            .append("kind", "temperature")
            .append("value", "20.1");

        Document measure2 = new Document()
            .append("kind", "windspeed")
            .append("value", "2.3");

        List<Document> measures = List.of(measure1, measure2);
        
        doc.append("measures", measures);

        // Aufgabe Weitere Messung aus einer anderen Station hinzufügen

        

        //write document to collection

        statisticCollection.insertOne(doc);

        //---------------------------------------------------------------------------------------------------------------

        // Connection schliessen
        mongoClient.close();
    }
}
