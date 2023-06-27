import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

import { Post } from "./post.model";

@Injectable({
    providedIn: 'root'
})
export class PostsService {


    constructor(private http: HttpClient) {}

    createAndStorePost(postData: Post){
        this.http.post<{name: string}>(
            'https://testing-e500b-default-rtdb.firebaseio.com/posts.json', postData).subscribe(
                (responseData) => {
                    console.log(responseData);
                }
            );
    }

    fetchPosts(){
        return this.http.get<{ [key: string]: Post }>('https://testing-e500b-default-rtdb.firebaseio.com/posts.json')
        .pipe(
            map(responseData => {
                const postArray: Post[] = [];
                for(const key in responseData){
                    if(responseData.hasOwnProperty(key)){
                        postArray.push({...responseData[key], id: key});
                    }
                }
                return postArray;
            })
        )
    }

    deletePosts(){
        return this.http.delete('https://testing-e500b-default-rtdb.firebaseio.com/posts.json');
    }
}