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
    if (this.currentChat == null) {
      this.currentChat = this.chats![0]
    }
  }

  createMessageForm() {
    this.messageForm = this.formBuilder.group({
      text: ['', Validators.required]
    });
  }

  chatLastUpdate(chat:Chat):string{
    //console.log(new Date(chat.lastUpdate).getDate());
    
    if (new Date(chat.lastUpdate).getDate() == new Date().getDate()) {
      return new Date(chat.lastUpdate).getHours().toString() + ":" + new Date(chat.lastUpdate).getMinutes()
    }else if(new Date(chat.lastUpdate).getDate() + 1 == new Date().getDate()){
      return "Dün"
    }
    return new Date(chat.lastUpdate).getDate().toString() + "/" + new Date(chat.lastUpdate).getMonth().toString()
  }

  sendMessage(){
    if(this.messageForm.valid){
      let messageModel:Message = Object.assign({chatId: this.currentChat.id}, this.messageForm.value)
      this.messageService.sendMessage(messageModel).subscribe()
      this.textarea.nativeElement.value = ""
      this.messageForm.value.text = ""
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
