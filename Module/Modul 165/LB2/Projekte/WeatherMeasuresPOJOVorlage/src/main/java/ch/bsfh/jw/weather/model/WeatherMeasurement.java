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
