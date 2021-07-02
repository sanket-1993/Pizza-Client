import { Component, OnInit } from '@angular/core';
import { Headers } from '@angular/http';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { MatFormField, MatSelect, MAT_SELECT_SCROLL_STRATEGY_PROVIDER } from '@angular/material';
import { FormBuilder, FormGroup, FormArray, FormControl,Validators } from '@angular/forms';
import {Router, RouterModule,ActivatedRoute } from '@angular/router';
import { GlobalService } from '../global.service';
import {RequestOptions} from '@angular/http'
import { ToastrService } from 'ngx-toastr';
import { MessageProviderService } from '../message-provider.service';
import { APIsService } from '../apis.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'update-report',
  templateUrl: './update-report.component.html',
  styleUrls: ['./update-report.component.scss']
})
export class UpdateReportComponent implements OnInit {
 

  color = 'primary';
  mode = 'indeterminate';
  value = 90;
  
  public reportlistform:FormGroup;

  public reportForm:FormGroup;

   categoryName:string='';
  
  selectedFile:File= null;

  public CategoryArray:Array<{
    CategoryId:string,
    CategoryName:string,
    SubCategoryCunt:number,
  }>=[];

   data:Array<{
    SubCategoryId:Number,
    SubCategoryName:string,
  }>=[];

   GroupInfoArray:Array<{
    GroupId:Number,
    GroupName:string,
    Check:boolean
  }>=[];

  public AuthorArray:Array<{
    UserId:number,
    UserName:string,
  }>=[];

  
  dataSource:any;
   reportId:string;
   width:number=1280;
   height:number=720;
   userAuthorId:string;
   categoryId:string;
   subCategoryId:string;
   categoryIdForCheck:any;
   SubCategoryIdCheck:any;
   authorIdCheck:any;
   Token:any;
   authorName:string;
   Description:string='';
   userGroup:string;
   usersGroupArray = [
    {name:'Group', value:false},
    {name:'All', value:true}
  ];
   GroupIds:Number[]=[];
   viewGroup:boolean=false;
   isPublic:boolean=true;
   overlays:boolean=true;

   formError:any;

  constructor(private apiService:APIsService,private auth:AuthService,private http:HttpClient,private formBuilder:FormBuilder,private route: ActivatedRoute,private router: Router,private globalService:GlobalService,private toastr:ToastrService,private messageProvider:MessageProviderService) { }

  ngOnInit() {
   
    this.getGroups();

    this.reportId = this.route.snapshot.paramMap.get('id');

    this.reportlistform = this.formBuilder.group({
      GroupInfoArray: this.formBuilder.array([]),
    })

  this.reportForm=this.formBuilder.group({
    Description: [''],
    userAuthorId: ['',Validators.required],
    categoryId:['',Validators.required],
    subCategoryId:['',Validators.required],
    userGroup:['All']
  });
   
    this.formError=this.reportForm.controls;
    
    this.getSpecificReport();  
  }


