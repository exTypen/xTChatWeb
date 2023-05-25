import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import { ResponseModel } from '../models/response-models/responseModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  apiUrl = "api/messages"

  constructor(private httpClient:HttpClient) { }

  sendMessage(message:Message):Observable<ResponseModel>{
    let url = this.apiUrl + "/add"
    return this.httpClient.post<ResponseModel>(url, message)
  }
}
