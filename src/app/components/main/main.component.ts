import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Chat } from 'src/app/models/chat';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user';
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
  chats?: Chat[] = []
  currentChatIndex?: number
  userId: number
  messageForm: FormGroup
  me:User
  searchValue:string
  constructor(private chatService: ChatService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private deviceService: DeviceDetectorService) { }

  async ngOnInit() {
    setInterval(() => {
      this.getChats();
    }, 1000);
    this.createMessageForm()
    this.userId = this.authService.getUserId();
    this.authService.getMe().subscribe((response)=>{
       this.me = response.data
    })
  }

  scrollToBottom() {
    const container = this.scrollContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }

  async getChats() {
    this.chats = (await this.chatService.getAllDtos().toPromise())?.data
  }

  createMessageForm() {
    this.messageForm = this.formBuilder.group({
      text: ['', Validators.required]
    });
  }

  chatLastUpdate(chat: Chat): string {
    if (new Date(chat.lastUpdate).getDate() == new Date().getDate()) {
      return new Date(chat.lastUpdate).getHours().toString() + ":" + new Date(chat.lastUpdate).getMinutes()
    } else if (new Date(chat.lastUpdate).getDate() + 1 == new Date().getDate()) {
      return "Dün"
    }
    return new Date(chat.lastUpdate).getDate().toString() + "/" + (new Date(chat.lastUpdate).getMonth() + 1).toString()
  }

  sendMessage() {
    if (this.messageForm.valid) {
      let messageModel: Message = Object.assign({ chatId: this.chats![this.currentChatIndex!].id }, this.messageForm.value)
      this.messageForm.value.text = ""
      this.textarea.nativeElement.value = ""
      this.messageService.sendMessage(messageModel).subscribe()
      this.currentChatIndex = 0
    }
  }

  selectChat(chat: Chat) {
    this.currentChatIndex = this.chats!.findIndex(c => c.id == chat.id)
  }

  clearChat() {
    this.currentChatIndex = undefined
  }

  messageBoxClass(userId: number) {
    if (userId == this.userId) {
      return "chat-message-right pb-4"
    }
    return "chat-message-left pb-4"
  }

  messageBoxStyle(userId: number) {
    if (userId == this.userId) {
      return "margin-right: 10px; background-color:#f2f2f2"
    }
    return "margin-left: 10px; background-color:#f2f2f2"
  }

  panelStyle() {
    if (this.deviceService.isMobile()) {
      if (this.currentChatIndex != undefined) {
        return "display: none;"
      }
      return ""
    }
    return ""
  }

  textAreaStyle() {
    if (this.deviceService.isMobile()) {
      return "position: fixed; width: 100%; bottom: 0"
    }
    return "position: fixed; width: 75%; bottom: 0"
  }

  showDate(message: Message) {
    if (this.chats![this.currentChatIndex!].messages.findIndex(m => m.id == message.id) == 0) {
      return true
    } else if (new Date(message.sendTime).getDate() != new Date(this.chats![this.currentChatIndex!].messages[this.chats![this.currentChatIndex!].messages.findIndex(m => m.id == message.id) - 1].sendTime).getDate()) {
      return true
    }
    return false
  }

  turnDate(time: any) {
    return new Date(time)
  }
}
