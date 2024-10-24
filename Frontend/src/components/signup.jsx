
import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios';


function signup() {
  const baseUrl = 'http://localhost:4160'
    const [ formData, setFormData ] = useState({
        name: '',
        companyName: '',
        email: '',
        phone: '',
        password: '',
        employeeSize: ''
    })
    const [ error , setError ] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevValue) => ({
        ...prevValue,
        [name]: value
      }))
    }

    const handleSignup = async (e) => {
      e.preventDefault();
      setError('')
    

    try {
      const response = await axios.post('/company/register', formData);
      console.log(response.data);
      if(response.data.message){
        navigate('/verify-email');
      }
      else{
        setError(response.data.error);
      }
      
    } catch (error) {
      setError(error?.response?.data?.error || 'An error occured!');
    }
  }


  return (
    <div className='flex items-center justify-center'>
        <div className='mx-auto w-full '></div>
      
    </div>
  )
}

export default signup 

