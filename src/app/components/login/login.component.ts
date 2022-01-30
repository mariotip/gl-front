import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userFG: FormGroup

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.userFG = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{1,5}')]],
      password: ['', [Validators.minLength(5)]]
    })
  }

  ngOnInit(): void {

  }

  login() {
    if (this.userFG.invalid) {
      return Object.values(this.userFG.controls).forEach(control => {
        control.markAsTouched();
      });
    }
    this.userService.login(this.userFG.value)
      .subscribe(res => {
        this.router.navigate(['user'], { replaceUrl: true });
      }, (err) => {
        console.log(err);
        alert('la credenciales son incorrectas')
      })
  }
  get validEmail() { return this.userFG.get('email')?.invalid && this.userFG.get('email')?.touched }
  get validPass() { return this.userFG.get('password')?.invalid && this.userFG.get('password')?.touched }
}
