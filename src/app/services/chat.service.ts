import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListResponseModel } from '../models/response-models/listResponseModel';
import { Chat } from '../models/chat';
import { ResponseModel } from '../models/response-models/responseModel';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  apiUrl = "api/chats"
  constructor(private httpClient:HttpClient) { }


  getAllDtos(){
    let url = this.apiUrl + "/getalldtos"
    return this.httpClient.get<ListResponseModel<Chat>>(url)
  }

  createDm(userName:string){
    let url = this.apiUrl + "/createdm?username=" + userName
    return this.httpClient.get<ResponseModel>(url)
  }
}
