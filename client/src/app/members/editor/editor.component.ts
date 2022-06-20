import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/Member';
import { Photo } from 'src/app/_models/Photo';
import { User } from 'src/app/_models/User';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  @Input() member: Member;
  uploader:FileUploader;
  hasBaseDropZoneOver:boolean = false;
  baseUrl = environment.apiUrl;
  user : User;
  constructor(private accountService: AccountService, private memberService : MembersService, private router : Router, private toastr : ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    })

   }

  ngOnInit(): void {
    this.initializeUploader();
  }
  fileOverBaseZone(e:any)
  {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader()
  {
    this.uploader = new FileUploader({
      url: this.baseUrl + "users/add-photo",
      authToken: "Bearer " + this.user.token,
      isHTML5: true,
      maxFileSize: 10*1024*1024,
      removeAfterUpload: true,
      autoUpload: false,
      allowedFileType: ["image"]
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
  }
  this.uploader.onSuccessItem = (item,response,number,headers) => 
  {
    if(response)
    {
      const photo : Photo= JSON.parse(response);
      this.member.photos.push(photo);
      if(photo.isMain)
      {
        this.user.photoUrl = photo.url;
        this.member.photoURL = photo.url;
        this.accountService.setCurrentUser(this.user);
      }
    }
  }
  }
  setMainPhoto(photo : Photo)
  {
    this.memberService.setMainPhoto(photo.id).subscribe(() => {
      this.user.photoUrl = photo.url;
      this.accountService.setCurrentUser(this.user);
      this.member.photoURL = photo.url;
      this.member.photos.forEach(p=>{
        if(p.isMain)
        {
          p.isMain = false;
        }
        if(p.id == photo.id)
        {
          p.isMain = true;
        }
      })
    })
  }
  deletePhoto(photo: Photo)
  {
    this.memberService.deletePhoto(photo.id).subscribe(()=>{
      this.member.photos = this.member.photos.filter(x => {
        x.id !== photo.id;
      });
    });
    this.router.navigateByUrl("/members");
    this.toastr.success("Photo deleted successfully!");
  }
}
