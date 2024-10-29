import React from 'react'
import {coffeeOptions} from '../utils'
import { useState } from 'react'
import Authentication from './Authentication'
import Modal from './Modal'
import { useAuth } from '../context/AuthContext'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'

export default function CoffeeForm(props) {
  const {isAuthenticated} = props
  const [showModal, setShowModal] = useState(false)
  const [selectedCoffee, setSelectedCoffee] = useState(null) 
  const [showCoffeeTypes, setShowCoffeeTypes] = useState(false)
  const [coffeeCost, setCoffeeCost] = useState(0)
  const [hour, setHour] = useState(0)
  const [min, setMin] = useState(0)

  const {globalData, setGlobalData, globalUser} = useAuth()

  async function handleSubmitForm() {
    if (!isAuthenticated) {
      setShowModal(true)
      return
    }

    //define a guard clause that only submits the form if it's completed
    if(!selectedCoffee) {
      return
    }

    try {
      // then we're going to create a new data object
      const newGlobalData = {
          ...(globalData || {})
      }

      const nowTime = Date.now()
      const timeToSubtract = (hour * 60 * 60 * 1000) + (min * 60 * 1000)
      const timestamp = nowTime - timeToSubtract

      const newData = {
          name: selectedCoffee,
          cost: coffeeCost
      }
      newGlobalData[timestamp] = newData
      console.log(timestamp, selectedCoffee, coffeeCost)

      // update the global state
      setGlobalData(newGlobalData)

      // persist the data in the firebase firestore
      const userRef = doc(db, 'users', globalUser.uid)
      const res = await setDoc(userRef, {
          [timestamp]: newData
      }, { merge: true })

      setSelectedCoffee(null)
      setHour(0)
      setMin(0)
      setCoffeeCost(0)
      console.log('tried to set values back to zero')

    } catch (err) {
        console.log(err.message)
    }
    
  }

  function handleCloseModal(){
    setShowModal(false)
}

  return (
    <>
      {showModal && (
        <Modal handleCloseModal={handleCloseModal}>
          <Authentication handleCloseModal={handleCloseModal}/>
        </Modal>
      )}
      <div className='section-header'>
        <i className="fa-solid fa-pencil"></i>
        <h2>Start Tracking Today</h2>
      </div>
      <h4>Select coffee type</h4>
      <div className='coffee-grid'>
        {coffeeOptions.slice(0, 5).map((option, optionIndex) => {
          return (
            <button className={'button-card ' + (option.name === selectedCoffee ? 'coffee-button-selected' : ' ')} key={optionIndex} onClick={() => {
              setSelectedCoffee(option.name)
              setShowCoffeeTypes(false)
            }}>
              <h4>{option.name}</h4>
              <p>{option.caffeine} mg </p>
            </button>
          )
        })}
        <button className={'button-card ' + (showCoffeeTypes ? 'coffee-button-selected' : ' ')} onClick = {() => {
          setShowCoffeeTypes(true);
          setSelectedCoffee(null)
        }}>
          <h4>Other</h4>
          <p>n/a</p>
        </button>
      </div>
      {showCoffeeTypes &&(
        <select id="coffee-list" name="coffee-list" onChange={(e) => {
          setSelectedCoffee(e.target.value)
        }}>
          <option value={null}>Select type</option>
          {coffeeOptions.map((option, optionIndex) => {
            return (
              <option value={option.name} key={optionIndex}>
                {option.name} ({option.caffeine}mg) 
              </option>
            )
          })}
      </select>)}

      <h4>Add the cost ($)</h4>
      <input className='w-full' type="number" placeholder='4.5' value={coffeeCost} onChange={(e) =>{
        setCoffeeCost(e.target.value) 
      }}/>

      <h4>Time since consumption</h4>
      <div className='time-entry'>
        <div>
          <h6>Hours</h6>
          <select onChange={(e) => {setHour(e.target.value)}} id='hours-select'>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 
            21, 22, 23].map((hour, hourIndex) => {
              return(
                <option key={hourIndex} value={hour}> {hour}</option>
              )
            })}
          </select>
        </div>
        <div>
          <h6>Mins</h6>
          <select onChange={(e) => {setMin(e.target.value)}} id='mins-select'>
            {[0, 5, 10, 15, 30, 45].map((min, minIndex) => {
              return(
                <option key={minIndex} value={min}> {min}</option>
              )
            })}
          </select>
        </div>
      </div>
      <button onClick={handleSubmitForm}>
        <p>Add Entry</p>
      </button>
    </>
  )
}
