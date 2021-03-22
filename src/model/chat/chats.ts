import { chatModel } from '../chatModel';

class chats {

    public value;
    protected ChatModel: chatModel;

    constructor(value: any[]) {
        this.value = value;
        this.ChatModel = new chatModel();
    }

    get created_at() {
        return new Date(this.value.created_at);
    }

    save() {
        this.ChatModel.insertChats(this.value);
    }

}

export { chats };

