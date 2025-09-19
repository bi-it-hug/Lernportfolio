package ch.tbz.m450.testing.tools.repository;

import ch.tbz.m450.testing.tools.repository.entities.Student;
import org.springframework.data.repository.CrudRepository;

public interface StudentRepository extends CrudRepository<Student, Long> {
}
