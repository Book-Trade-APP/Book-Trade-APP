import { Product } from "../interface/Product";

export type RootStackParamList = {
    Auth: undefined; //登入/註冊系統頁面 (最外層)
    Main: undefined; //主畫面連接底部導瀏覽
};
export type MainTabParamList = {
    Cart: undefined;
    Chat: {
        screen?: keyof ChatStackParamList;
        params?: {
            chat_id?: string;
            userId: string;
            receiver_id: string;
            receiver_username: string;
            avatar: string;
            onMessageSent?: (data: { chatId: string; lastMessage: string; lastMessageTime: string }) => void;
        }
    }
    Home: undefined;
    Notification: undefined;
    Profile: {
        screen?: keyof ProfileStackParamList;
        params?: {
            status?: "待確認"| "待處理" | "待評價" | "已完成"
        }
    } | undefined;
}
export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    Loading: undefined;
    Forget: undefined;
}
export type HomeStackParamList = {
    Index: undefined;
    Product: { productId: string, source: String};
    Order: { orderId: string; products: Product[], quantity: number[], source: String, userRole: string};
}
export type CartStackParamList = {
    Index: undefined;
    Checkout: { productId: string[], quantity: number[] }
    Success: undefined;
}
export type ProfileStackParamList = {
    Index: undefined;
    Setting: undefined;
    Favorite: undefined;
    OrderStatus: { status: "待確認" | "待處理" | "待評價" | "已完成" };
    Seller: {product?: Product};
    Edit: undefined;
    Report: undefined;
}
export type ChatStackParamList = {
    Index: undefined;
    ChatDetail: {
        chat_id?: string;
        userId: string;
        receiver_id: string;
        receiver_username: string;
        avatar: string;
        onMessageSent: (data: { chatId: string; lastMessage: string; lastMessageTime: string }) => void;
    };
}