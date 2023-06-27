import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Subject, throwError } from "rxjs";

import { Post } from "./post.model";

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    error = new Subject<string>();

    constructor(private http: HttpClient) {}

    createAndStorePost(postData: Post){
        this.http.post<{name: string}>(
            'https://testing-e500b-default-rtdb.firebaseio.com/posts.json', postData).subscribe(
                (responseData) => {
                    console.log(responseData);
                },
                (error) => {
                    this.error.next(error.message);
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
            }),
            catchError((errorRes) => {
                // some task related to errorRes
                return throwError(errorRes.message);
            })
        )
    }

    deletePosts(){
        return this.http.delete('https://testing-e500b-default-rtdb.firebaseio.com/posts.json');
    }
}