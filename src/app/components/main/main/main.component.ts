import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoginModel } from 'src/app/models/auth-models/loginModel';
import { Chat } from 'src/app/models/chat';
import { Message } from 'src/app/models/message';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  chats:Chat[] = []
  currentChat:Chat
  messageForm:FormGroup

  constructor(private chatService: ChatService,
    private messageService: MessageService,
    private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.getChats()
    this.createMessageForm()
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
      this.getChats()
    }
  }


  selectChat(chat:Chat){
    this.currentChat = chat
  }

}
