import { DatePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppUser } from 'src/app/models/appuser';
import { Comments } from 'src/app/models/comment';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from 'src/app/services/comment.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  providers: [DatePipe],
})
export class CommentsComponent implements OnInit, OnDestroy {
  @Input() blogId;
  appUser: AppUser;
  public comments = new Comments();
  commentList: Comments[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor(
    private commentService: CommentService,
    private authService: AuthService,
    private snackBarService: SnackbarService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.authService.appUser$.subscribe((appUser) => (this.appUser = appUser));
    this.getAllComments();
  }

  onCommentPost(commentForm): void {
    this.comments.commentDate = this.datePipe.transform(
      Date.now(),
      'MMdd-yyyy HH:mm:ss'
    );
    this.comments.blogId = this.blogId;
    this.commentService
      .saveComment(this.comments)
      .then(commentForm.resetForm());
  }

  getAllComments(): void {
    this.commentService
      .getAllCommentsForBlog(this.blogId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        this.commentList = result;
      });
  }

  deleteComment(commentId): void {
    if (confirm('Do you want to delete this comment!!!')) {
      this.commentService.deleteSingleComment(commentId).then(() => {
        this.snackBarService.showSnackBar('Comment Deleted successfully');
      });
    }
  }

  login(): void {
    this.authService.login();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
