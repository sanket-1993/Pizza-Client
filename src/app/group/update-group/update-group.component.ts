import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Router,ActivatedRoute,Resolve,RouterStateSnapshot,ActivatedRouteSnapshot}  from '@angular/router';
import { FormGroup } from '@angular/forms';
import { FormBuilder,FormArray, FormControl,Validators } from '@angular/forms';
import { GlobalService } from '../../services/global.service';
import { ToastrService } from 'ngx-toastr';
import { MessageProviderService } from '../../services/message-provider.service';
import { APIsService} from '../../services/apis.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-update-group',
  templateUrl: './update-group.component.html',
  styleUrls: ['./update-group.component.scss']
})
export class UpdateGroupComponent implements OnInit {
   groupId:any;
   groupName = new FormControl('',[Validators.required]);
   overlays:boolean=true; 
   userlistform: FormGroup;

    dataSource:Array<{
      UserId:any,
      FullName:any,
      IsMember:any    
  }>=[];

  UserIds:Number[]=[];

  constructor(private auth:AuthService,private apiService:APIsService,private router:Router, private route: ActivatedRoute,private http:HttpClient,private formBuilder:FormBuilder,private globalService:GlobalService,private toastr:ToastrService,private messageProvider:MessageProviderService) { }

  ngOnInit() {
    this.userlistform = this.formBuilder.group({
      dataSource: this.formBuilder.array([]),
      groupName:['',Validators.required]
    });
    this.groupId=this.route.snapshot.paramMap.get('id');
    this.getSpecificGroup();
  }

  getSpecificGroup(){
    
     var params = new HttpParams()
          .set('groupId',this.groupId)
  
    this.apiService.getServiceWithParams(this.apiService.GetSpecificGroup,params,(response)=>{

      if (response.Status.Number == 0) {
          this.groupName.setValue(response.groupDetailsModel.groupName);
          for (let i = 0; i < response.groupDetailsModel.usersDetails.length; i++) {
            this.dataSource.push({
              UserId: response.groupDetailsModel.usersDetails[i].UserId,
              FullName: response.groupDetailsModel.usersDetails[i].UserName,
              IsMember: response.groupDetailsModel.usersDetails[i].IsMember
            })
            if (response.groupDetailsModel.usersDetails[i].IsMember == true) {
              this.UserIds.push(response.groupDetailsModel.usersDetails[i].UserId);
            }
          }
          this.overlays=false;
      
      }
      else
      {
        this.overlays=false;
        this.toastr.warning(this.messageProvider.showMessage(response.Status.Number));
      }
            
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

   submitList() {
    
      this.overlays=true;
      let selectedusers=this.userlistform.value.dataSource;
      let groupName=this.groupName;
      for(let i=0;i<selectedusers.length;i++){
         this.UserIds.push(selectedusers[i].UserId);
       }

      if(this.UserIds.length==0)
      {
        this.toastr.error("Select alteast One User");
        this.overlays=false;
        return;
      }
      let GroupDetailsModel={
        "groupId":this.groupId,
        "groupName":groupName.value,
        "UserIds":this.UserIds,
        "usersDetails":this.dataSource
      };

      this.apiService.postService(this.apiService.UpdateGroupInformation,GroupDetailsModel,(response)=>{
        if(response.Status.Number==0)
        {
          this.UserIds=[];
          this.toastr.success("Group Updated Successfully");
          this.router.navigateByUrl('/groupList');
        }
         else
         {
           this.overlays=false;
           this.toastr.warning(this.messageProvider.showMessage(response.Status.Number));
         }
      },(error) => {
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
  onChange(event) {

    const interests = <FormArray>this.userlistform.get('dataSource') as FormArray;
    if(event.checked) {
      interests.push(new FormControl(event.source.value))

      if(event.source.value.IsMember!=true)
      {
        event.source.value.IsMember=true;
      }

    } else {
      if(event.source.value.IsMember!=false)
      {
        event.source.value.IsMember=false;
      }
      const i = interests.controls.findIndex(x => x.value === event.source.value);
      interests.removeAt(i);
 
    }
  }
}
