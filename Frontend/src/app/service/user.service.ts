import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UserService {
 baseUrl : string;
  constructor(private http:HttpClient) { 
    this.baseUrl = environment.baseUrl;
  }

  allUsers(){
    return this.http.get(this.baseUrl+'users');
  }

  addUser(params){
    return this.http.post(this.baseUrl+'adduser',params);
  }
}
