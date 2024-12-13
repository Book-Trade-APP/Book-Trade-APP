export enum api {
    //根據"電腦"上的ip進行fetch 手機的預設網址也會是localhost，當使用localhost會無法找到電腦後端
    login = "http://192.168.248.207:8000/users/Login",
    register = "http://192.168.248.207:8000/users/Register"
}