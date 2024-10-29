import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useState } from 'react';
import { createContext } from 'react';
import { userState, useEffect, useContext } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}



export function AuthProvider(props){
    const {children} = props
    const [globalUser, setGlobalUser] = useState(null)
    const [globalData, setGlobalData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [authError, setAuthError] = useState('')

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout(){
        setGlobalUser(null)
        setGlobalData(null)
        return signOut(auth)
    }

    function handleAuthError(message){
        if(message.includes('invalid-credential')){ 
          setAuthError('invalid credentials') 
        } else if(message.includes('email-already-in-use')){
            setAuthError("that email's already in use")
        } else {setAuthError(message)}
    }

    function resetPassword(email){
        sendPasswordResetEmail(auth, email) 
    }

    const value = { globalUser, globalData, setGlobalData, isLoading, signup, login, resetPassword, logout, authError, setAuthError, handleAuthError}
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => { 

            console.log('CURRENT USER: ', user)
            setGlobalUser(user)

            //if there's no user, empty the user state and return from this listener
            if(!user) {
                console.log('no active user')
                return
            }

            //if there is a user, then check if the user has data in the database, and if they do theyn fetch said data and update the global state
            try {
                setIsLoading(true)
                
                //first create a reference for the document (labeled json object).
                //then we get the doc and snapshot it to see if anythings there
                const docRef = doc(db, 'users', user.uid)
                const docSnap = await getDoc(docRef)

                let firebaseData = {}

                if(docSnap.exists()) {
                    console.log('Found user data: ')
                    firebaseData = docSnap.data()
                }

                setGlobalData(firebaseData)

            } catch (error) {
                console.log(error.message)
            } finally {
                setIsLoading(false)
            }
         })
        return unsubscribe
    }, [])


    return (
        <AuthContext.Provider value = {value}>
            {children}
        </AuthContext.Provider>
    )
}