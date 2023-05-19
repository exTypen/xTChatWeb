import { Message } from "./message"

export interface Chat{
    id:number
    lastUpdate:Date
    displayName:string
    chatType:ChatType
    users:UserToChatBind[]
    messages:Message[]
}


export interface ChatType{
    id:number
    name:string
}

export interface UserToChatBind{
    id:number
    userId:number
    chatId:number
}
