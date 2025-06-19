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
