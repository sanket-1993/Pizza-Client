import { Component, OnInit,ViewChild } from '@angular/core';
import { MatPaginator,MatTableDataSource} from '@angular/material';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { GlobalService } from '../global.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APIsService } from '../apis.service';
import { AuthService } from '../auth.service';
import { MessageProviderService } from '../message-provider.service';
@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})

export class ReportListComponent implements OnInit {

  color = 'primary';
  mode = 'indeterminate';
  value = 90;
  
  overlays:boolean=true;
  displayedColumns: string[] = ['Sr No', 'Author', 'SubCategory', 'Action'];
  public data:Array<{
    Count:number,
    ReportId:number,
    SubCategoryName:string,
    CategoryId:number,
    SubcategoryId:number,
    Description:string,
    AuthorId:number,
    AuthorName:string,
    CreationDate:Date,
  }>=[]

  paginatorShow:boolean=false;

  dataSource:any;
  //dataSource = new MatTableDataSource(this.data);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private messageProvider:MessageProviderService,private auth:AuthService,private apiService:APIsService, private http:HttpClient,private globalService:GlobalService,private router:Router,private toastr:ToastrService) { }

  ngOnInit() {
    this.overlays=true;
    this.getReportList();

  }

   getReportList()
  {
  
    this.apiService.getService(this.apiService.GetAllReports,(response)=>{
    // this.http.get(API_URL,httpOptions)
    //   .subscribe((response:any)=>{
      if(response.Status.Number == 0)
      {
        this.data=[];

        for (let i =0; i<response.reportDetails.length ; i++) {
          this.data.push({
            Count:i+1,
            ReportId:response.reportDetails[i].ReportId,
            SubCategoryName:response.reportDetails[i].SubCategoryName,
            CategoryId:response.reportDetails[i].CategoryId,
            SubcategoryId:response.reportDetails[i].SubcategoryId,
            Description:response.reportDetails[i].Description,
            AuthorId:response.reportDetails[i].AuthorId,
            AuthorName:response.reportDetails[i].Author,
            CreationDate:response.reportDetails[i].CreationDate,
          })
        }
        if(response.reportDetails.length==this.data.length){
          this.dataSource = new MatTableDataSource(this.data);
          this.dataSource.paginator= this.paginator;
        }

        if(response.reportDetails.length>10)
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
  
    this.router.navigate(['/report-edit/', element.ReportId]);
  }

   deleteReport(element)
  {
    this.overlays=true;

    // const DELETE_API=this.apiService.API_URL+this.apiService.DeleteReport;

    // const options= {
    //   headers: new HttpHeaders({
    //     'Authorization':'Bearer '+window.localStorage.getItem('TokenInLocal'),
    //   }),
     var params =new HttpParams()
          .set('reportId', element.ReportId)
  
    this.apiService.getServiceWithParams(this.apiService.DeleteReport,params,(response:any)=>{
    // this.http.get(DELETE_API,options)
    // .subscribe((response:any)=>{ 
      if(response.Status.Number == 0)
      {
        //this.getReportList();
        this.data = this.data.filter(o=>o.ReportId != element.ReportId)
        this.dataSource = new MatTableDataSource(this.data);
        this.overlays=false;
        this.toastr.success("Report deleted successfully"); 
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
}