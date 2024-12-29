export interface Notification {
    title: String;
    content: String;
    time: number; //時間戳
}
// 擴展 Notification 介面以包含已讀狀態
export interface EnhancedNotification extends Notification {
  isRead: boolean;
  _id: string;
}

// API 回傳的資料介面
export interface ApiResponse {
  body: Array<{
    _id: string;
    created_at: string;
    is_read: boolean;
    message: string;
    title: string;
    user_id: string;
  }>;
  code: number;
  message: string;
}