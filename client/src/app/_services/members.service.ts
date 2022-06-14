import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { Member } from '../_models/Member'



@Injectable({
  providedIn: 'root'
})
export class MembersService {
  httpOptions = {
    headers : new HttpHeaders({
      Authorization : 'Bearer ' + JSON.parse(localStorage.getItem('user'))?.token
    }),
  }

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  GetMembers()
  {
    
    
    return this.http.get<Member[]>(this.baseUrl + 'users');
  }
  GetMember(username : string)
  {
    return this.http.get<Member>(this.baseUrl + "users/" + username);
  }
}
