import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from 'src/app/models/post';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BlogService } from 'src/app/services/blog.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppUser } from 'src/app/models/appuser';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-blog-editor',
  templateUrl: './blog-editor.component.html',
  styleUrls: ['./blog-editor.component.scss'],
  providers: [DatePipe],
})
export class BlogEditorComponent implements OnInit, OnDestroy {
  public Editor = ClassicEditor;
  ckeConfig: any;
  postData = new Post();
  formTitle = 'Add';
  postId = '';
  private unsubscribe$ = new Subject<void>();
  appUser: AppUser;

  constructor(
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private blogService: BlogService,
    private router: Router,
    private authService: AuthService,
    private snackBarService: SnackbarService
  ) {
    if (this.route.snapshot.params.id) {
      this.postId = this.route.snapshot.paramMap.get('id');
    }
  }

  ngOnInit(): void {
    this.authService.appUser$.subscribe((appUser) => (this.appUser = appUser));
    this.setEditorConfig();

    if (this.postId) {
      this.formTitle = 'Edit';
      this.blogService
        .getPostbyId(this.postId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((result) => {
          this.setPostFormData(result);
        });
    }
  }

  saveBlogPost(): any {
    if (this.postId && this.appUser) {
      this.blogService.updatePost(this.postId, this.postData).then(() => {
        this.router.navigate(['/']);
      });
    } else if (this.appUser) {
      this.postData.createdDate = this.datePipe.transform(Date.now());
      this.postData.author = this.appUser.name || '';
      console.log(this.postData);
      this.blogService.createPost(this.postData).then(() => {
        this.router.navigate(['/']);
      });
    } else {
      this.snackBarService.showSnackBar('Please login first');
    }
  }

  setPostFormData(postFormData): void {
    this.postData.title = postFormData.title;
    this.postData.content = postFormData.content;
  }

  cancel(): void {
    this.router.navigate(['/']);
  }

  setEditorConfig(): void {
    this.ckeConfig = {
      // removePlugins: ['ImageUpload', 'MediaEmbed'],
      heading: {
        options: [
          {
            model: 'paragraph',
            title: 'Paragraph',
            class: 'ckheading_paragraph',
          },
          {
            model: 'heading1',
            view: 'h1',
            title: 'Heading 1',
            class: 'ckheading_heading1',
          },
          {
            model: 'heading2',
            view: 'h2',
            title: 'Heading 2',
            class: 'ckheading_heading2',
          },
          {
            model: 'heading3',
            view: 'h3',
            title: 'Heading 3',
            class: 'ckheading_heading3',
          },
          {
            model: 'heading4',
            view: 'h4',
            title: 'Heading 4',
            class: 'ckheading_heading4',
          },
          {
            model: 'heading5',
            view: 'h5',
            title: 'Heading 5',
            class: 'ckheading_heading5',
          },
          {
            model: 'heading6',
            view: 'h6',
            title: 'Heading 6',
            class: 'ckheading_heading6',
          },
          { model: 'Formatted', view: 'pre', title: 'Formatted' },
        ],
      },
    };
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
