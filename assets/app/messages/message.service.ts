import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { Message } from "./message.model";

@Injectable()
export class MessageService {
    private messages: Message[] = [];
    messageIsEdit = new EventEmitter<Message>();

    constructor(private http: Http) {}

    addMessage(message: Message) {
        let headers = new Headers({'Content-Type':'application/json'});
        let options = new RequestOptions({headers:headers});
        let body = JSON.stringify(message);
        return this.http.post('http://localhost:3000/message', body, options).map((response:Response)=>{
            const result = response.json();
            const message =  new Message(result.obj.content, 'Dummy', result.obj._id, null);
            this.messages.push(message);
            return message;
        })
        .catch((error : Response) => Observable.throw(error.json()));
    }

    getMessages() {
        return this.http.get('http://localhost:3000/message').map((res: Response) => {
            const messages = res.json().obj;
            let transformedMessages : Message[] =[];
            for(let message of messages){
                transformedMessages.push(new Message(message.content,'Dummy', message._id,  null))
            }
            this.messages = transformedMessages;
            return transformedMessages;
        }).catch((error : Response) => Observable.throw(error.json()));
    }

    editMessage(message : Message){
        this.messageIsEdit.emit(message);
    }

    updateMessage(message: Message){
        let headers = new Headers({'Content-Type':'application/json'});
        let options = new RequestOptions({headers:headers});
        let body = JSON.stringify(message);
        return this.http.patch('http://localhost:3000/message/'+message.messageId, body, options).map((res:Response)=>res.json())
        .catch((error : Response) => Observable.throw(error.json()));
    }
    deleteMessages(message:Message){
        this.messages.splice(this.messages.indexOf(message), 1);
        let headers = new Headers({'Content-Type':'application/json'});
        let options = new RequestOptions({headers:headers});
        let body = JSON.stringify(message);
        return this.http.delete('http://localhost:3000/message/'+message.messageId,options).map((res:Response)=>res.json())
        .catch((error : Response) => Observable.throw(error.json()));
    }
}