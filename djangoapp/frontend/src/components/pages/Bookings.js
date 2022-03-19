import React from 'react'
import BookForms from './../../forms/BookForms'
import BuyerForm from './../../forms/BuyerForm'
import LandingTitle from './../LandingTitle'

function Bookings() {
  return (
    <div>
        <LandingTitle title='RESERVAS' background_image='img-3.jpg' />
        <BookForms />
    </div>
  )
}

export default Bookings