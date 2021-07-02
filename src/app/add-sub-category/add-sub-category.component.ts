import { Component, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { MatPaginator,MatTableDataSource} from '@angular/material';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { GlobalService} from '../global.service';
import { ToastrService } from 'ngx-toastr';
import { MessageProviderService } from '../message-provider.service';
import { APIsService } from '../apis.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-add-sub-category',
  templateUrl: './add-sub-category.component.html',
  styleUrls: ['./add-sub-category.component.scss']
})
  
export class AddSubCategoryComponent implements OnInit {

   categoryName:string='';
   message:string='Update Category Name';
   subCategoryName:string='';
   overlays:boolean=false;
   paginatorShow:boolean=false;
   displayedColumns: string[] = ['SubCategory','Action'];
   data:Array<{
    SubCategoryId:string,
    SubCategoryName:string,
    linkedWithReport:boolean
  }>=[];
  
 
   categoryID: any;
   dataSource:any;
   Token:any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private auth:AuthService,private http:HttpClient,private apiService:APIsService ,private route: ActivatedRoute, private router:Router,private globalService:GlobalService,private toastr:ToastrService,private messageProvider:MessageProviderService) {
   
  }

  ngOnInit() {
    this.subCategoryName="";
      this.categoryID = this.route.snapshot.paramMap.get('id');
    this.getSubCategoryData();
  }

  getSubCategories()
  {
    const API_URL=this.apiService.API_URL+this.apiService.GetSubCategory;

    const headers={
      headers:new HttpHeaders({
        'Authorization':'Bearer '+window.localStorage.getItem('TokenInLocal'),
      })
    }

    this.http.get(API_URL,headers).subscribe((response:any) => {

      if(response.Status.Number==0){
        if(response.reportSubCategoryModel.length>0){
          for(let i=0;i<response.reportSubCategoryModel.length;i++){
            for(let j=0;j<this.data.length;j++){
              if(response.reportSubCategoryModel[i].SubCategoryId==this.data[j].SubCategoryId){
                this.data[j].linkedWithReport=true;
              }
            }
          }
        }
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


   getSubCategoryData(){
    //const API_URL="http://caivaportalpluswebservices.azurewebsites.net/api/Report/GetSpecificCategory";
    // const API_URL=this.apiService.API_URL+this.apiService.GetSpecificCategory;    
    // const options= {
    //   headers: new HttpHeaders({
    //     'Authorization':'Bearer '+window.localStorage.getItem('TokenInLocal'),
    //   }),
     var params =new HttpParams()
          .set('categoryId', this.categoryID)
      

    this.apiService.getServiceWithParams(this.apiService.GetSpecificCategory,params,(response:any)=>{
  
        if(response.Status.Number==0){
          this.categoryName=response.reportCategoryModel.CategoryName;
          let data=response.reportCategoryModel.ReportSubCategoryModel;
          for(let i=0;i<data.length;i++){
            let CategoryData= {
              SubCategoryId:data[i].SubCategoryId,
              SubCategoryName:data[i].SubCategoryName,
              linkedWithReport:false,
            }
            this.data.push(CategoryData);
          }
          if(data.length==this.data.length){
            this.dataSource = new MatTableDataSource(this.data);
            this.dataSource.paginator= this.paginator;
            this.getSubCategories();
          } 
          if(data.length>10)
          {
            this.paginatorShow=true;
          }
        }
        else{
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

   updateCategory(){
    this.overlays=true;
    if(this.categoryName!=undefined && this.categoryName!=''){
      
      let reportCategoryModel={
        CategoryId:this.categoryID,
        CategoryName:this.categoryName
      }
      this.apiService.postService(this.apiService.UpdateReportCategory,reportCategoryModel,(response)=>{
    
        if(response.Status.Number==0){
          this.router.navigate(['/category'])
        }
        else{
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
  }
  
 AddSubCategory(){
  this.overlays=true;

  if(this.subCategoryName!=undefined && this.subCategoryName!=''){
   
    let reportSubCategoryModel={
      SubCategoryName:this.subCategoryName,
      SubCategoryId:"",
      linkedWithReport: false,
    }
  
    this.data=[];
    
    this.data.push(reportSubCategoryModel);
    
    let reportCategoryModel={
      CategoryId:this.categoryID,
      reportSubCategoryModel:this.data
    }
    this.apiService.postService(this.apiService.AddNewSubCategory,reportCategoryModel,(response)=>{

      if(response.Status.Number == 0)
      {
        this.data=[];
        this.overlays=false;
        this.getSubCategoryData();
      }
      else
      {
        this.overlays=false;
        this.toastr.warning(this.messageProvider.showMessage(response.Status.Number));
      }
    },(error) => {
      this.data=[];
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  navigateLoading(element)
  {
    var retVal = prompt("Update SubCategory name : ", element.SubCategoryName);
    if(retVal!=element.SubCategoryName && retVal!=null && retVal!='')
    {
      this.overlays=true;
      let reportCategoryModel={
        CategoryId:element.SubCategoryId,
        CategoryName:retVal
      }
      this.apiService.postService(this.apiService.UpdateReportSubCategory,reportCategoryModel,(response)=>{
     
        this.data=[];
        this.toastr.success("updated successfully");
        this.overlays=false;
        this.ngOnInit();
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
    
  }

  deleteLoading(element)
  {
   
   
      this.overlays=true;

      var params= new HttpParams()
      .set('subcategoryId', element.SubCategoryId)
      
      this.apiService.getServiceWithParams(this.apiService.DeleteSubCategory,params,(response)=>{
     
        if(response.Status.Number == 0)
        {
          this.data=[];
          this.toastr.success("deleted successfully");
          this.overlays=false;
          this.ngOnInit();
        }
        else
        {
          this.overlays=false;
          this.toastr.warning(this.messageProvider.showMessage(response.status.Number));
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
}//End of Class