package ch.bsfh.jw.weather;

import com.mongodb.client.*;
import org.bson.BsonDateTime;
import org.bson.Document;

import java.util.Date;
import java.util.List;
import java.util.function.Consumer;

/**
 * Try out mongoDB
 *
 * @author p.r.
 * @version 02.06.2025
 */
public class App {

    @SuppressWarnings("ConvertToTryWithResources")
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

        Document doc1 = new Document();

        doc1.append("type", "Wettermessung");

        // Aufgabe Erweitern um timestamp
        doc1.append("timestamp", new BsonDateTime(new Date().getTime()));

        // Aufgabe Erweitern um station
        Document station1 = new Document()
                .append("city", "Winterthur")
                .append("plz", "8400");

        doc1.append("station", station1);

        // Aufgabe Erweitern um measures mehrere Messungen
        Document measure1 = new Document()
                .append("kind", "temperature")
                .append("value", "20.1");

        Document measure2 = new Document()
                .append("kind", "windspeed")
                .append("value", "2.3");

        List<Document> measures1 = List.of(measure1, measure2);

        doc1.append("measures", measures1);

        // Aufgabe Weitere Messung aus einer anderen Station hinzufügen
        Document doc2 = new Document();

        doc2.append("timestamp", new BsonDateTime(new Date().getTime()));

        Document station2 = new Document()
                .append("city", "Winterthur")
                .append("plz", "8400");

        doc2.append("station", station2);

        Document measure3 = new Document()
                .append("kind", "temperature")
                .append("value", "20.1");

        Document measure4 = new Document()
                .append("kind", "windspeed")
                .append("value", "2.3");

        List<Document> measures2 = List.of(measure3, measure4);

        doc2.append("measures", measures2);

        //write document to collection
        statisticCollection.insertMany(List.of(doc1, doc2));

        //---------------------------------------------------------------------------------------------------------------
        // Connection schliessen
        mongoClient.close();
    }
}
