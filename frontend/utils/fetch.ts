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
/**
 * 異步執行 Delete 請求
 * @param api 要呼叫的api url
 * @param body 
 * @returns json 結果
 */
export async function asyncDelete(api: string) {
   try {
       const res: Response = await fetch(api, {
           method: 'DELETE',
           headers: {
               'Content-Type': 'application/json',
           }
       });
       const data = await res.json();
       return { status: res.status, data };
   } catch (error) {
       console.error("API 調用失敗:", error);
       return { status:500, data: null}; 
   }
}

export async function uploadImage(product_name: string, imageUri: string) {
    //imgur資料 改用外部提取
    const imgurData = {
        album: "AVrTF0o",
        access_token: "4677b560408bd6608dbbdaa089fbf2fa39b89c5d"
    };
    const api = "https://api.imgur.com/3/upload";

    try {
        // 讀取文件並轉換為 Base64
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const base64 = await blobToBase64(blob);

        const formData = new FormData();
        formData.append('album', imgurData.album);
        formData.append('image', base64.split(',')[1]); // 移除 Base64 前綴
        formData.append('title', product_name);

        const upload_response = await fetch(api, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${imgurData.access_token}`,
            },
            body: formData,
        });

        if (!upload_response.ok) {
            const errorData = await upload_response.json();
            throw new Error(`Upload failed: ${JSON.stringify(errorData)}`);
        }

        const responseData = await upload_response.json();
        // console.log(responseData.data.deletehash); 如果之後要做刪除使用這個
        return responseData.data.link;

    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
}

// 輔助函數：將 Blob 轉換為 Base64
async function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}