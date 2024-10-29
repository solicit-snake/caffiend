import React from 'react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Authentication(props) {
  const [isRegistration, setIsRegistration] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const {handleCloseModal} = props;

  const {signup, login, authError, setAuthError, globalUser, handleAuthError} = useAuth();

  

  async function handleAuthentication () {
    if(!email || !email.includes("@") || !password || password.length < 6 || isAuthenticating) {
      if(!email){
        setAuthError('needs an email')
        return
      }
      if(!email.includes('@')){
        setAuthError('please enter a valid email')
        return
      }
      if(!password) { 
        setAuthError('enter a password please')
        return
      }
      if(password.length < 6) {
        setAuthError('passwords are longer than 6 characters')
        return
      }
      return
    }

    try {
      setIsAuthenticating(true)
      setAuthError('')

      if (isRegistration){
        //register a user
        await signup(email, password) 
      } else {
        //login a user
        await login(email, password)
      }
    } catch (error) {
      console.log(error.message)
      handleAuthError(error.message)
    } finally {
      setIsAuthenticating(false)
      if(globalUser) {
        handleCloseModal()
      }
    }
  }

 

  return (
    <>
      <h2 className='sign-up-text'>{isRegistration ? 'Sign up' : 'Sign in'}</h2>
      <p>{isRegistration ? "Create an account" : "Sign in to your account"}</p>
      <input placeholder='email' value={email} onChange={(e) => {setEmail(e.target.value)}}/>
      <input placeholder='*******' type='password' value={password} onChange={(e) => {setPassword(e.target.value)}}/>
      <button onClick={handleAuthentication}><p>{ isAuthenticating ? 'Authenticating...' : 'Submit'}</p></button>
      <p className='auth-error'>{authError}</p>
      <hr />
      <div className='register-content'>
        <p>{isRegistration ? "Already have an account?" : "Don't have an account?"}</p>
        <button onClick={() => {
            setIsRegistration(!isRegistration)
            setAuthError('')
          }}>
          <p>{isRegistration ? 'Sign in' : 'Sign up'}</p>
        </button>
      </div>
    </>
  )
}
