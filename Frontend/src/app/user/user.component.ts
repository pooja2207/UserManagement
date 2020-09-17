import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { UserService} from '../service/user.service';
import { FormGroup, FormBuilder , Validators } from '@angular/forms';
//import { NotificationService} from '../service/notification.service';
import { ValidationService} from '../service/validation.service';
import { exit } from 'process';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userData:any;
  userDataLength: number;
  totalRecords: any;
  fileData: File = null;
  UserForm:FormGroup;
  imagePath:any;
  @ViewChild('closebtn',{static:false})closebtn:ElementRef;
  //public validationMessages = ValidationService.validationMessages;
  constructor(private userservice:UserService,
    private fb:FormBuilder,
    
   ) { }

  ngOnInit() {
    this.GetallUsers();
    this.CreateUserform();
  }

  GetallUsers(){
    this.userservice.allUsers().subscribe(result=>{
      
      if(result['status'] === "success"){
        this.userData = result['data'];
        console.log(this.userData);
        if(this.userData != undefined){
          this.userDataLength = this.userData.length;
          console.log(this.userDataLength);
          this.imagePath = result['other_data']['image_path'];
        }
      }else{

       // this.notify.showError(result['message']);
      }
    });
  }

  CreateUserform(){
    this.UserForm = this.fb.group({
      name:['',[Validators.required]],
      email:['',[Validators.required]],
      join_date:'',
      leave_date:'',
      still_working:'',
      myfile:'',
    });
  }


  onFileChange(event){
    if(event.target.files.length > 0){
      const uploadFile = event.target.files[0];
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'JPG', 'JPEG'];
      const fileExtension = uploadFile.name.split('.').pop();
      if (allowedExtensions.indexOf(fileExtension) > -1) {
        this.fileData = event.target.files[0];
      }
      console.log(this.fileData);
      debugger
    } else {
        throw new Error(('Invalid file format, please upload valid image.Supported format are jpg,jpeg,png,JPG,JPEG'));
      }
    
  }
  SubmitForm(values){
    if(this.UserForm.valid){
      let formData = new FormData();
        if(this.fileData!= null){
          formData.append('myfile', this.fileData, this.fileData.name);
        }
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('join_date', values.join_date);
      formData.append('leave_date',values.leave_date);
      if(values.still_working != null){
        formData.append('still_working',values.still_working);
      }
      

        this.userservice.addUser(formData).subscribe(result=>{
          if(result['status'] === "success"){
           // this.notify.showSuccess(result['message']);
           // this.closebtn.nativeElement.click();
           // this.GetallUsers();
            //this.UserForm.reset();
            
          }else{
           // this.notify.showError('Something went wrong');
            return;
          }
        },(error)=>{
          if(error['status'] === 400){
            //this.notify.showError(error['error']['data']);
          }
      });
    }else{
      this.validateFields('CategoryForm');
    }
  }


  validateFields(formGroup) {
    Object.keys(this[formGroup].controls).forEach(field => {
        const control = this[formGroup].get(field);
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
    });
  }

}