  getSpecificReport()
  {
    
     var params = new HttpParams()
          .set('ReportId', this.reportId)
  
    this.apiService.getServiceWithParams(this.apiService.GetSpecificReport,params,(response)=>{
    this.categoryId=response.reportDetail.CategoryId;
    this.subCategoryId=response.reportDetail.SubcategoryId;
    this.categoryIdForCheck=response.reportDetail.CategoryId;
    this.SubCategoryIdCheck=response.reportDetail.SubcategoryId;
    this.authorIdCheck=response.reportDetail.AuthorId;
    this.getCategory(this.categoryIdForCheck);
    this.getUserList(this.authorIdCheck);
    if(!response.reportDetail.IsPublic)
    {

      this.reportForm.controls.userGroup.setValue('Group');
      this.viewGroup=true;
      this.isPublic=false;
      for(let i = 0; i < this.GroupInfoArray.length; i++)
      {
        for(let j=0 ; j <response.reportDetail.GroupInfos.length;j++)
         {
           if(this.GroupInfoArray[i].GroupId==response.reportDetail.GroupInfos[j].GroupId)
           {
             this.GroupInfoArray[i].Check=true;
             this.GroupIds.push(response.reportDetail.GroupInfos[j].GroupId);
           }
         }
      }

      this.reportlistform = this.formBuilder.group({
        GroupInfoArray: this.formBuilder.array([]),
      })

    }
    this.reportForm.controls.Description.setValue(response.reportDetail.Description);
    //this.reportForm.controls.userAuthorId.setValue(this.AuthorArray.find(key => key['UserId'] == response.reportDetail.AuthorId));
    

    //this.getUserList();
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
    subCategory(event){
      var params = new HttpParams()
      .set('categoryId',this.categoryId)
      if(event.isUserInput != "Undefined")
      {
        if(event.isUserInput){
         
          this.apiService.getServiceWithParams(this.apiService.GetSpecificCategory,params,(response)=>{
            if(response.Status.Number == 0){
              
              this.data=[];
              this.categoryName=response.reportCategoryModel.CategoryName;
              let data=response.reportCategoryModel.ReportSubCategoryModel;
              for(let i=0;i<data.length;i++){
                let CategoryData= {
                  SubCategoryId:data[i].SubCategoryId,
                  SubCategoryName:data[i].SubCategoryName
                }
                this.data.push(CategoryData);

              }
              this.reportForm.controls.subCategoryId.setValue(this.data.find(key => key['SubCategoryId'] == this.SubCategoryIdCheck));
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
      
      }

    
  public groupcall(value){
    if(value=='Group'){
      this.viewGroup=true;
      this.isPublic=false;
    }
    else{
      this.reportlistform.value.GroupInfoArray=[];
      this.viewGroup=false;
      this.isPublic=true;
    }
  }

  //API to get Groups
  private getGroups(){
   
    this.apiService.getService(this.apiService.GetGroupList,(response)=>{
      if(response.Status.Number == 0)
      {
        for (let i = 0; i < response.groupListModel.length; i++) {
          let data = {
            GroupId:response.groupListModel[i].ID,
            GroupName:response.groupListModel[i].GroupName, 
            Check:false                
          }
          this.GroupInfoArray.push(data);
        }
        if(response.groupListModel.length==this.GroupInfoArray.length){
          this.reportlistform = this.formBuilder.group({
            GroupInfoArray: this.formBuilder.array([]),
          })
        }
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
  // End API to get Groups

  
   public submitForm(){
    this.overlays=true;
    if(this.reportForm.invalid){
      this.overlays=false;
      return;
    }else{
      let selectedGroupIds=this.reportlistform.value.GroupInfoArray;
      for(let i=0;i<selectedGroupIds.length;i++){
        this.GroupIds.push(selectedGroupIds[i].GroupId);
      }

      let reportDetail = {
        "ReportId":this.reportId,
        "AuthorId": this.reportForm.value.userAuthorId.UserId,
        "CategoryId":this.reportForm.value.categoryId.CategoryId,
        "SubcategoryId":this.reportForm.value.subCategoryId.SubCategoryId,
        "Description":this.reportForm.value.Description,
        "IsPublic":this.isPublic,
        "GroupIds":this.GroupIds,
        "Width":this.width,
        "Height":this.height
      };

      this.apiService.postService(this.apiService.UpdateReport,reportDetail,(response)=>{
      //this.http.post(ADDREPORT_API,reportDetail,headers).subscribe((response:any)=>{

        if(response.Status.Number==0)
        {
          this.router.navigateByUrl('reportList');
          this.toastr.success("Report Added SuccessFully");
        }
       else
       {
         this.overlays=false;
         this.toastr.warning(this.messageProvider.showMessage(response.Status.Number))
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


  getAuthorId(event,user){
    this.userAuthorId=event.source.value.UserId;
  }

   getsubCategoryId(event,subCategory){
    this.subCategoryId=event.source.value.SubCategoryId;

  }

  onChange(event) {
    const data = <FormArray>this.reportlistform.get('GroupInfoArray') as FormArray;
    if(event.checked) {
      data.push(new FormControl(event.source.value))

    } else {
      const i = data.controls.findIndex(x => x.value === event.source.value);
      data.removeAt(i);
    }
  }


  //API to get Author or userlist
   getUserList(authorIdCheck){ 
   
    this.apiService.getService(this.apiService.GetUsers,(response)=>{
   // this.http.get(AUTHOR_URL,httpOptions)
      // .subscribe((response:any)=>{

      if(response.Status.Number == 0)
      {
        for (let i = 0; i < response.userInfoModel.length; i++) {
          this.AuthorArray.push({
            UserId:response.userInfoModel[i].UserId,
            UserName:response.userInfoModel[i].FullName,                 
          })
        }
        if(response.userInfoModel.length==this.AuthorArray.length){
          this.AuthorArray = this.AuthorArray;
        }
        this.reportForm.controls.userAuthorId.setValue(this.AuthorArray.find(key => key['UserId'] == authorIdCheck));

          this.overlays=false;

        }
        else
        {
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
  //End of API to get Author

  //API to get Category
   getCategory(categoryForCheck){
  
    this.apiService.getService(this.apiService.GetCategoryList,(response)=>{
    // this.http.get(CATEGORY_URL,httpOptions2)
    //   .subscribe((response:any)=>{
        for (let i = 0; i < response.reportCategoryModel.length; i++) {
          this.CategoryArray.push({
            CategoryId:response.reportCategoryModel[i].CategoryId,
            CategoryName:response.reportCategoryModel[i].CategoryName,
            SubCategoryCunt:response.reportCategoryModel[i].SubCategoryCunt,       
          })
        }
        if(response.reportCategoryModel.length==this.CategoryArray.length){
          this.CategoryArray = this.CategoryArray;
        }
        this.reportForm.controls.categoryId.setValue(this.CategoryArray.find(key => key['CategoryId'] == categoryForCheck));
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
  
  //End of API to get Category
}//End of class