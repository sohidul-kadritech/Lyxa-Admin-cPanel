import axios from 'axios'
import { API_URL } from './Api'

export default function requestApi() {
   
   const request = axios.create({
      baseURL: API_URL,
      headers: {
         'Authorization':`Bearer ${localStorage.getItem('accessToken')?localStorage.getItem('accessToken'):null}`
      },
      responseType: 'json',
      socketPath: null,
      
   })
   request.interceptors.response.use(
      (response) => response,
      (error) => {
         console.log("error ==>", error);
         if (error.response) {
            console.log("error ==>",error.response.data);
            if (error.response.status == 401 || error.response.status == 403) {
               localStorage.removeItem("accessToken");
               localStorage.removeItem("admin");
               window.location.replace('/login');
            }
            // console.log(error.response.headers);
         }
      }
   );
   return request;
}
