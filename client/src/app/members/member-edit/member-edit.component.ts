import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/Member';
import { User } from 'src/app/_models/User';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

  @ViewChild('editForm') editForm : NgForm;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any)
  {
    if(this.editForm.dirty)
    {
      $event.returnValue = true;
    }
  }
  member: Member;
  user: User;

  constructor(private accountService:AccountService, private memberService:MembersService,
    private toastr : ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    })
   }

   loadMember()
   {
    this.memberService.GetMember(this.user.username).subscribe(mem=>{
      this.member = mem;
    })
   }
  ngOnInit(): void {
    this.loadMember();
  }

  updateMember()
  {
    this.toastr.success('Profile updated successfully.');
    this.editForm.reset(this.member);
  }

}
