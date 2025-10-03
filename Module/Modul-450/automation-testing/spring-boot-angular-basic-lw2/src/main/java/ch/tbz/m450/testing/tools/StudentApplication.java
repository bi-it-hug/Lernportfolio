package ch.tbz.m450.testing.tools;

import ch.tbz.m450.testing.tools.repository.StudentRepository;
import ch.tbz.m450.testing.tools.repository.entities.Student;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.stream.Stream;

@SpringBootApplication
@Slf4j
public class StudentApplication {

	public static void main(String[] args) {
		SpringApplication.run(StudentApplication.class, args);
	}

	@Bean
	CommandLineRunner init(StudentRepository studentRepository) {
		return args -> {
			Stream.of("Jonas", "Patrick", "Yves", "Peter", "Ann").forEach(name -> {
				Student user = new Student(name, name.toLowerCase() + "@tbz.ch");
				studentRepository.save(user);
			});
			studentRepository.findAll().forEach(s -> log.info(s.toString()));
		};
	}

}
