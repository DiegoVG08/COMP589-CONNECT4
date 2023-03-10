import React, {useState,setState} from 'react';
import './style.css'
import {database} from '../Firebase'
import {ref,push,child,update} from "firebase/database";

function RegistrationForm() {
    
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [NickName, setNickName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password,setPassword] = useState(null);
    const [confirmPassword,setConfirmPassword] = useState(null);

    const handleInputChange = (e) => {
        const {id , value} = e.target;
        if(id === "firstName"){
            setFirstName(value);
        }
        if(id === "lastName"){
            setLastName(value);
        }
        if(id === "NickName"){
            setNickName(value);
        }
        if(id === "email"){
            setEmail(value);
        }
        if(id === "password"){
            setPassword(value);
        }
        if(id === "confirmPassword"){
            setConfirmPassword(value);
        }

    }

    const handleSubmit = () =>{
        let obj = {
            firstName : firstName,
            lastName:lastName,
            NickName:NickName,
            email:email,
            password:password,
            confirmPassword:confirmPassword,
        }       
    const newPostKey = push(child(ref(database), 'posts')).key;
    const updates = {};
    updates['/' + newPostKey] = obj
    return update(ref(database), updates);
    }
        console.log(firstName,lastName,NickName,email,password,confirmPassword);

    
         
}
export const database = getDatabase(app);
export default RegistrationForm;
