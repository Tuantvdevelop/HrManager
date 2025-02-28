import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { EmployeeService } from 'src/app/service/employee.service';
import { DepartmentService } from 'src/app/service/department.service';
import { PositionService } from 'src/app/service/position.service';
import { EmployeeRequestBody } from 'src/app/model/employee.model';
import { ToastsService } from 'src/app/service/toasts.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css'],
})
export class EmployeeFormComponent implements OnInit {
  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    private positionService: PositionService,
    private departmentService: DepartmentService,
    private fb: FormBuilder,
    private atr: ActivatedRoute,
    private toastService: ToastsService
  ) {}
  get f(): {
    [key: string]: AbstractControl;
  } {
    return this.newEmployeeForm.controls;
  }
  positions = [];
  departments = [];
  // newEmployeeForm!: FormGroup;
  newEmployeeForm: FormGroup;
  idEmployee: string;
  file: any;
  imageSrc: string;

  avatar: any = '';

  ngOnInit(): void {
    this.newEmployeeForm = this.createForm();
    this.atr.params.subscribe((params) => {
      this.idEmployee = params.id;
      if (this.idEmployee) {
        this.employeeService.getUserById(this.idEmployee).subscribe((data) => {
          this.newEmployeeForm.setValue({
            full_name: data.data.userinfo.full_name,
            avatar: data.data.userinfo.avatar,
            user_account: data.data.user_account,
            email: data.data.email,
            sex: data.data.userinfo.sex,
            address: data.data.userinfo.address,
            phone: data.data.userinfo.phone,
            position_id: data.data.position_id,
            department_id: data.data.department_id,
            role_id: data.data.role_id,
            basic_salary: data.data.userinfo.basic_salary,
            date_of_join: data.data.userinfo.date_of_join,
          });
        });
      }
    });

    this.getDepartment();
    this.getPosition();
  }
  checkMoney(event){
    let a = document.querySelector('.error')
    if(this.newEmployeeForm.value.basic_salary < 0){
      a.innerHTML = "Lương cơ bản phải lớn hơn 0",
      (a as HTMLElement).style.display="block"
    }else{
      a.innerHTML = "",
      (a as HTMLElement).style.display = "none"
    }
  }
  createForm(): FormGroup {
    return new FormGroup({
      user_account: new FormControl('', [Validators.required]),
      full_name: new FormControl('', [Validators.required]),
      avatar: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      sex: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      position_id: new FormControl('', [Validators.required]),
      department_id: new FormControl('', [Validators.required]),
      date_of_join: new FormControl('', [Validators.required]),
      role_id: new FormControl('', [Validators.required]),
      basic_salary: new FormControl(0, [Validators.required]),
    });
  }
  getPosition(): void {
    this.positionService.getAllPosition().subscribe((data) => {
      this.positions = data.data;
    });
  }

  getDepartment(): void {
    this.departmentService.getAllDepartment().subscribe((data) => {
      this.departments = data.data;
    });
  }
  uploadImage(file: any): void {
    this.avatar = file.files[0];
  }
  submitForm(): void {
    const formdata = new FormData();
    if (this.avatar === '') {
      formdata.append('avatar', this.avatar);
    } else {
      formdata.append('avatar', this.avatar, this.avatar.name);
    }
    formdata.append('user_account', this.newEmployeeForm.value.user_account);
    formdata.append('full_name', this.newEmployeeForm.value.full_name);
    formdata.append('email', this.newEmployeeForm.value.email);
    formdata.append('sex', this.newEmployeeForm.value.sex);
    formdata.append('address', this.newEmployeeForm.value.address);
    formdata.append('position_id', this.newEmployeeForm.value.position_id);
    formdata.append('department_id', this.newEmployeeForm.value.department_id);
    formdata.append('role_id', this.newEmployeeForm.value.role_id);
    formdata.append('basic_salary', this.newEmployeeForm.value.basic_salary);
    formdata.append('date_of_join', this.newEmployeeForm.value.date_of_join);
    formdata.append('phone', this.newEmployeeForm.value.phone);

    if (this.idEmployee) {
      this.employeeService
        .updateEmployee(this.idEmployee, formdata)
        .subscribe((data) => {
          this.toastService.show('Update successfully !', {
            classname: 'bg-success text-light',
            delay: 3000,
          }),
            (_err) => {
              this.toastService.show('Update errors !', {
                classname: 'bg-danger text-light',
                delay: 3000,
              });
            };
        });
      this.router.navigate(['/', 'employee']);
    } else {
      this.employeeService.createEmployee(formdata).subscribe((data)=>{
        this.toastService.show(data.message,{
          classname:'bg-success text-light',
          delay:3000
        })
      },err => {
        this.toastService.show(err.error.message,{
          classname:'bg-danger text-light',
          delay:3000
        })
      })
      this.router.navigate(['/', 'employee']);
    }
  }
}
