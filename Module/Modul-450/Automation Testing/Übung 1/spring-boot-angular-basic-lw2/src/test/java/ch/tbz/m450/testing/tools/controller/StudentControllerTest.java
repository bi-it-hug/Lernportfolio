package ch.tbz.m450.testing.tools.controller;

import ch.tbz.m450.testing.tools.repository.StudentRepository;
import ch.tbz.m450.testing.tools.repository.entities.Student;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = StudentController.class)
class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StudentRepository studentRepository;

    @Test
    @DisplayName("GET /students returns list of students")
    void getStudents_returnsStudents() throws Exception {
        List<Student> students = Arrays.asList(
                new Student("Alice", "alice@example.com"),
                new Student("Bob", "bob@example.com")
        );
        given(studentRepository.findAll()).willReturn(students);

        mockMvc.perform(get("/students"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Alice"))
                .andExpect(jsonPath("$[0].email").value("alice@example.com"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].name").value("Bob"))
                .andExpect(jsonPath("$[1].email").value("bob@example.com"));
    }

    @Test
    @DisplayName("POST /students saves a student and returns 200")
    void addStudent_savesStudent() throws Exception {
        given(studentRepository.save(any(Student.class)))
                .willAnswer(invocation -> invocation.getArgument(0));

        String json = "{"
                + "\"name\":\"Charlie\","
                + "\"email\":\"charlie@example.com\""
                + "}";

        mockMvc.perform(post("/students")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());

        ArgumentCaptor<Student> captor = ArgumentCaptor.forClass(Student.class);
        verify(studentRepository).save(captor.capture());
        Student saved = captor.getValue();
        assertThat(saved.getName()).isEqualTo("Charlie");
        assertThat(saved.getEmail()).isEqualTo("charlie@example.com");
    }
}
