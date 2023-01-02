import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, FormArray, FormControl,Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { ToastrService } from 'ngx-toastr';
import { MessageProviderService } from '../../services/message-provider.service';
import { APIsService } from '../../services/apis.service';
import { AuthService } from '../../services/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-add-new-report',
  templateUrl: './add-new-report.component.html',
  styleUrls: ['./add-new-report.component.scss']
})
export class AddNewReportComponent implements OnInit {
 

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
  }>=[];

  public AuthorArray:Array<{
    UserId:number,
    UserName:string,
  }>=[];

  dataSource:any;

   width:number=1280;
   height:number=720;
   userAuthorId:string;
   categoryId:string;
   subCategoryId:string;
   Token:any;
   authorName:string;
   Description:string='';
   userGroup:string='All';
   usersGroupArray = [
    {name:'Group', value:false},
    {name:'All', value:true}
  ];
   GroupIds:Number[]=[];
   viewGroup:boolean=false;
   isPublic:boolean=true;
   overlays:boolean=true;
   fileCheck:boolean=false;

   formError:any;

  constructor(private title: Title,private auth:AuthService,private http:HttpClient,private formBuilder:FormBuilder,private router: Router,private globalService:GlobalService,private toastr:ToastrService,private messageProvider:MessageProviderService,private apiService:APIsService) { }

  ngOnInit() {
    this.getUserList();
    this.reportlistform = this.formBuilder.group({
      GroupInfoArray: this.formBuilder.array([]),
    })

  this.reportForm=this.formBuilder.group({
    Description: [''],
    userAuthorId: ['',Validators.required],
    selectedFile:[null,Validators.required],
    categoryId:['',Validators.required],
    subCategoryId:['',Validators.required],
    userGroup:['All']
  });
   
    this.formError=this.reportForm.controls;  
  }
  onFileSelected(event)
  {
    if(event.target.files[0].type=="application/vnd.openxmlformats-officedocument.presentationml.presentation" || event.target.files[0].type=="application/vnd.ms-powerpoint")
    {
      this.selectedFile=event.target.files[0];
      this.fileCheck=false;
    }
    else{
      window.alert("File extension not supported!");
    }
    
  }


   RemoveSelectedFile()
  {
    this.selectedFile=null;
    this.fileCheck=true;
  }

    subCategory(event,category){
      if(event.isUserInput){

        this.categoryId=event.source.value.CategoryId;
         var params =  new HttpParams()
              .set('categoryId',this.categoryId)
        }
        this.apiService.getServiceWithParams(this.apiService.GetSpecificCategory,params,(response)=>{
          if(response.Status.Number==0){
            
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

          }
          else
          {
            this.toastr.warning(this.messageProvider.showMessage(response.Status.Number));
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

    
  public groupcall(value){
    if(value=='Group'){
      this.viewGroup=true;
      this.isPublic=false;
    }
    else{
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
          }
          this.GroupInfoArray.push(data);
        }
        if(response.groupListModel.length==this.GroupInfoArray.length){

          this.reportlistform = this.formBuilder.group({
            GroupInfoArray: this.formBuilder.array([]),
          })
        }
        this.getCategory();
      }
      else
      {
        this.overlays=false;
        this.toastr.warning(this.messageProvider.showMessage(response.Status.Number));
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
  // End API to get Groups

  
   public submitForm(){
    this.overlays=true;
    if(this.reportForm.invalid){
      if(this.selectedFile==null)
      {
        this.fileCheck=true;
      }
      this.overlays=false;
      return;
    }else{
      if(this.selectedFile==null)
      {
        this.fileCheck=true;
      }
      let selectedGroupIds=this.reportlistform.value.GroupInfoArray;
      for(let i=0;i<selectedGroupIds.length;i++){
        this.GroupIds.push(selectedGroupIds[i].GroupId);
      }
      let ReportArray=[];
      let reportDetailsForAdmin = {
        "AuthorId": this.reportForm.value.userAuthorId.UserId,
        "CategoryId":this.reportForm.value.categoryId.CategoryId,
        "SubcategoryId":this.reportForm.value.subCategoryId.SubCategoryId,
        "Description":this.reportForm.value.Description,
        "IsPublic":this.isPublic,
        "GroupIds":this.GroupIds,
        "Width":this.width,
        "Height":this.height
      };
      ReportArray.push(reportDetailsForAdmin);

      let formData:FormData = new FormData();
      
      let newData=JSON.stringify(ReportArray);
      formData.append('ReportDetail',newData);
      formData.append('',this.selectedFile);
      const ADDREPORT_API=this.apiService.URL+this.apiService.AddNewReport;
      const headers={
        headers:new HttpHeaders({
          'Authorization':'Bearer '+window.localStorage.getItem('TokenInLocal'),
        })
      }
      this.http.post(ADDREPORT_API,formData,headers).subscribe((response:any)=>{
        if(response.Status.Number==0)
        {
          this.router.navigateByUrl('reportList');
          this.toastr.success("Report Added SuccessFully");
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
   getUserList(){ 

    this.apiService.getService(this.apiService.GetUsers,(response)=>{

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
      this.overlays=false;
     this.getGroups();
    }
    else
    {
      this.overlays=false;
      this.toastr.warning(this.messageProvider.showMessage(response.Status.Number));
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
  //End of API to get Author

  //API to get Category
   getCategory(){

    this.apiService.getService(this.apiService.GetCategoryList,(response)=>{

      if(response.Status.Number == 0)
      {
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
      }
      else
      {
        this.overlays=false;
        this.toastr.warning(this.messageProvider.showMessage(response.Status.Number));
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
  //End of API to get Category
}