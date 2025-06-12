package ch.bsfh.jw.weather;

import ch.bsfh.jw.weather.model.Measurement;
import ch.bsfh.jw.weather.model.Station;
import ch.bsfh.jw.weather.model.WeatherMeasurement;
import com.mongodb.client.*;
import org.bson.Document;
import org.bson.codecs.configuration.CodecProvider;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;

import java.util.Date;
import java.util.List;
import java.util.function.Consumer;

import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;

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
        String connectionString = "mongodb://root:root@localhost:27017";
        MongoClient mongoClient = MongoClients.create(connectionString);

        // Alle Datenbanken anzeigen
        System.out.println("List all databases:");
        mongoClient.listDatabases().forEach((Consumer<? super Document>)
            result -> System.out.println(result.toJson()));

        //---------------------------------------------------------------------------------------------------------------

        // Aufgabe Datenklassen ergänzen (Unter package .weather.model: Measurement, Station, WeatherMeasurement)
        // -> lombok verwenden


        // Aufgabe Daten-Objekte aufbauen (mit POJO)
        // -> mind. zwei Messungen
        // (setup weatherMeasurement, station and measures)





        //MongoDatabase statisticDB = mongoClient.getDatabase("weathermeasurepojodb");
        //MongoCollection<Document> statisticCollection = statisticDB.getCollection("measures");
        // Aufgabe CodecProvider einsetzen



        //write document to collection

        //---------------------------------------------------------------------------------------------------------------

        // Connection schliessen
        mongoClient.close();
    }
}
