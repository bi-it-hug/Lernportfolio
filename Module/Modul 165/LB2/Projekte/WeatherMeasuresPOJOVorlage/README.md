### 1. Klassen nach Vorlage erstellt:

```java
public class Measurement {

    // Attribute
    double value;
    String kind;

    // Konstruktor
    public Measurement(double value, String kind) {
        this.value = value;
        this.kind = kind;
    }
}
```

```java
public class Station {

    // Attribute
    String city;
    String plz;

    // Konstruktor
    public Station(String city, String plz) {
        this.city = city;
        this.plz = plz;
    }
}
```

```java
public class WeatherMeasurement {

    // Attribute
    String type;
    String timestamp;
    Station station;
    List<Measurement> measures;

    // Konstruktor
    public WeatherMeasurement(String type, String timestamp, Station station, List<Measurement> measures) {
        this.type = type;
        this.timestamp = timestamp;
        this.station = station;
        this.measures = measures;
    }
}
```

### 2. Getter und Setter mit Lombok implementiert:

```java
package ch.bsfh.jw.weather.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Measurement {

    // Attribute
    double value;
    String kind;

    // Konstruktor
    public Measurement(double value, String kind) {
        this.value = value;
        this.kind = kind;
    }
}
```

```java
package ch.bsfh.jw.weather.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Station {

    // Attribute
    String city;
    String plz;

    // Konstruktor
    public Station(String city, String plz) {
        this.city = city;
        this.plz = plz;
    }
}
```

```java
package ch.bsfh.jw.weather.model;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WeatherMeasurement {

    // Attribute
    String type;
    String timestamp;
    Station station;
    List<Measurement> measures;

    // Konstruktor
    public WeatherMeasurement(String type, String timestamp, Station station, List<Measurement> measures) {
        this.type = type;
        this.timestamp = timestamp;
        this.station = station;
        this.measures = measures;
    }
}
```

### 3. weatherMeasurement-Objekt erstellt:

```java
WeatherMeasurement weatherMeasurement = new WeatherMeasurement(
        "Wettermessung",
        new Date().toString(),
        new Station("Winterthur", "8400"),
        List.of(
                new Measurement(20.1, "temperature"),
                new Measurement(2.3, "windspeed")
        )
);
```

### 4. CodecProvider & CodecRegistry implementiert:

```java
CodecProvider pojoCodecProvider = PojoCodecProvider.builder().register("ch.bsfh.jw.weather.model").build();
CodecRegistry pojoCodecRegistry = fromRegistries(com.mongodb.MongoClient.getDefaultCodecRegistry(), fromProviders(pojoCodecProvider));
statisticCollection = statisticCollection.withCodecRegistry(pojoCodecRegistry);
```

### 5. Document erstellt:

```java
doc.append("weatherMeasurement", weatherMeasurement);
statisticCollection.insertOne(doc);
```
