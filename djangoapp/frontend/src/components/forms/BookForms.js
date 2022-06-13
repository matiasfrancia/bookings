
import React, {useEffect, useState} from 'react'
import BookingForm from './BookingForm';
import BuyerForm from './BuyerForm';
import ConfirmationForm from './ConfirmationForm';
import { formatInTimeZone } from 'date-fns-tz';
import { Controller, useForm } from "react-hook-form";
import Calendar from 'react-calendar';

function BookForms() {

    const [isBuyerSubmitted, setIsBuyerSubmitted] = useState(false);
    const [isBookingSubmitted, setIsBookingSubmitted] = useState(false);
    const [isConfirmationSubmitted, setIsConfirmationSubmitted] = useState(false);
    const [goToConfirmation, setGoToConfirmation] = useState(false);

    // Booking data
    const [date, setDate] = useState(new Date());
    const [block, setBlock] = useState("");
    const [visitants, setVisitants] = useState(0);
    const [group, setGroup] = useState("");
    const [school, setSchool] = useState("");
    const [price, setPrice] = useState(0);

    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [cellphone, setCellphone] = useState("");
    const [documentType, setDocumentType] = useState("");
    const [documentNumber, setDocumentNumber] = useState("");
    
    const [token, setToken] = useState("");
    const [url, setUrl] = useState("");
    const [buyOrder, setBuyOrder] = useState("");

    const [resp, setResp] = useState({});

    // Callbacks
    function submitBuyerForm(data) {

      console.log(data);

      if(data.name != "" && data.lastname !== "" && data.email !== "" && data.cellphone !== "" && data.documentType !== "" && 
          data.documentNumber !== "") {
        setName(data.name);
        setLastname(data.lastname);
        setEmail(data.email);
        setCellphone(data.cellphone);
        setDocumentType(data.documentType);
        setDocumentNumber(data.documentNumber);

        setIsBuyerSubmitted(true);
      }
    }

    function submitBookingForm(data) {

      console.log(data);
  
      if(data.booking_date && data.block !== null && data.visitants !== '0' && data.price !== '0' && data.group !== null) {            
        setDate(data.booking_date);
        setBlock(data.block.value);
        setVisitants(parseInt(data.visitants));
        setPrice(parseInt(data.price));
        setGroup(data.group.value);
        setSchool(data.school);

        setIsBookingSubmitted(true);
      }
    }

    function submitConfirmationForm(data) {

      console.log("data submitConfirmationForm: ", data);

      if(data.confirmation === true, data.webpay === 'on') {
        console.log("entro al if");
        
        setIsConfirmationSubmitted(true);
      }
    }

    useEffect(() => {
      console.log(goToConfirmation);
    }, [goToConfirmation]);

    useEffect(() => {
      if(isBuyerSubmitted === true) {
        createWebpayPayment();
      }
    }, [isBuyerSubmitted]);

    useEffect(() => {
      console.log("Is confirmation submitted?")
    }, [isConfirmationSubmitted]);

    useEffect(() => {
      if(buyOrder !== null && buyOrder !== "" && token !== null && token !== "") {
        createBookingTemp();
      }
    }, [buyOrder, token]);


    async function createWebpayPayment() {
      
        let paymentData = {
          amount: price,
        }

        await fetch("http://localhost:8000/api/webpay-plus/create/", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(paymentData),
        }).then(response => {

            if(response.status !== 200) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            console.log("Se creó correctamente el pago");

            return response.json();
        })
        .then(json => {
            setToken(json["response"]["token"]);
            setUrl(json["response"]["url"]);
            setBuyOrder(json["buy_order"]);
            setGoToConfirmation(true);
        })
    }

    async function createBookingTemp () {
    
      let bodyDict = {
        token: token,
        code: buyOrder,
        booking_date: formatInTimeZone(date, 'America/Santiago', 'yyyy-MM-dd'),
        block: block,
        visitants: visitants,
        group: group,
        school: school,
        price: price,
    
        name: name,
        lastname: lastname,
        email: email,
        cellphone: cellphone,
        document_type: documentType,
        document_number: documentNumber
      };
    
      await fetch("http://localhost:8000/api/create-temp-booking/", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(bodyDict),
      }).then(response => {
    
          if(response.status !== 201 && response.status !== 400) {
              throw new Error(`HTTP error: ${response.status}`);
          }
    
          return response.json();
      })
      .then(json => {
          setResp(json);
          console.log("Respuesta creacion temp booking: ", json);

          if(json["error_msg"] !== null && json["error_msg"] !== undefined) {
              let error = json["error_msg"];
              alert("No se pudo crear la reserva:\n" + error  + "\nInténtelo nuevamente");
          }
      })
      .catch(function (e) {
          console.error("Ha ocurrido un error al crear la reserva: ", e);
      });
    }

    return (

        <div>
            {!isBookingSubmitted 
                ? (<BookingForm submitForm={submitBookingForm}/>)
                : !isBuyerSubmitted
                    ? (<BuyerForm submitForm={submitBuyerForm} />)
                    : (!isConfirmationSubmitted && goToConfirmation) && (
                        <ConfirmationForm submitForm={submitConfirmationForm} bookingDetails={{
                            booking_date: formatInTimeZone(date, 'America/Santiago', 'yyyy-MM-dd'),
                            block: block,
                            visitants: visitants,
                            group: group,
                            school: school,
                            price: price,
                            token: token,
                            url: url,
                        }} />)
            }
            
            {/* {<ConfirmationForm submitForm={submitConfirmationForm} bookingDetails={{
              booking_date: formatInTimeZone(new Date(), 'America/Santiago', 'yyyy-MM-dd'),
              block: "8:00-9:50",
              visitants: 10,
              group: "general",
              school: null,
              price: 80000,
            }} />} */}
        </div>
    )
}

export default BookForms