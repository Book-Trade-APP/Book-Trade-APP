/**
 * 
 * @param dateString Mongo Date format
 * @returns 
 * e.g:
 * 2024年12月25日(三) 下午1:35
 */
export default function formatDate(dateString: string) {
    const date = new Date(dateString);
  
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    const period = hours >= 12 ? '下午' : '上午';
    const formattedHour = hours > 12 ? hours - 12 : hours;
  
    return `${year}年${month}月${day}日 ${period}${formattedHour}:${minutes}`;
}