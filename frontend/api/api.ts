import dotenv from "dotenv";
dotenv.config();

const url_path = `http://${process.env.IP}:${process.env.PORT}`;

export const api = {
    //user
    login: `${url_path}/users/login`,
    register: `${url_path}/users/register`,
    update: `${url_path}/users/update`,
    //product
    AddProducts: `${url_path}/products/AddProducts`,
    GetAllProducts: `${url_path}/products/GetAllProducts`
};
