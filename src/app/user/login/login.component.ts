import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import {Router} from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { ToastrService } from 'ngx-toastr';
import { MessageProviderService } from '../../services/message-provider.service';
import { APIsService } from '../../services/apis.service';
import { error } from '@angular/compiler/src/util';
import { of } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  color = 'primary';
  mode = 'indeterminate';
  value = 90;

  isCaptchaValidated:boolean=true;

  overlays:boolean=true;
  signInForm: FormGroup;
  submitted = false;
  email = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  hide = false;
  getErrorMessage() {
    return this.checkform.email.hasError('required') ? 'You must enter a email' : '';
     // this.checkform.email.hasError('email') ? 'Not a valid email' : '';
  }

  getErrorMessagePassWord(){
    return this.checkform.password.hasError('required') ? 'You must enter a password':'';
  }   

  constructor(private apiService:APIsService,private Auth: AuthService, private formBuilder: FormBuilder, public http: HttpClient, private router: Router,private global:GlobalService,private toastr:ToastrService,private messageProvider :MessageProviderService) {

  }
  
  ngOnInit() {
    this.router.navigate(['login']);
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    this.overlays=false;
  }

  get checkform() { 
    return this.signInForm.controls; 
  }

  signIn(){
    if(!this.signInForm.valid){
      return
    }else{
      this.overlays=true;
      this.getToken(this.signInForm.controls.email.value,this.signInForm.controls.password.value);
    }
  }

  recaptcha_callback()
  {
   
    var response = grecaptcha.getResponse();
    if(response.length == 0) {
       this.toastr.error('Please verify that you are a Human.');
    } else {
        //isCaptchaValidated = true;
        this.isCaptchaValidated=false;
    }
    
  }
  
 
   getToken(userName,password){
    const loginURL=this.apiService.URL+this.apiService.Token;
    let body = `UserName=`+userName+`&Password=`+password+`&grant_type=password`;
   
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':'application/x-www-form-urlencoded',
      })};
    this.http.post(loginURL,body,httpOptions).subscribe((res:any) =>{

      window.localStorage.setItem('TokenInLocal', res.access_token);
      this.Auth.setLoggedIn(true);
      if(res.setByAdmin=="True")
      {
        this.router.navigate(['resetpassword']);        
      } 
      else
      {
        this.router.navigate(['addNewReport']);

      }
    },(err) => {
      this.overlays=false;
      this.toastr.warning(this.messageProvider.showMessage(parseInt(err.error.error)));
     
      this.router.navigate(['login']);
    });
  }

}





