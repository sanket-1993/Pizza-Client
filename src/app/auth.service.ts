import { Injectable,ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIsService } from './apis.service';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { GlobalService } from './global.service';
import {CaptchaComponent} from 'angular-captcha';
import { Observable,of } from 'rxjs';
import { share, map } from 'rxjs/operators';
//import { JwtHelperService } from '@auth0/angular-jwt';
//import 'rxjs/add/observable/of';

interface myData{
  success:boolean,
  message:string
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  // public access_token: string ;
  // public refreshToken: string ;
  // public currentToken: string;
  @ViewChild(CaptchaComponent) captchaComponent: CaptchaComponent;
  loggedInStatus=JSON.parse(localStorage.getItem('loggedIn') || 'false');
  //Start of Constructor
  constructor(private http:HttpClient, private API:APIsService, private router: Router,private globalService:GlobalService) { 
   // this.currentToken = this.access_token;
  }
  //End of constructor
//   getAuthToken() {
//     return this.currentToken;
// }//


  //  this.currentToken = this.authTokenNew;

    //return Observable.of(this.authTokenNew).delay(200);
  
  setLoggedIn (value:boolean){
    this.loggedInStatus=value;
    localStorage.setItem('loggedIn',this.loggedInStatus);
  }

  get IsLoggedIn(){
    return JSON.parse(localStorage.getItem('loggedIn') || this.loggedInStatus.toString());
  }

  getUserDetails(username,password){
    const API_URL=this.API.API_URL+this.API.loginAPI;

    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
      })
    };
    let loginDetails={
      "email": username,
      "password": password,
    
    };
    return this.http.post(API_URL,loginDetails)
  }

  PasswordResetDetails(email,oldpassword,newpassword)
  { const API_URL = this.API.API_URL+this.API.ResetPassword;
   

    const httpOptions = {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+window.localStorage.getItem('TokenInLocal'),
      })
    };
    let passwordResetModel={
      "Email":email,
      "Password":oldpassword,
     "NewPassword":newpassword,
    //  "captchaCode": this.captchaComponent.captchaCode,
    // "captchaId": this.captchaComponent.captchaId
    }
   return this.http.post(API_URL,passwordResetModel,httpOptions)
  }

  // RefreshToken(): Observable<string> {
  //   const url = this.API.Token;

  //   // append refresh token if you have one
  //   const refreshToken = localStorage.getItem('refreshToken');
  //   const expiredToken = localStorage.getItem('TokenInLocal');

  //   return this.http
  //     .get(url, {
  //       headers: new HttpHeaders()
  //         .set('refreshToken', refreshToken)
  //         .set('TokenInLocal', expiredToken),
  //       observe: 'response'
  //     })
  //     .pipe(
  //       share(), // <== YOU HAVE TO SHARE THIS OBSERVABLE TO AVOID MULTIPLE REQUEST BEING SENT SIMULTANEOUSLY
  //       map(res => {
  //         const token = res.headers.get('TokenInLocal');
  //         const newRefreshToken = res.headers.get('refreshToken');

  //         // store the new tokens8
  //         localStorage.setItem('refreshToken', newRefreshToken);
  //         localStorage.setItem('TokenInLocal', token);

  //         return token;
  //       })
  //     );
  // }

  // getToken1() {
  //   const token = localStorage.getItem('TokenInLocal');
  //   // const helper = new JwtHelperService();
  //   // const isTokenExpired = helper.isTokenExpired(token);
  //   const isTokenExpired =false;
  //   if (!isTokenExpired) {
  //     return of(token);
  //   }
  //   return this.RefreshToken();
  // }

//      getrefreshToken()
//   {
  
//       /*
//           The call that goes in here will use the existing refresh token to call
//           a method on the oAuth server (usually called refreshToken) to get a new
//           authorization token for the API calls.
//       */
//        const API_URL= this.API.URL+this.refreshToken;
//        var body = "grant_type=refresh_token&refresh_token=" +window.localStorage.getItem("refreshToken") + "&client_id=";  
   
//        const httpOptions = {
//          headers: new HttpHeaders({
//            'Content-Type':"application/x-www-form-urlencoded; charset=utf-8"
//          })};
//          this.currentToken = this.refreshToken;
//        // return Observable.of(this.refreshToken).delay(200);
//      return this.http.post(API_URL,body,httpOptions);
    
// }

  //LogOut API
  logout() {
    // Log out of Auth0 session
    // Ensure that returnTo URL is specified in Auth0
    // Application settings for Allowed Logout URLs
    this.router.navigateByUrl('/login');
    localStorage.clear();
    this.setLoggedIn(false);
    this.globalService.token='';
    this.router.navigate(['/login'])

  }

}
