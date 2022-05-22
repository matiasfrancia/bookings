// import React, {useEffect, useState} from 'react'
// import BookingForm from './BookingForm';
// import BuyerForm from './BuyerForm';
// import ConfirmationForm from './ConfirmationForm';
// import { formatInTimeZone } from 'date-fns-tz';
// import { Controller, useForm } from "react-hook-form";
// import Calendar from 'react-calendar';

// function BookForms() {

//     const [isBuyerSubmitted, setIsBuyerSubmitted] = useState(false);
//     const [isBookingSubmitted, setIsBookingSubmitted] = useState(false);
//     const [isConfirmationSubmitted, setIsConfirmationSubmitted] = useState(false);
//     const [message, setMessage] = useState("");

//     // Booking data
//     const [date, setDate] = useState(new Date());
//     const [block, setBlock] = useState("");
//     const [visitants, setVisitants] = useState(0);
//     const [group, setGroup] = useState("");
//     const [school, setSchool] = useState("");
//     const [price, setPrice] = useState(0);

//     const [name, setName] = useState("");
//     const [lastname, setLastname] = useState("");
//     const [email, setEmail] = useState("");
//     const [cellphone, setCellphone] = useState("");
//     const [documentType, setDocumentType] = useState("");
//     const [documentNumber, setDocumentNumber] = useState("");

//     const [resp, setResp] = useState({});

//     // Callbacks
//     function submitBuyerForm(data) {

//       console.log(data);

//       if(data.name != "" && data.lastname !== "" && data.email !== "" && data.cellphone !== "" && data.documentType !== "" && 
//           data.documentNumber !== "") {
//         setName(data.name);
//         setLastname(data.lastname);
//         setEmail(data.email);
//         setCellphone(data.cellphone);
//         setDocumentType(data.documentType);
//         setDocumentNumber(data.documentNumber);

//         setIsBuyerSubmitted(true);
//       }
//     }

//     function submitBookingForm(data) {

//       console.log(data);
  
//       if(data.booking_date && data.block !== null && data.visitants !== '0' && data.price !== '0' && data.group !== null) {            
//         setDate(data.booking_date);
//         setBlock(data.block.value);
//         setVisitants(parseInt(data.visitants));
//         setPrice(parseInt(data.price));
//         setGroup(data.group.value);
//         setSchool(data.school);

//         setIsBookingSubmitted(true);
//       }
//     }

//     function submitConfirmationForm(data) {

//       console.log("data submitConfirmationForm: ", data);

//       if(data.confirmation === true, data.webpay === 'on') {
//         console.log("entro al if");
        
//         setIsConfirmationSubmitted(true);
//       }
//     }

//     useEffect(() => {
//       if(isConfirmationSubmitted) {
//         createBooking();
//       }
//     }, [isConfirmationSubmitted]);

//     useEffect(() => {
//       console.log(resp);
//       if(resp) {
//         createWebpayPayment();
//       }
//     }, [resp]);

//     async function createWebpayPayment() {
      
//         let paymentData = {
//           code: resp.code,
//           amount: resp.price,
//         }

//         // creamos el pago en webpay
//         await fetch("http://localhost:8000/api/webpay-plus/create/", {
//             method: "POST",
//             headers: {"Content-Type": "application/json"},
//             body: JSON.stringify(paymentData),
//         }).then(response => {

//             if(response.status !== 200) {
//                 throw new Error(`HTTP error: ${response.status}`);
//             }
//             console.log("Se creó correctamente el pago");

//             return response.json();
//         })
//         .then(json => {
//             // debemos redirigir al usuario al link de webpay retornado
//             // fetch(json["url"], {
//             //     method: "POST",
//             //     headers: {"Content-Type": "application/json"},
//             //     body: JSON.stringify({"token_ws": json["token"]}),
//             // })

//             // .then(response => {

//             //     if(response.status !== 200) {
//             //         throw new Error(`HTTP error: ${response.status}`);
//             //     }

//             //     return response.json();
//             // })
//             // .then(json => {
//             //     console.log("Respuesta commit:", json);
//             // })
//         })
//     }

//     async function createBooking () {

//       let bodyDict = {
//         booking_date: formatInTimeZone(date, 'America/Santiago', 'yyyy-MM-dd'),
//         block: block,
//         visitants: visitants,
//         group: group,
//         school: school,
//         price: price,

//         name: name,
//         lastname: lastname,
//         email: email,
//         cellphone: cellphone,
//         document_type: documentType,
//         document_number: documentNumber
//       };

//       await fetch("http://localhost:8000/api/create-booking/", {
//           method: "POST",
//           headers: {"Content-Type": "application/json"},
//           body: JSON.stringify(bodyDict),
//       }).then(response => {

//           if(response.status !== 201 && response.status !== 400) {
//               throw new Error(`HTTP error: ${response.status}`);
//           }

//           return response.json();
//       })
//       .then(json => {
//           setResp(json);
//           if(json["error_msg"] !== null && json["error_msg"] !== undefined) {
//               let error = json["error_msg"];
//               alert("No se pudo crear la reserva:\n" + error  + "\nInténtelo nuevamente");
//           }
//       })
//       .catch(function (e) {
//           console.error("Ha ocurrido un error al crear la reserva: ", e);
//       });
//     }

//     // TODO: terminar el frontend, crear sistema de pagos

//     return (

//         <div>
//             {!isBookingSubmitted 
//                 ? (<BookingForm submitForm={submitBookingForm}/>)
//                 : !isBuyerSubmitted
//                     ? (<BuyerForm submitForm={submitBuyerForm} />)
//                     : !isConfirmationSubmitted && (<><ConfirmationForm submitForm={submitConfirmationForm} bookingDetails={{
//                         booking_date: formatInTimeZone(date, 'America/Santiago', 'yyyy-MM-dd'),
//                         block: block,
//                         visitants: visitants,
//                         group: group,
//                         school: school,
//                         price: price,
//                     }} /></>)
//             }
            
//             {/* {<ConfirmationForm submitForm={submitConfirmationForm} bookingDetails={{
//               booking_date: formatInTimeZone(new Date(), 'America/Santiago', 'yyyy-MM-dd'),
//               block: "8:00-9:50",
//               visitants: 10,
//               group: "general",
//               school: null,
//               price: 80000,
//             }} />} */}
//         </div>
//     )
// }

// export default BookForms

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
        createBooking();
      }
    }, [isBuyerSubmitted]);

    useEffect(() => {
      console.log("Is confirmation submitted?")
    }, [isConfirmationSubmitted]);

    useEffect(() => {
      console.log(resp);
      if(resp.code) {
        createWebpayPayment();
      }
    }, [resp]);

    async function createWebpayPayment() {
      
        let paymentData = {
          code: resp.code,
          amount: resp.price,
        }

        // creamos el pago en webpay
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
            setToken(json["token"]);
            setUrl(json["url"]);
            setGoToConfirmation(true);
        })
    }

    async function createBooking () {

      let bodyDict = {
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

      await fetch("http://localhost:8000/api/create-booking/", {
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
          if(json["error_msg"] !== null && json["error_msg"] !== undefined) {
              let error = json["error_msg"];
              alert("No se pudo crear la reserva:\n" + error  + "\nInténtelo nuevamente");
          }
      })
      .catch(function (e) {
          console.error("Ha ocurrido un error al crear la reserva: ", e);
      });
    }

    // TODO: terminar el frontend, crear sistema de pagos

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