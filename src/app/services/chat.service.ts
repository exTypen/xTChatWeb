import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListResponseModel } from '../models/response-models/listResponseModel';
import { Chat } from '../models/chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  apiUrl = "https://localhost:7165/api/chats/"
  constructor(private httpClient:HttpClient) { }

  getAllDtos(){
    let url = this.apiUrl + "getalldtos"
    return this.httpClient.get<ListResponseModel<Chat>>(url)
  }
}
