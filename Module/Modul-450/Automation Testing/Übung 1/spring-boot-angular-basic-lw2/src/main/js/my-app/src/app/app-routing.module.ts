import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StudentListComponent} from "./student-list/student-list.component";
import {StudentFormComponent} from "./student-form/student-form.component";

const routes: Routes = [
  { path: 'students', component: StudentListComponent },
  { path: 'addstudents', component: StudentFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
