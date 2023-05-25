import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  @ViewChild('textarea') textarea: ElementRef;
  chats?:Chat[] = []
  currentChat:Chat
  userId:number
  messageForm:FormGroup
  constructor(private chatService: ChatService,
    private messageService: MessageService,
    private formBuilder:FormBuilder,
    private authService: AuthService) { }

  async ngOnInit() {
    setInterval(() => {
      this.getChats();
    }, 1000);
    this.createMessageForm()
    this.userId = this.authService.getUserId();    
  }

  scrollToBottom() {
    const container = this.scrollContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }

  async getChats(){
    this.chats = (await this.chatService.getAllDtos().toPromise())?.data
    this.currentChat = this.chats![0]
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
      this.textarea.nativeElement.value = ""
      this.getChats()
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

  messageBoxStyle(userId:number){
    if (userId == this.userId){
      return "margin-right: 10px; background-color:#f2f2f2"
    }
    return "margin-left: 10px; background-color:#f2f2f2"
  }

  showDate(message:Message){  
    if(this.currentChat.messages.findIndex(m=>m.id == message.id) == 0){
      return true
    }else if(new Date(message.sendTime).getDate() != new Date(this.currentChat.messages[this.currentChat.messages.findIndex(m=>m.id == message.id) -1 ].sendTime).getDate()){
      return true
    }
    return false
  }

  turnDate(time:any){
    return new Date(time)
  }
}
