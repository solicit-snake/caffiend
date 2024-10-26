import React from 'react'

export default function Hero() {
  return (
    <>
      <h1>Coffee Tracking for Coffee <abbr title="An enthusiast or devotee">Fiends</abbr></h1>
      <div className='benefits-list'>
        <h3 className='font-bolder'>Try <span className="text-gradient">Caffiend</span> and start ...</h3>
        <p>✅ Tracking every coffee</p>
        <p>✅ Measuring your blood caffeine levels </p>
        <p>✅ Costing and quantifying your addiction</p>
      </div>
      <div className='card info-card'>
        <div>
          <i className="fa-solid fa-circle-info"></i>
          <h3>Did you know ...</h3>
        </div>
        <h5>That caffine&apos;s half-life is about 5 hours?</h5>
        <p>This meas that after 5 hours, half the caffine you consumed is still in your system, keeping you alert alonger!
          So if you drink a coffee with 200mg of caffine, 5 hours later you&apos;ll still have about
          100mg of caffine in your system.
        </p>
      </div>
    </>
  )
}
