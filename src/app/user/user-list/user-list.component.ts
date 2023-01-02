import { Component, OnInit,ViewChild } from '@angular/core';
import { MatPaginator,MatTableDataSource} from '@angular/material';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';
import {GlobalService} from '../../services/global.service';
import { ToastrService } from 'ngx-toastr';
import { MessageProviderService } from '../../services/message-provider.service';
import { APIsService } from '../../services/apis.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {


  color = 'primary';
  mode = 'indeterminate';
  value = 90;
  
   overlays:boolean=true;
  displayedColumns: string[] = ['Sr No','User Name','Company', 'Contact No','Action'];

  public data:Array<{
    Count:number,
    UserId:number,
    FullName:string,
    Company:string,
    Contact:string, 
    Email:string,
  }>=[]

  dataSource:any;
  paginatorShow:boolean=false;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private auth:AuthService,private apiService:APIsService,private http:HttpClient,private router:Router,private globalService:GlobalService,private toastr:ToastrService,private messageProvider :MessageProviderService) { }

  ngOnInit() {
  this.getAllUsers();    

  }

   getAllUsers()
  {
    this.apiService.getService(this.apiService.GetUsers,(response)=>{
      
      if(response.Status.Number == 0)
      {
        for (let i  =0; i<response.userInfoModel.length; i++) {
          this.data.push({
            Count:i+1,
            UserId:response.userInfoModel[i].UserId,
            FullName:response.userInfoModel[i].FullName,
            Company:response.userInfoModel[i].Company,
            Contact:response.userInfoModel[i].Contact,
            Email:response.userInfoModel[i].Email
          })
        }
        if(response.userInfoModel.length==this.data.length){
          this.dataSource = new MatTableDataSource(this.data);
          this.dataSource.paginator= this.paginator;
        }
  
        if(response.userInfoModel.length>10)
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

   navigateLoading(element){
    this.overlays=true;
    
    this.router.navigate(['/user-edit/', element.UserId]);
  }

   deleteUser(element)
  {
    this.overlays=true;
     var params= new HttpParams()
          .set('UserId', element.UserId)
  

    this.apiService.getServiceWithParams(this.apiService.DeleteUser,params,(response)=>{

      if(response.Status.Number==0)
      {
        this.toastr.success("User deleted successfully");
        this.data = this.data.filter(o=>o.UserId != element.UserId)
        this.dataSource = new MatTableDataSource(this.data);
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
}
