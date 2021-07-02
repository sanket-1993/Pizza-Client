import { Component, OnInit,ViewChild } from '@angular/core';
import { MatPaginator,MatTableDataSource} from '@angular/material';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import {GlobalService} from '../global.service';
import { ToastrService } from 'ngx-toastr';
import { MessageProviderService } from '../message-provider.service';
import { APIsService }  from '../apis.service';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  overlays:boolean=false;
  displayedColumns: string[] = ['Sr No', 'Category Name', 'Total SubCategories','Action'];

  categoryName:string;

  public data:Array<{
    Count:number,
    CategoryId:number,
    CategoryName:string,
    SubCategoryCount:number,
    
  }>=[]
  paginatorShow:boolean=false;
  dataSource:any;
   Token:any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private auth:AuthService,private http:HttpClient,private apiService:APIsService, private router: Router,private globalService:GlobalService,private toastr:ToastrService,private messageProvider:MessageProviderService) { }
  
  ngOnInit() {
    this.getCategoryList();
  }

  getCategoryList(){
   
    this.apiService.getService(this.apiService.GetCategoryList,(response)=>{
 
      if(response.Status.Number == 0)
      {
        this.data=[];
        this.dataSource=[];
   
        for (let i = response.reportCategoryModel.length-1,j=0; i >=0 && j<response.reportCategoryModel.length; i--,j++) {
          this.data.push({
            Count:j+1,
            CategoryId:response.reportCategoryModel[i].CategoryId,
            CategoryName:response.reportCategoryModel[i].CategoryName,
            SubCategoryCount:response.reportCategoryModel[i].SubCategoryCount,
          })
        }
        if(response.reportCategoryModel.length==this.data.length){
          this.dataSource = new MatTableDataSource(this.data);
          this.dataSource.paginator= this.paginator;
        }
        if(response.reportCategoryModel.length>10){
          this.paginatorShow=true;
        }
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

   insertCategory() {
    this.overlays=true;

    if(this.categoryName!=undefined && this.categoryName!=''){
       var params = new HttpParams()
            .set('categoryName', this.categoryName);
    
      this.apiService.getServiceWithParams(this.apiService.AddNewCategory,params,(response)=>{
        if(response.Status.Number == 0)
        {
          this.getCategoryList();
          this.overlays=false;
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

      });
    }
    else
    {
      this.overlays=false;
      this.toastr.warning("Insert category name");
    }
  }
  

   navigateLoading(category){
    this.overlays=true;    
    this.router.navigate(['/category-edit/', category.CategoryId]);
  }

  deleteLoading(category){
    this.overlays=true; 

    var params = new HttpParams()
    .set('categoryId', category.CategoryId);   

    this.apiService.getServiceWithParams(this.apiService.DeleteCategory,params,(response)=>{
  
      if(response.Status.Number == 0)
      {
        this.getCategoryList();
        this.data = this.data.filter(o=>o.CategoryId != category.CategoryId)
        this.dataSource = new MatTableDataSource(this.data);
        this.overlays=false;        
      }
      else
      {
        this.getCategoryList();
        this.dataSource = new MatTableDataSource(this.data);
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

    });
  }
}//End of Class