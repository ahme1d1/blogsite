import { Post } from './../models/post';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private db: AngularFirestore) {}

  createPost(post: Post): any {
    const postData = JSON.parse(JSON.stringify(post));
    return this.db.collection('blogs').add(postData);
  }

  getAllPosts(): any {
    const blogs = this.db
      .collection<Post>('blogs', (ref) => ref.orderBy('createdDate', 'desc'))
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((c) => ({
            postId: c.payload.doc.id,
            ...c.payload.doc.data(),
          }));
        })
      );
    return blogs;
  }

  getPostbyId(id: string): Observable<Post> {
    const blogDetails = this.db.doc<Post>('blogs/' + id).valueChanges();
    return blogDetails;
  }

  deletePost(postId: string): any {
    return this.db.doc('blogs/' + postId).delete();
  }

  updatePost(postId: string, post: Post): any {
    const putData = JSON.parse(JSON.stringify(post));
    return this.db.doc('blogs/' + postId).update(putData);
  }

}
