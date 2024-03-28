import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {toast} from 'react-toastify'

const LoginScreen = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      navigate('/');
    }
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
            "Content-type":"application/json"
        }
      }
      const { data } = await axios.post("/api/users/login", { email, password }, config)
      console.log("data", data)
      localStorage.setItem("userInfo", JSON.stringify(data))
      navigate('/')
      toast.success("Login successful")
    } catch (err) {
        toast.error(err?.response?.data?.message || err.console.error())
    }
  }
  
  
  return (
    <div className='min-h-screen py-20' >
      <div className='container mx-auto'>
        <div className='w-96 bg-white rounded-xl mx-auto shadow-lg overflow-hidden'>
          <div className='py-10 px-12'>
              <h2 className='text-3xl mb-3'>Login</h2>
              <form onSubmit={submitHandler}>
                  <div className='mt-4'>
                      <input type='text' placeholder='Email' className='border border-grey-400 py-1 px-2 w-full' value={email} onChange={(e) => { setEmail(e.target.value) }} />
                  </div>
                  <div className='mt-4'>
                      <input type='password' placeholder='Password' className='border border-grey-400 py-1 px-2 w-full' value={password} onChange={(e) => { setPassword(e.target.value) }} />
                  </div>
                  <div className='mt-3'>
                      <button className='w-full py-3 text-center text-white' type='submit' style={{ backgroundColor: '#ffbe55' }}>Login</button>
                  </div>
                  <div className='mt-4 mb-3'>
                      <span>New Customer? <Link to='/register' className='font-semibold text-blue-500'>Register</Link></span>
                  </div>
              </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen