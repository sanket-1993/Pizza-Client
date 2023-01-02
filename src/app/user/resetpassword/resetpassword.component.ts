import { Component, OnInit ,ViewChild} from '@angular/core';
import {FormControl, Validators, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import { APIsService} from '../../services/apis.service';
import {MessageProviderService} from '../../services/message-provider.service';
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
  oldpassword = new FormControl('', [Validators.required]);
  newpassword= new FormControl('', [Validators.required]);
  hide = false;
  constructor(private apiService:APIsService,private router: Router,private formBuilder: FormBuilder,private toastr:ToastrService,private messageProvider:MessageProviderService, private Auth: AuthService,public http: HttpClient){}

  ngOnInit() {

    this.showResetPasswordForm = this.formBuilder.group({
      oldpassword: ['', [Validators.required]],
      newpassword: ['',[Validators.required]],
     
    });
    this.overlays=false;
  }
  recaptcha_callback()
  {
   
    var response = grecaptcha.getResponse();
    if(response.length == 0) {
       this.toastr.error('Please verify that you are a Human.');
    } else {
        this.isCaptchaValidated=false;
    }
    
  }
  

  get checkform() { 
    return this.showResetPasswordForm.controls; 
  }

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

       
        let passwordResetModel={
          "Password":this.showResetPasswordForm.controls.oldpassword.value,
         "NewPassword":this.showResetPasswordForm.controls.newpassword.value,
        }

        
         this.apiService.postService(this.apiService.ResetPassword,passwordResetModel,(response)=>{
          if(response.Status.Number==0){
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
