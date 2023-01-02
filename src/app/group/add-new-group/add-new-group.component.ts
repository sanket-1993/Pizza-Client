import { Component, OnInit,ViewChild } from '@angular/core';
import { MatCardModule} from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import {HttpClient,HttpParams,HttpHeaders} from '@angular/common/http';
import { FormBuilder, FormGroup, FormArray, FormControl,Validators } from '@angular/forms';
import { GlobalService } from '../../services/global.service';
import { ToastrService } from 'ngx-toastr';
import { MessageProviderService } from '../../services/message-provider.service';
import { APIsService } from '../../services/apis.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-new-group',
  templateUrl: './add-new-group.component.html',
  styleUrls: ['./add-new-group.component.scss']
})
export class AddNewGroupComponent implements OnInit {

  color = 'primary';
  mode = 'indeterminate';
  value = 90;
  
  userlistform: FormGroup;
  dataSource:Array<{
    UserId:any,
    FullName:any,
  }>=[];
  listData:any;
  UserIds:Number[]=[];
  groupName:String;
  overlays:boolean=true;
  form: FormGroup;
  orders : Array<{
    UserId:any,
    FullName:any,
  }>=[];
  DataLoaded: Boolean = false;
  showUserSelectionError:Boolean=false;
  Token:any;

  constructor(private auth:AuthService,private http:HttpClient,private apiService:APIsService, private formBuilder:FormBuilder,private router: Router,private globalService:GlobalService,private toastr:ToastrService,private messageProvider:MessageProviderService ) { }

  ngOnInit() {
    this.Token=this.globalService.token;
    this.loadData();
  }

  private loadData(){

    this.apiService.getService(this.apiService.GetUsers,(response)=>{
    if(response.Status.Number==0)
    {
      for (let i = 0; i < response.userInfoModel.length; i++) {
        this.dataSource.push({
          UserId:response.userInfoModel[i].UserId,
          FullName:response.userInfoModel[i].FullName,
        })
      }
      if(response.userInfoModel.length==this.dataSource.length){
        
        this.userlistform = this.formBuilder.group({
          dataSource: this.formBuilder.array([]),
          groupName:['',Validators.required]
        });
        this.DataLoaded=true;
      }
      this.overlays=false;
    }
    else
    {
      this.toastr.warning(this.messageProvider.showMessage(response.Status.Number));
      this.overlays=false;
    }
    },(error)=>{
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

  private submitList() {
    if(this.userlistform.invalid){
      return;
    }else{
      this.showUserSelectionError=false;
      this.overlays=true;
      let selectedusers=this.userlistform.value.dataSource;
      let groupName=this.userlistform.value.groupName;
      for(let i=0;i<selectedusers.length;i++){
        this.UserIds.push(selectedusers[i].UserId);
      }

      if(this.UserIds.length==0)
      {
        this.showUserSelectionError=true;
        this.overlays=false;
        return;
      }
      let GroupDetailsModel={
        "groupName":groupName,
        "UserIds":this.UserIds,
      };

      this.apiService.postService(this.apiService.CreateNewGroup,GroupDetailsModel,(response)=>{
          if(response.Status.Number==0)
          {
            this.UserIds=[];
            this.toastr.success("Group Added Successfully");
            this.router.navigateByUrl('/groupList');
          }
          else 
          {
            this.UserIds=[];
            this.toastr.warning(this.messageProvider.showMessage(response.Status.Number));
            this.overlays=false;
          }
         
      },(error) => {
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
  
  onChange(event) {
    const interests = <FormArray>this.userlistform.get('dataSource') as FormArray;
    if(event.checked) {
      interests.push(new FormControl(event.source.value))
    } else {
      const i = interests.controls.findIndex(x => x.value === event.source.value);
      interests.removeAt(i);
    }
    if(interests.length>0){
      this.showUserSelectionError=false;
    }else{
      this.showUserSelectionError=true;
    }
  }
}