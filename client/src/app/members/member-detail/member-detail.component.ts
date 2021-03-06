import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Member } from 'src/app/_models/Member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  member: Member
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  constructor(private memberService: MembersService, private route: ActivatedRoute) {
    this.loadMember();
   }

  ngOnInit(): void {
    
    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false,
      }
    ];

    
  }

  /*getImages(): NgxGalleryImage[]
  {
    const photoUrls = [];
    for(const photo of this.member.photos)
    {
      photoUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url
      })
    }
    return photoUrls;
  }*/
  loadMember()
  {
    this.memberService.GetMember(this.route.snapshot.paramMap.get('user')).subscribe( mem =>{
      console.log(mem);
      this.member = mem;
      //this.galleryImages = this.getImages();
    })
  }
}
