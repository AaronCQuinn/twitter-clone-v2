import axios from 'axios';

const AUTH_ENDPOINT = '/api/user_authentication';  
export const checkLoginStatus = () => {
  axios(
  {
  method: "get",
  url: `http://localhost:5000${AUTH_ENDPOINT}`
  })
  .then(response =>
    console.log(response)
  );
}