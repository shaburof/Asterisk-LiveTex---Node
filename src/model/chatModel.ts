import { model } from './model';

class chatModel extends model {

    constructor() {
        super();
    }

    public insertChats(chats: {}[]) {
        return this.insertMany('chats', chats);
    }

}

export { chatModel };