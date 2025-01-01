//todo: 改成env

const PORT = "8000";
const url_path = `http://${IP}:${PORT}`;

export enum api {
    //根據"電腦"上的ip進行fetch 手機的預設網址也會是localhost，當使用localhost會無法找到電腦後端
    //user
    login=`${url_path}/users/login`,
    register=`${url_path}/users/register`,
    forget=`${url_path}/users/ForgetPassword`,
    update=`${url_path}/users/update`,
    find=`${url_path}/users/get_user_by_id`,
    evaluate=`${url_path}/users/evaluate`,
    updatePassword=`${url_path}/users/UpdatePassword`,
    //product
    AddProducts=`${url_path}/products/AddProducts`,
    GetOneProduct=`${url_path}/products/GetOneProduct`,
    GetAllProducts=`${url_path}/products/GetAllProducts`,
    UpdateProduct=`${url_path}/products/UpdateProduct`,
    AddToCart=`${url_path}/products/AddToCart`,
    UpdateCart=`${url_path}/products/UpdateCart`,
    AddToFavorite=`${url_path}/products/AddToFavorites`,
    DeleteFromFavorites=`${url_path}/products/DeleteFromFavorites`,
    GetFavoriteList=`${url_path}/products/GetFavoritesByUserId`,
    GetCartList=`${url_path}/products/GetCartByUserId`,
    GetSellerProducts=`${url_path}/products/GetProductBySellerId`,
    //Orders
    CreateOrder=`${url_path}/orders/CreateOrder`,
    DeleteOrder=`${url_path}/orders/DeleteOrder`,
    GetOrderById=`${url_path}/orders/GetOrderById`,
    GetOrderByUserId=`${url_path}/orders/get_orders_by_Userid`,
    OrderStatusUpdate=`${url_path}/orders/UpdateStatusById`,
    // chat
    CreateChat = `${url_path}/chats/create_chat`,
    GetChatsByUserId = `${url_path}/chats/get_chats_by_user_id/`,
    GetChatIdByParticipantIds = `${url_path}/chats/get_chat_id_by_participant_ids`,
    GetMessagesByChatId = `${url_path}/chats/get_messages_by_chat_id/`,
    SendMessage = `${url_path}/chats/send_message/`,
    //notification
    GetUserAllNotification=`${url_path}/notifications/get_user_notifications`,
    UserSendNotification=`${url_path}/notifications/send_to_user`,
    MakeRead=`${url_path}/notifications/mark_as_read`
};