import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders} from '@angular/common/http'
import {FormControl, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { GlobalService } from '../global.service';
import { ToastrService } from 'ngx-toastr';
import { MessageProviderService } from '../message-provider.service';
import { APIsService } from '../apis.service';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-add-new-user',
  templateUrl: './add-new-user.component.html',
  styleUrls: ['./add-new-user.component.scss']
})

export class AddNewUserComponent implements OnInit {
  color = 'primary';
  mode = 'indeterminate';
  value = 90;

  addNewUserForm:FormGroup;
  formError:any;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

   Token:any;

  minDate = new Date(1918, 0, 1);
  maxDate = new Date(2018, 0, 1);

  RoleInfoArray:Array<{
    Id:Number,
    Permission:Number,
    Name:string,
  }>=[];

   companyName:string;
   firstName:string;
   lastName:string;
   email:string;
   birthDate:string;
   contact:string;
   showMessage:boolean=false;
   overlays:boolean=false;
   permissionId:number;
  constructor(private auth:AuthService,private http:HttpClient, private apiService:APIsService,private formBuilder:FormBuilder,private router: Router,private globalService:GlobalService,private toastr:ToastrService,private messageProvider:MessageProviderService) { 

  }

  
  ngOnInit() {
    this.Token=this.globalService.token;

    this.addNewUserForm=this.formBuilder.group({
      PermissionId:['',Validators.required],
      companyName: ['',Validators.required],
      firstName: ['',Validators.required],
      lastName: ['',Validators.required],
      email: ['',[Validators.required, Validators.email]],
      birthDate:[''],
      contact:['']
    });
    this.formError=this.addNewUserForm.controls;
    this.getRoleInfo();
  }
  getRoleInfo()
  {
    const ROLE_URL=this.apiService.API_URL+this.apiService.GetRoleInfo;
  
    const headers={
      headers:new HttpHeaders({
        'Authorization':'Bearer '+window.localStorage.getItem('TokenInLocal'),
      })
    }

    this.http.get(ROLE_URL,headers).subscribe((response:any)=>{
      if(response.Status.Number==0)
      {
  
        for (let i = 0; i < response.roleInfo.length; i++) {
          if(response.roleInfo[i].RoleName != "Unauthorize")
          {
          
            let data = {
              Id:response.roleInfo[i].Id,
              Permission:response.roleInfo[i].PermissionId,
              Name:response.roleInfo[i].RoleName,                 
            }
            this.RoleInfoArray.push(data);
            // if(response.roleInfo[i].RoleName == "Normal User")
            // {
            //   this.permissionId=response.roleInfo[i].Id
            // }
          }
          
        }

        if(response.roleInfo.length==this.RoleInfoArray.length){
          this.RoleInfoArray = this.RoleInfoArray;
        }
        this.addNewUserForm.controls.PermissionId.setValue(this.RoleInfoArray.find(key => key['Name'] == "Normal User"));

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
  getRoleId(event)
  {
    if(event.isUserInput)
    {
      this.permissionId=event.source.value.Id;

    }
  }


   submit(){

    if(this.addNewUserForm.invalid){
      return;
    }
    else{
      this.overlays=true;
      let userInfoModel=[];
      let userInformation = {
        "FirstName": this.addNewUserForm.value.firstName,
        "LastName": this.addNewUserForm.value.lastName,
        "Company":this.addNewUserForm.value.companyName,
        "Email":this.addNewUserForm.value.email,
        "Contact":this.addNewUserForm.value.contact,
        "Permission":this.addNewUserForm.value.PermissionId.Id,
        "DOB":this.addNewUserForm.value.birthDate.toDateString()
      };

      //const SUBCATEGORY_URL="http://caivaportalpluswebservices.azurewebsites.net/api/User/AddNewUser";
     // const SUBCATEGORY_URL=this.apiService.API_URL+this.apiService.AddNewUser;
      // const headers={
      //   headers:new HttpHeaders({
      //     'Authorization':'Bearer '+window.localStorage.getItem('TokenInLocal'),
      //   })
      // }
      userInfoModel.push(userInformation);
      this.apiService.postService(this.apiService.AddNewUser,userInfoModel,(response)=>{

      //this.http.post(SUBCATEGORY_URL,userInfoModel,headers).subscribe((Response:any)=>{
        if(response.Status.Number==0){
          this.toastr.success("User Added Successfully");
          this.router.navigateByUrl('/userList');
        }
        else
        {
          this.overlays=false;
          this.toastr.warning(this.messageProvider.showMessage(response.Status.Number));
        }

      },(error)=>{
        console.log("error",error);
        if(error.status==401)
        {     
          this.toastr.warning("Please login");
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
