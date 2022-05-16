import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../_models/User';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  @Output() cancelEvent = new EventEmitter();
  model:any = {}
  users : any
  constructor(private accountService : AccountService) { }

  ngOnInit(): void {
    
  }

  register()
  {
    this.accountService.register(this.model).subscribe(response => 
      {
        console.log(response);
        this.cancel();
      });
  }
  cancel()
  {
    this.cancelEvent.emit(false);
  }
}
