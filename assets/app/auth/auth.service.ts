import { Http, Headers,RequestOptions, Response } from "@angular/http";
import { Injectable } from "@angular/core";
import { User } from "./user.model";
import 'rxjs/Rx'
import { Observable } from "rxjs";

@Injectable()
export class AuthService{
    constructor(private http: Http){}
    signup(user:User){
        let headers = new Headers({'Content-Type':'application/json'});
        let options = new RequestOptions({headers:headers});
        let body = JSON.stringify(user);
        return this.http.post('http://localhost:3000/user', body, options).map((response: Response) => response.json())
        .catch((error:Response) => Observable.throw(error.json()))
    }
    signin(user:User){
        let headers = new Headers({'Content-Type':'application/json'});
        let options = new RequestOptions({headers:headers});
        let body = JSON.stringify(user);
        return this.http.post('http://localhost:3000/user/signin', body, options).map((response: Response) => response.json())
        .catch((error:Response) => Observable.throw(error.json()))
    }

    logout(){
        localStorage.clear();
    }

    isLoggedIn(){
        return localStorage.getItem('token') !== null;
    }
}