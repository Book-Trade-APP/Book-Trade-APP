export interface Message {
    chat_id: string;
    sender_id: string;
    receiver_id: string;
    username: string;
    avatar: string | null;
    last_message: string;
    last_message_time: string;
    content: string;
    timestamp: string;
}