import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from './_models/User';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'The dating app';
  users: any;

  constructor(private http: HttpClient, private accountService : AccountService){}
  ngOnInit(): void {
    this.http.get("https://localhost:5001/api/users").subscribe(response =>
    {
      this.users = response;
    },
    error => 
    {
      console.log(error);
    });
    this.setCurrentUser();
    
  }
  setCurrentUser()
    {
      const user : User = JSON.parse(localStorage.getItem("user"));
      this.accountService.setCurrentUser(user);
    }
}
