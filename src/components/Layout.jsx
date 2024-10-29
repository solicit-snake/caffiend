import React from 'react'
import Authentication from './Authentication'
import Modal from './Modal'
import { useState } from 'react'

export default function Layout(props) {
    const {children} = props

    const [showModal, setShowModal] = useState(false)

    const header = (
        <header>
            <div>
                <h1 className='text-gradient'>CAFFIEND</h1>
                <p>For Coffee Insatiates</p>
            </div>
            <button onClick={(() => {setShowModal(true)})}>
                <p>Sign up free</p>
                <i className="fa-solid fa-mug-hot"></i>
            </button>
        </header>
    )

    const footer = (
        <footer>
            <p>
                <span className='text-gradient'>Caffiend</span> was made by <a target="_blank" href="https://3d-portfolio-sand-ten.vercel.app/">Kyle</a>
                <br/> using react & firebase
            </p>
        </footer>
    )

    return (
        <>
            {showModal && (
                <Modal handleCloseModal={(() => setShowModal(false))}>
                    <Authentication/>
                </Modal>
            )}
            {header}
            <main>
                {children}                
            </main>
            {footer}
        </>
    )
}
