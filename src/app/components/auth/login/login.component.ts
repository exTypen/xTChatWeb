import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginModel } from 'src/app/models/auth-models/loginModel';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  btnDisabled:Boolean = false
  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private toastrService: ToastrService,
              private router: Router) { }

  ngOnInit(): void {
    this.createLoginForm()
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(){
    if(this.loginForm.valid){
      this.btnDisabled = true
      let loginModel:LoginModel = Object.assign({}, this.loginForm.value)
      this.authService.login(loginModel)
    }else{
      this.toastrService.warning("Tüm alanları doldurun","Dikkat")
    }
  }

  routeRegister(){
    this.router.navigate(["register"])
  }
}
