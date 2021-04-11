import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppUser } from 'src/app/models/appuser';
import { Post } from 'src/app/models/post';
import { AuthService } from 'src/app/services/auth.service';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit, OnDestroy, AfterViewInit {
  postData: Post = new Post();
  postId: any;
  private unsubscribe$ = new Subject<void>();
  appUser: AppUser;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private authService: AuthService
  ) {
    if (this.route.snapshot.params.id) {
      this.postId = this.route.snapshot.paramMap.get('id');
    }
  }

  ngOnInit(): void {
    this.authService.appUser$.subscribe((appUser) => (this.appUser = appUser));
    this.blogService
      .getPostbyId(this.postId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result: Post) => {
        this.postData = result;
      });
  }

  ngAfterViewInit(): void  {
    console.log(this.postData, this.postId)
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
