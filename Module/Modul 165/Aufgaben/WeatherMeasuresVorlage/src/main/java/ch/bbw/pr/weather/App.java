package ch.bbw.pr.weather;

import com.mongodb.client.*;
import com.mongodb.client.model.Projections;
import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.UpdateResult;
import org.bson.BsonDateTime;
import org.bson.Document;
import org.bson.conversions.Bson;

import java.util.Date;
import java.util.function.Consumer;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Updates.set;

/**
 * Try out mongoDB
 *
 * @author Peter Rutschmann
 * @version 18.11.2022
 */
public class App {

    public static void main(String[] args) {
        System.out.println("Hello Weather");

        String connectionString = "mongodb://root:1234@localhost:27017";
        MongoClient mongoClient = MongoClients.create(connectionString);

        //list all databases
        System.out.println("List all databases:");
        mongoClient.listDatabases().forEach((Consumer<? super Document>) result -> System.out.println(result.toJson()));

        mongoClient.close();
    }
}
