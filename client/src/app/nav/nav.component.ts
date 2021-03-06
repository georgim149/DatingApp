import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { User } from '../_models/User';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {}

  constructor(public accountService : AccountService, private router: Router, private toastr:ToastrService) { }

  ngOnInit(): void {
  }

  login()
  {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user=>console.log(user));
    this.model.username.toLowerCase();
    this.accountService.login(this.model).subscribe(response => {
      this.router.navigateByUrl("/members");
      
    },error => {
      console.log(error);
      this.toastr.error(error.error);
    });
  }

  logout()
  {
    this.accountService.logout();
    this.router.navigateByUrl("");
  
  }

  
}
