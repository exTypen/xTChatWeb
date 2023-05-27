import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RegisterModel } from 'src/app/models/auth-models/registerModel';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup
  constructor(private formBuilder: FormBuilder,
    private toasterService: ToastrService,
    private authService: AuthService,
    private router:Router){}

  ngOnInit(){
    this.createRegisterForm()
  }

  createRegisterForm(){
    this.registerForm = this.formBuilder.group({
      userName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
      passwordAgain: ['', Validators.required]
    });
  }

  register(){
    if (this.registerForm.valid) {
      if (this.registerForm.value.password == this.registerForm.value.passwordAgain) {
        let registerModel: RegisterModel = Object.assign({userName:this.registerForm.value.userName, firstName:this.registerForm.value.firstName, lastName:this.registerForm.value.lastName, password:this.registerForm.value.password})
        this.authService.register(registerModel)
      }else{
        this.toasterService.error("Şifreler uyuşmuyor", "Hata")
      }
    }else{
      this.toasterService.warning("Tüm alanları doldurun","Dikkat")
    }

  }

  routeLogin(){
    this.router.navigate(["login"])
  }
}
