import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../service/student.service';
import { Student } from '../model/student';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent {

  student: Student;

  constructor(private route: ActivatedRoute, private router: Router, private studentService: StudentService) {
    this.student = new Student();
  }

  onSubmit() {
    this.studentService.save(this.student).subscribe(result => this.gotoStudentList());
  }

  gotoStudentList() {
    this.router.navigate(['/students']);
  }
}
