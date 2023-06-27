import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { Post } from './post.model';
import { PostsService } from './posts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts = [];
  isFetching = false;
  error = null;
  errorSubs: Subscription;

  constructor(private http: HttpClient, private postsSevice: PostsService) {}

  ngOnInit() {
    this.onFetchPosts();
  }

  onCreatePost(postData: Post) {
    this.postsSevice.createAndStorePost(postData);
    this.errorSubs = this.postsSevice.error.subscribe(
      (errorMessage) => {
        this.error = errorMessage;
      }
    )
  }

  onFetchPosts() {
    this.isFetching = true;
    this.postsSevice.fetchPosts().subscribe(
      (posts) => {
        this.isFetching = false;
        this.loadedPosts = posts;
      },
      (error) => {
        this.isFetching = false;
        this.error = error;
      }
    );
  }

  onClearPosts() {
    this.postsSevice.deletePosts().subscribe(
      () => {
        this.loadedPosts = [];
      }
    )
  }

  ngOnDestroy(): void {
      this.errorSubs.unsubscribe();
  }

}
