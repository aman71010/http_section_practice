import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams, HttpEventType } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";
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
            'https://testing-e500b-default-rtdb.firebaseio.com/posts.json', postData,
            { 
                observe: 'response'
            }
        ).subscribe(
            (responseData) => {
                console.log(responseData);
            },
            (error) => {
                this.error.next(error.message);
            }
        );
    }

    fetchPosts(){
        let searchParams = new HttpParams();
        searchParams.append('print', 'pretty');
        return this.http.get<{ [key: string]: Post }>('https://testing-e500b-default-rtdb.firebaseio.com/posts.json',
        {
            headers: new HttpHeaders({'customHeader': 'Hello'}),
            params: searchParams,
            responseType: 'json'
        }
        )
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
        return this.http.delete('https://testing-e500b-default-rtdb.firebaseio.com/posts.json',{
            observe: 'events',
            responseType: 'text'
        }).pipe(
            tap(event => {
                if(event.type === HttpEventType.Sent){
                    //.....
                    console.log(event.type);
                }
                if(event.type === HttpEventType.Response)
                    console.log(event.body);
            }
        ))
    }
}