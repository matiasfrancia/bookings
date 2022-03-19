import React, {useEffect, useState} from 'react'
import BookingForm from './BookingForm';
import BuyerForm from './BuyerForm';

function BookForms() {

    const [isBuyerSubmitted, setIsBuyerSubmitted] = useState(false);
    const [isBookingSubmitted, setIsBookingSubmitted] = useState(false);

    // Buyer data
    const [name, setName] = useState("");
    const [rut, setRut] = useState("");
    const [email, setEmail] = useState("");

    // Booking data
    const [date, setDate] = useState(new Date());
    const [block, setBlock] = useState(0);
    const [visitants, setVisitants] = useState(0);
    const [price, setPrice] = useState(0);
    const [buyer, setBuyer] = useState(0);

    const [message1, setMessage1] = useState("");
    const [message2, setMessage2] = useState("");

    // Callbacks
    function submitBuyerForm(data) {

      if(data.name && data.rut && data.email) {
        setName(data.name);
        setRut(data.rut);
        setEmail(data.email);

        setIsBuyerSubmitted(true);
      }
    }

    function submitBookingForm(data) {

      /* console.log("Se llamó a la función que envía el booking form: " + 
          Object.entries(data).map(([key, value]) => "\n" + key + ": " + value)); */
  
      if(data.booking_date && data.block !== 0 && data.visitants !== 0 && data.price !== 0 && data.buyer !== 0) {            
        setDate(data.booking_date);
        setBlock(data.block);
        setVisitants(data.visitants);
        setPrice(data.price);
        setBuyer(data.buyer);

        callAPI();

        setIsBookingSubmitted(true);
      }
    }

    const createBuyer = async () => {
      try {
        let res = await fetch("http://localhost:8000/api/create-buyer", {
          method: "POST",
          body: JSON.stringify({
            name: name,
            rut: rut,
            email: email
          }),
        });
        let resJson = await res.json(); // Observar si devuelve el buyer_id
        console.log("ResJson buyer: " + resJson);
        if (res.status === 201) {
          setName("");
          setRut("");
          setEmail("");
          setMessage1("Buyer created successfully");
        } else {
          setMessage1("Some error occured");
        }
      } catch (err) {
        console.log(err);
      }
    }

    const createBooking = async () => {
      try {
        let res = await fetch("http://localhost:8000/api/create-booking", {
          method: "POST",
          body: JSON.stringify({
            booking_date: date,
            block: block,
            visitants: visitants,
            price: price,
            buyer: buyer
          }),
        });
        let resJson = await res.json();
        console.log("ResJson booking: " + resJson);
        if (res.status === 201) {
          setDate(new Date());
          setBlock(0);
          setVisitants(0);
          setPrice(0);
          setBuyer(0);
          setMessage2("Booking created successfully");
        } else {
          setMessage2("Some error occured");
        }
      } catch (err) {
        console.log(err);
      }
    }

    function callAPI() {
      createBuyer();
      // createBooking();
    }

    return (
        <div>
            {!isBuyerSubmitted 
                ? (<BuyerForm submitForm={submitBuyerForm} />)
                : !isBookingSubmitted
                    ? (<BookingForm submitForm={submitBookingForm}/>)
                    : (<div><p>{message1}</p><br/><p>{message2}</p></div>)
            }
        </div>
    )
}

export default BookForms