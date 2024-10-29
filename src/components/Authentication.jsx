import React from 'react'

export default function Authentication() {
  return (
    <>
      <h2 className='sigh-up-text'>Sign up / Login</h2>
      <p>Sign in to your account</p>
      <input placeholder='email'/>
      <input placeholder='*******' type='password' />
      <buton><p>Submit</p></buton>
      <hr />
      <div className='register-content'>
        <p>Don&apos;t have an account?</p>
      </div>
    </>
  )
}
