import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppUser } from 'src/app/models/appuser';
import { Post } from 'src/app/models/post';
import { AuthService } from 'src/app/services/auth.service';
import { BlogService } from 'src/app/services/blog.service';
import { CommentService } from 'src/app/services/comment.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.scss'],
})
export class BlogCardComponent implements OnInit, OnDestroy {
  blogPost: Post[] = [];
  private unsubscribe$ = new Subject<void>();
  config: any;
  pageSizeOptions = [];
  appUser: AppUser;

  constructor(
    private blogService: BlogService,
    private snackBarService: SnackbarService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private commentService: CommentService
  ) {
    this.pageSizeOptions = [2, 4, 6];
    const pageSize = localStorage.getItem('pageSize');
    this.config = {
      currentPage: 1,
      itemsPerPage: pageSize ? +pageSize : this.pageSizeOptions[0],
    };
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.config.currentPage = +params.pagenum;
      this.getBlogPosts();
    });
    this.authService.appUser$.subscribe((appUser) => (this.appUser = appUser));
  }

  getBlogPosts(): void {
    this.blogService
      .getAllPosts()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        this.blogPost = result;
      });
  }

  delete(postId: string): void {
    if (confirm('Are you sure')) {
      this.blogService.deletePost(postId).then(() => {
        this.snackBarService.showSnackBar('Blog post deleted sucessfully!');
      });
    }
  }

  deleteAllCommentForBlog(postId: string): void {
    if (confirm('Are you sure')) {
      this.commentService.deleteAllCommentForBlog(postId).then(() => {
        this.snackBarService.showSnackBar('Comment deleted successfully!');
      });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
