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
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  color = 'primary';
  mode = 'indeterminate';
  value = 90;

  isCaptchaValidated:boolean=true;

  overlays:boolean=true;
  showForgotPasswordForm: FormGroup;
  email= new FormControl('', [Validators.required]);
  hide = false;

  constructor(private apiService:APIsService,private router: Router,private formBuilder: FormBuilder,private toastr:ToastrService,private messageProvider:MessageProviderService, private Auth: AuthService,public http: HttpClient){}
 

  ngOnInit() {
    this.showForgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required]],
  
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
 return this.showForgotPasswordForm.controls; 
 }

  getErrorMessage(){
  return this.checkform.email.hasError('required') ? 'You must enter a email':'';
  }
   
  ForgotPassword(){

    if (this.showForgotPasswordForm.invalid) {
     return;
   }else{
     this.overlays=true;

     var params= new HttpParams()
          .set('userEmail', this.showForgotPasswordForm.value.email)


      this.apiService.getServiceWithParams(this.apiService.ForgotPassword,params,(response)=>{
        //this.http.post(Url,passwordResetModel).subscribe((Response:any)=>{
          if(response.Status.Number==0){
            //this.toastr.success("User Added Successfully");
            this.toastr.success("New Password send to your email. please login")
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
