import { Pipe, PipeTransform } from '@angular/core';
import { Chat } from '../models/chat';

@Pipe({
  name: 'chatFilter'
})
export class ChatFilterPipe implements PipeTransform {

  transform(value: Chat[], filterText: string): Chat[] {
    filterText = filterText?filterText.toLocaleLowerCase():""
    return filterText?value.filter((c:Chat)=>c.displayName.toLocaleLowerCase().indexOf(filterText)!==-1):value
  }

}
