import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from './local-storage.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TokenModel } from '../models/auth-models/tokenModel';
import { SingleResponseModel } from '../models/response-models/singleResponseModel';
import { LoginModel } from '../models/auth-models/loginModel';
import { RegisterModel } from '../models/auth-models/registerModel';
import { ListResponseModel } from '../models/response-models/listResponseModel';
import { OperationClaim } from '../models/auth-models/operationClaim';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userName: string;
  userEmail: string
  userId: number
  roles: string[] = [];
  apiUrl = "api/auth"
  jwtHelper:JwtHelperService = new JwtHelperService();

  constructor(
    private httpClient:HttpClient,
    private storageService:LocalStorageService,
    private toastrService:ToastrService,
    private router: Router
  ) {
    this.setUserStats()
  }


  login(loginModel:LoginModel){
    let newPath = this.apiUrl + "/login"
    this.httpClient
    .post<SingleResponseModel<TokenModel>>(newPath,loginModel).subscribe(response => {
      if(response.success){
        this.storageService.setToken(response.data.token)
        this.toastrService.success("Giriş yapıldı","Başarılı")
        this.setUserName()
        setTimeout(function(){
          location.reload()
        },400)
        this.router.navigate(["/"])
      }
    },responseError => {
      this.toastrService.error(responseError.error.message,"Hata")
    })
  }

  register(registerModel:RegisterModel){
    let newPath = this.apiUrl + "/register"
    this.httpClient
    .post<SingleResponseModel<TokenModel>>(newPath,registerModel).subscribe(response => {
      if(response.success){
        this.storageService.setToken(response.data.token)
        this.toastrService.success("Kayıt olundu","Başarılı")
        this.setUserName()
        this.setUserEmail()
        setTimeout(function(){
          location.reload()
        },400)
      }
    },responseError => {
      this.toastrService.error(responseError.error.message,"Hata")
    })
  }

  isAuthenticated():boolean{
    if(localStorage.getItem('token')){
      return true;
    }else{
      return false;
    }
  }


  async setUserStats(){
    if(this.loggedIn()){
      this.setUserEmail()
      this.setUserName()
      this.setUserId()
    }
  }

  loggedIn(): boolean {
    let isExpired = this.jwtHelper.isTokenExpired(this.storageService.getToken());
    return !isExpired;
  }

  setUserName(){
    var decoded = this.getDecodedToken()
    var propUserName = Object.keys(decoded).filter(x => x.endsWith("/name"))[0];
    this.userName = decoded[propUserName];
  }

  getUserName(): string {
    return this.userName;
  }

  getUserId(): number{
    return this.userId;
  }

  logOut() {
    this.storageService.removeToken();
    this.roles = [];
    this.toastrService.success("Çıkış yapıldı","Başarılı")
    setTimeout(function(){
      location.reload()
    },400)
  }

  getDecodedToken(){
    try{
      return this.jwtHelper.decodeToken(this.storageService.getToken()!);
    }
    catch(Error){
        return null;

    }
  }

  setUserEmail(){
    var decoded = this.getDecodedToken()
    var propUserId = Object.keys(decoded).filter(x => x.endsWith("/email"))[0];
    this.userEmail = decoded[propUserId];
  }

  getUserEmail():string{
    return this.userEmail
  }

  setUserId() {
    var decoded = this.getDecodedToken();
    var propUserId = Object.keys(decoded).filter((x) =>
      x.endsWith('/nameidentifier')
    )[0];
    this.userId = Number(decoded[propUserId]);
  }

}
