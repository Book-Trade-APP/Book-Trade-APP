/**
 * 異步呼叫api, 只可用響應體為 json 的 api
 * @param api 要呼叫的api
 * @returns json 結果
 */
export async function asyncGet(api: string):Promise<any>{
    try {
        const res: Response = await fetch(api)
        try {
            return await res.json()
        } catch (error) {
            return error
        }
    } catch (error) {
        return error    
    }
}
/**
 * 異步執行 Post 請求
 * @param api 要呼叫的api url
 * @param body 
 * @returns json 結果
 */
export async function asyncPost(api: string, body: {} | FormData) {
    try {
        const res: Response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        // console.log(data);
        return { status: res.status, data };
    } catch (error) {
        console.error("API 調用失敗:", error);
        return { status:500, data: null}; 
    }
}