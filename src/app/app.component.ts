import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Post } from './post.model';
import { PostsService } from './posts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts = [];
  isFetching = false;

  constructor(private http: HttpClient, private postsSevice: PostsService) {}

  ngOnInit() {
    this.onFetchPosts();
  }

  onCreatePost(postData: Post) {
    this.postsSevice.createAndStorePost(postData);
  }

  onFetchPosts() {
    this.isFetching = true;
    this.postsSevice.fetchPosts().subscribe(
      (posts) => {
        this.isFetching = false;
        this.loadedPosts = posts;
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

}
