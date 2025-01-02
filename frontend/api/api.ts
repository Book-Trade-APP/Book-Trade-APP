const url_path = `http://${process.env.EXPO_PUBLIC_IP}:${process.env.EXPO_PUBLIC_PORT}` as const;

export const api = {
    login: `${url_path}/users/login`,
    register: `${url_path}/users/register`,
    forget: `${url_path}/users/ForgetPassword`,
    update: `${url_path}/users/update`,
    find: `${url_path}/users/get_user_by_id`,
    evaluate: `${url_path}/users/evaluate`,
    updatePassword: `${url_path}/users/UpdatePassword`,
    report: `${url_path}/users/SendEmail`,
    //product
    AddProducts: `${url_path}/products/AddProducts`,
    GetOneProduct: `${url_path}/products/GetOneProduct`,
    GetAllProducts: `${url_path}/products/GetAllProducts`,
    UpdateProduct: `${url_path}/products/UpdateProduct`,
    AddToCart: `${url_path}/products/AddToCart`,
    UpdateCart: `${url_path}/products/UpdateCart`,
    AddToFavorite: `${url_path}/products/AddToFavorites`,
    DeleteFromFavorites: `${url_path}/products/DeleteFromFavorites`,
    GetFavoriteList: `${url_path}/products/GetFavoritesByUserId`,
    GetCartList: `${url_path}/products/GetCartByUserId`,
    GetSellerProducts: `${url_path}/products/GetProductBySellerId`,
    //Orders
    CreateOrder: `${url_path}/orders/CreateOrder`,
    DeleteOrder: `${url_path}/orders/DeleteOrder`,
    GetOrderById: `${url_path}/orders/GetOrderById`,
    GetOrderByUserId: `${url_path}/orders/get_orders_by_Userid`,
    OrderStatusUpdate: `${url_path}/orders/UpdateStatusById`,
    // chat
    CreateChat: `${url_path}/chats/create_chat`,
    GetChatsByUserId: `${url_path}/chats/get_chats_by_user_id/`,
    GetChatIdByParticipantIds: `${url_path}/chats/get_chat_id_by_participant_ids`,
    GetMessagesByChatId: `${url_path}/chats/get_messages_by_chat_id/`,
    SendMessage: `${url_path}/chats/send_message/`,
    //notification
    GetUserAllNotification: `${url_path}/notifications/get_user_notifications`,
    UserSendNotification: `${url_path}/notifications/send_to_user`,
    MakeRead: `${url_path}/notifications/mark_as_read`
} as const;