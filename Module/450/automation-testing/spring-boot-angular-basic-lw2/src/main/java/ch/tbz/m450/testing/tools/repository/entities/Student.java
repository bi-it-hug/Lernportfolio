package ch.tbz.m450.testing.tools.repository.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@AllArgsConstructor
@Data
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private final String name;
    private final String email;

    public Student(String name, String email) {
        this.name = name;
        this.email = email;
    }

    public Student() {
        this.name = "";
        this.email = "";
    }
}
