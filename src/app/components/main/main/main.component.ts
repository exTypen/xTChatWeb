import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoginModel } from 'src/app/models/auth-models/loginModel';
import { Chat } from 'src/app/models/chat';
import { Message } from 'src/app/models/message';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { MessageService } from 'src/app/services/message.service';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  chats:Chat[] = []
  currentChat:Chat
  userId:number
  messageForm:FormGroup
  socket: any;
  today:any
  constructor(private chatService: ChatService,
    private messageService: MessageService,
    private formBuilder:FormBuilder,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.getChats()
    this.createMessageForm()
    this.userId = this.authService.getUserId();    
    this.socket = io('http://localhost:3000');
    this.socket.on('message', (message: string) => {
      this.getChats()
    });
    
  }

  getChats(){
    this.chatService.getAllDtos().subscribe((response)=>{
      this.chats = response.data
      this.currentChat = this.chats[0]
    })
  }

  createMessageForm() {
    this.messageForm = this.formBuilder.group({
      text: ['', Validators.required]
    });
  }

  sendMessage(){
    if(this.messageForm.valid){
      let messageModel:Message = Object.assign({chatId: this.currentChat.id}, this.messageForm.value)
      this.messageService.sendMessage(messageModel).subscribe()
      this.socket.emit('message', "update");
    }
  }

  selectChat(chat:Chat){
    this.currentChat = chat
  }


  messageBoxClass(userId:number){
    if (userId == this.userId){
      return "chat-message-right pb-4"
    }
    return "chat-message-left pb-4"
  }

  showDate(message:Message){  
    if(this.today != new Date(message.sendTime).getDate()){
      this.today = new Date(message.sendTime).getDate()
      return true
    }
    return false
  }

  turnDate(time:any){
    return new Date(time)
  }

  findIndexOfMessage(message:Message){
    if(this.currentChat.messages.findIndex(m=>m.id == message.id) == 0){
      return 1
    }
    return this.currentChat.messages.findIndex(m=>m.id == message.id)
  }
}
