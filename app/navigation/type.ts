export type RootStackParamList = {
    Auth: undefined; //登入/註冊系統頁面 (最外層)
    Main: undefined; //主畫面連接底部導瀏覽
};
export type MainTabParamList = {
    Cart: undefined;
    Chat: undefined;
    Home: undefined;
    Notification: undefined;
    Profile: undefined;
}
export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    Loading: undefined;
}
export type HomeStackParamList = {
    Index: undefined;
}
export type CartStackParamList = {
    Index: undefined;
}
export type ProfileStackParamList = {
    Index: undefined;
}
export type ChatStackParamList = {
    Index: undefined;
}