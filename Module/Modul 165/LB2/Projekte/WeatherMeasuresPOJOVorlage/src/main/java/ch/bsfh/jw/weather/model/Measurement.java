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
