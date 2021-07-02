import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator,MatTableDataSource} from '@angular/material';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';
import { GlobalService } from '../global.service';
import { ToastrService } from 'ngx-toastr';
import { MessageProviderService } from '../message-provider.service';
import {APIsService} from '../apis.service';
import { AuthService } from '../auth.service';
import { resolve } from 'url';


@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})


export class GroupListComponent implements OnInit {
  color = 'primary';
  mode = 'indeterminate';
  value = 90;
  
  displayedColumns: string[] = ['Sr No', 'Group Name', 'Total Members', 'Action'];

   overlays:boolean=true;
   paginatorShow:boolean=false;

  public data:Array<{
    Count:number,
    GroupId:number,
    GroupName:string,
    GroupMemberCount:number,
  
  }>=[]

  dataSource:any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private auth:AuthService,private http:HttpClient,private apiService:APIsService,private router:Router,private globalService:GlobalService,private toastr:ToastrService,private messageProvider:MessageProviderService) { }

  ngOnInit() {
    this.overlays=true;
    this.getGroupList();
}

   getGroupList()
  {
    
    this.apiService.getService(this.apiService.GetGroupList,(response)=>{
    // this.http.get(API_URL,httpOptions)
    // .subscribe((response:any)=>{

    if(response.Status.Number == 0)
    {
      this.data=[];
   
      for (let i=0; i < response.groupListModel.length; i++) {
        this.data.push({
          Count:i+1,
          GroupId:response.groupListModel[i].ID,
          GroupName:response.groupListModel[i].GroupName,
          GroupMemberCount:response.groupListModel[i].GroupMemberCount   
        })
      }
      if(response.groupListModel.length==this.data.length){
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator= this.paginator;
      }
      if(response.groupListModel.length>10)
      {
        this.paginatorShow=true;
      }
      this.overlays=false;
    }
    else
    {
      this.toastr.warning(this.messageProvider.showMessage(response.Status.Number));
      this.overlays=false;
    }
     
    },(error:any)=>{
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
   navigateLoading(group){
    this.overlays=true;   
    this.router.navigate(['/group-edit/', group.GroupId]);
  }

   deleteGroup(element)
  {
    this.overlays=true;

     var params = new HttpParams()
          .set('groupId', element.GroupId)
  
    this.apiService.getServiceWithParams(this.apiService.DeleteSpecificGroups,params,(response)=>{
    if(response.Status.Number == 0)
    {
     this.getGroupList();
    this.toastr.success("Group deleted successfully"); 
    } 
    else{
      this.toastr.warning(this.messageProvider.showMessage(response.Status.Number));
      this.overlays=false;
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

//dependency injection 



}//End of Class


class person 
{
  constructor()
  {
     let a = new manoj();
     let b = new sanket();
  }
}

class manoj 
{

}

class sanket
{

}








