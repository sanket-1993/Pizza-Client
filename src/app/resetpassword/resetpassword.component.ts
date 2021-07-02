import { Component, OnInit ,ViewChild} from '@angular/core';
import {FormControl, Validators, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
//import {AuthenticationService} from '../coreServices/authentication.service';
//import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
//import { GlobalService } from '../../global.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import { APIsService} from '../apis.service';
import {MessageProviderService} from '../message-provider.service';
// import {CaptchaComponent} from 'angular-captcha';


@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit {
  color = 'primary';
  mode = 'indeterminate';
  value = 90;

  isCaptchaValidated:boolean=true;

  overlays:boolean=true;
  showResetPasswordForm: FormGroup;
  //email= new FormControl('', [Validators.required]);
  oldpassword = new FormControl('', [Validators.required]);
  newpassword= new FormControl('', [Validators.required]);
  //captchaCode = new FormControl('', [Validators.required]);
  hide = false;
  //@ViewChild(CaptchaComponent) captchaComponent: CaptchaComponent;
  constructor(private apiService:APIsService,private router: Router,private formBuilder: FormBuilder,private toastr:ToastrService,private messageProvider:MessageProviderService, private Auth: AuthService,public http: HttpClient){}

  ngOnInit() {
    // localStorage.clear;
    // this.Auth.setLoggedIn(false);
    this.showResetPasswordForm = this.formBuilder.group({
      //email: ['', [Validators.required]],
      oldpassword: ['', [Validators.required]],
      newpassword: ['',[Validators.required]],
      //captchaCode: [''],
     
    });
    this.overlays=false;
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
  

  get checkform() { 
    return this.showResetPasswordForm.controls; 
  }

  // getErrorMessage(){
  //   return this.checkform.email.hasError('required') ? 'You must enter a email':'';
  // } 
  getErrorMessagePassWord(){
    return this.checkform.oldpassword.hasError('required') ? 'You must enter oldpassword':'';
  } 
  getErrorMessageNewPassWord(){
    return this.checkform.newpassword.hasError('required') ? 'You must enter newpassword':'';
  } 
  
  ResetPassword(){

   if (this.showResetPasswordForm.invalid) {
    return;
  }else{
    this.overlays=true;
  
    // this.captchaComponent.validateUnsafe((isCaptchaCodeCorrect: boolean) => {
    
    //   if (isCaptchaCodeCorrect && this.showResetPasswordForm.controls.email.valid && this.showResetPasswordForm.controls.oldpassword.valid
    //         && this.showResetPasswordForm.controls.newpassword.valid) {
         // after UI form validation passed, 
        // we will need to validate captcha at server-side before we save form data in database, etc.

        // captcha id for validating captcha at server-side
        // var captchaId = captchaId;
        // var captchaCode = captchaCode;
        // const Url = 'BasicHandler.ashx';
        // captcha code input value for validating captcha at server-side
       
        let passwordResetModel={
          //"Email":this.showResetPasswordForm.controls.email.value,
          "Password":this.showResetPasswordForm.controls.oldpassword.value,
         "NewPassword":this.showResetPasswordForm.controls.newpassword.value,
        //  "captchaCode": this.captchaComponent.captchaCode,
        //  "captchaId": this.captchaComponent.captchaId
        }
        // form is valid
        // we send contact data as well as captcha data to server-side for
        // validating once again before they are inserted into database
        
         this.apiService.postService(this.apiService.ResetPassword,passwordResetModel,(response)=>{
        //this.http.post(Url,passwordResetModel).subscribe((Response:any)=>{
          if(response.Status.Number==0){
            //this.toastr.success("User Added Successfully");
            this.toastr.success("Password reset successfully. please login")
           this.Auth.logout();
          }
          else
          {
            this.overlays=false;
            this.toastr.warning(this.messageProvider.showMessage(response.Status.Number));
          }
  
        },(error)=>{
          this.overlays=false;
          this.toastr.error("Something went wrong");
  
        })
      }
  
    }
  }
