import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  resp: any
  listUsers: any
  closeResult: string = '';
  user: any
  userFG: FormGroup

  constructor(
    private userService: UserService,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) {
    this.getUsers()
    this.userFG = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{1,5}')]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      phone: ['', Validators.required],
      username: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.getUsers()
  }

  getUsers() {
    this.userService.users()
      .subscribe(res => {
        this.resp = res
        this.listUsers = this.resp.data
      }, (err) => {
        console.log(err);
      })
  }

  editUser() {
    this.userService.update(this.user.id, this.userFG.value)
      .subscribe(res => {
        this.modalService.dismissAll();
        this.getUsers()
      }, (err) => {
        console.log(err);
      })
  }

  getUser(id: number) {
    this.userService.show(id)
      .subscribe(res => {
        this.resp = res
        this.user = this.resp.data
        this.userFG.patchValue({ ...this.resp.data })
      }, (err) => {
        console.log(err);
      })
  }

  deleteUser(id: any) {
    this.user= ''

    this.getUser(id)
    setTimeout(() => {
      if (confirm(`desea realmente eliminar el usuario ${this.user.username }`)) {
        this.userService.delete(id)
        .subscribe( res => {
          this.getUsers()
        }, (err) =>{
          console.log(err);
        })
      }
      this.user= ''
    }, 100);
    
  }
    
  saveUser() {
    if (this.userFG.invalid) {
      return Object.values(this.userFG.controls).forEach(control => {
        control.markAsTouched();
      });
    }
    this.userService.save(this.userFG.value)
      .subscribe(res => {
        this.modalService.dismissAll();
        this.getUsers()
        this.user= ''
      }, (err) => {
        console.log(err);
      })
  }

  open(content: any, param?: number) {

    if (!param) {
      this.userFG.reset();
    }

    this.modalService.open(content, { size: 'sm' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  // This function is used in open
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      this.user= ''
      return 'by clicking on a backdrop';
    } else {
      this.user= ''
      return `with: ${reason}`;
    }
  }
  get validEmail() { return this.userFG.get('email')?.invalid && this.userFG.get('email')?.touched }
  get validPass() { return this.userFG.get('password')?.invalid && this.userFG.get('password')?.touched }
  get validPhone() { return this.userFG.get('phone')?.invalid && this.userFG.get('phone')?.touched }
  get validUsername() { return this.userFG.get('username')?.invalid && this.userFG.get('username')?.touched }
}
