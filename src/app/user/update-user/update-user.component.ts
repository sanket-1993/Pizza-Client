import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { MatPaginator,MatTableDataSource} from '@angular/material';
import { HttpClient, HttpParams, HttpHeaders} from '@angular/common/http'
import {FormControl, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { ToastrService } from 'ngx-toastr';
import { MessageProviderService } from '../../services/message-provider.service';
import { APIsService } from '../../services/apis.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {
  color = 'primary';
  mode = 'indeterminate';
  value = 90;


  updateUserForm:FormGroup;
  formError:any;

  RoleInfoArray:Array<{
    Id:Number,
    Permission:Number,
    Name:string,
  }>=[];

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  minDate = new Date(1918, 0, 1);
  maxDate = new Date(2018, 0, 1);

   userId:any;
   companyName:string;
   fullName:string;
   email:string;
   birthDate:Date;
   contact:string;
   showMessage:boolean=false;
   overlays:boolean=true;

  constructor(private auth:AuthService,private apiService:APIsService,private http:HttpClient, private formBuilder:FormBuilder,private router: Router,private route: ActivatedRoute,private globalService:GlobalService,private toastr:ToastrService,private messageProvider:MessageProviderService) { }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.updateUserForm=this.formBuilder.group({
      PermissionId: ['',Validators.required],
      companyName: ['',Validators.required],
      fullName: ['',Validators.required],
      email: ['',[Validators.required, Validators.email]],
      birthDate:[''],
      contact:['']
    });
    this.formError=this.updateUserForm.controls;
    this.overlays=false;
    this.getRoleInfo();
    this.getSpecificUser();   
  }

  getRoleInfo()
  {
    const ROLE_URL=this.apiService.URL+this.apiService.GetRoleInfo;
  
    const headers={
      headers:new HttpHeaders({
        'Authorization':'Bearer '+window.localStorage.getItem('TokenInLocal'),
      })
    }

    this.http.get(ROLE_URL,headers).subscribe((response:any)=>{
      if(response.Status.Number==0)
      {
        for (let i = 0; i < response.roleInfo.length; i++) {
         
            let data = {
              Id:response.roleInfo[i].Id,
              Permission:response.roleInfo[i].PermissionId,
              Name:response.roleInfo[i].RoleName,                 
            }
            this.RoleInfoArray.push(data);        
        }

        if(response.roleInfo.length==this.RoleInfoArray.length){
          this.RoleInfoArray = this.RoleInfoArray;
        }

        this.overlays=false;
      }
      else
      {
        this.toastr.warning(this.messageProvider.showMessage(response.Status.Number));
        this.overlays=false;
      }
    },(error:any)=>{

      this.overlays=false;
      this.toastr.warning("Something went wrong");

    })
  }
   getSpecificUser()
  {
     var params= new HttpParams()
          .set('UserId',this.userId)
  

this.apiService.getServiceWithParams(this.apiService.GetSpecificUser,params,(response)=>{

      this.updateUserForm.patchValue({
        companyName: response.userInfoModel.Company, 
        fullName: response.userInfoModel.FullName,
        email: response.userInfoModel.Email,
        birthDate:response.userInfoModel.DOB,
        contact:response.userInfoModel.Contact,
      });

      this.updateUserForm.controls.PermissionId.setValue(this.RoleInfoArray.find(key => key['Id'] == response.userInfoModel.Permission));
    
    },(error)=>{
      if(error.status==401)
        {     
          this.toastr.warning("please login");
          this.auth.logout();
        }
        else
        {
          this.overlays=false;
          this.toastr.warning("Something went wrong");
        }
  })
  }
 
     submit(){
      if(this.updateUserForm.invalid){
        return;
      }
      else{
        this.overlays=true;
        let userInfoModel = {
          "UserId":this.userId,
          "FullName": this.updateUserForm.value.fullName,
          "Company":this.updateUserForm.value.companyName,
          "Email":this.updateUserForm.value.email,
          "Contact":this.updateUserForm.value.contact,
          "Permission":this.updateUserForm.value.PermissionId.Id,
          "DOB":new Date(this.updateUserForm.value.birthDate).toDateString()
        };

        this.apiService.postService(this.apiService.UpdateUser,userInfoModel,(response)=>{
          if(response.Status.Number==0){
            this.router.navigateByUrl('/userList');
            this.toastr.success("User Information Updated");
          }
          else{
            this.overlays=false;
            this.toastr.warning(this.messageProvider.showMessage(response.Status.Number));
          }
        },(error)=>{
          console.log(error);
          if(error.status==401)
          {     
            this.toastr.warning("please login");
            this.auth.logout();
          }
          else
          {
            this.overlays=false;
            this.toastr.warning("Something went wrong");
          }
        })
      }
    }

}

