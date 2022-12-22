
import { API_URL } from './Api'



const post = async (url,{body = null}) => {
    try {
        const response = await fetch(`${API_URL}${url}`, {
            method: "POST",
            body:body
        });
        return await response.json();

    } catch (error) {
        console.log(error);
        return error;
    }
}

const get = async (url,{params=null}) => {
    try {
        const response = await fetch(`${API_URL}${url}`, {
            method: "GET",
        });
        return await response.json();

    } catch (error) {
        console.log(error);
        return error;
    }

}



export default {
    post,
    get
}
