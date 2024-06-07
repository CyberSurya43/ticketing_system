import React, { useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Routebody from "./Routebody";
const clientID ='485253286541-rq7er47ufa1cnanri3ulsebi4383p91s.apps.googleusercontent.com';
const Login = () =>{
   useEffect (()=>{
      sessionStorage.clear();
   })
   return (
    <GoogleOAuthProvider clientId={clientID}>
    <Routebody/>
    </GoogleOAuthProvider>
   );
}
export default Login;