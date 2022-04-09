import React, {useEffect, useState} from 'react'
import BookingForm from './BookingForm';
import BuyerForm from './BuyerForm';
import ConfirmationForm from './ConfirmationForm';

function BookForms() {

    const [isBuyerSubmitted, setIsBuyerSubmitted] = useState(false);
    const [isBookingSubmitted, setIsBookingSubmitted] = useState(false);
    const [isConfirmationSubmitted, setIsConfirmationSubmitted] = useState(false);
    const [message, setMessage] = useState("");

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

    const [resp, setResp] = useState({});

    // Callbacks
    function submitBuyerForm(data) {

      console.log(data);

      if(data.name && data.lastname !== "" && data.email !== "" && data.cellphone !== "" && data.documentType !== "" && 
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
  
      if(data.booking_date && data.block !== "" && data.visitants !== 0 && data.price !== 0 && data.group !== "") {            
        setDate(data.booking_date);
        setBlock(data.block);
        setVisitants(data.visitants);
        setPrice(data.price);
        setGroup(data.group);
        setSchool(data.school);

        setIsBookingSubmitted(true);
      }
    }

    function submitConfirmationForm(data) {

      if(data.confirmated, data.subtotal) { // add Confirmation details
        
        setIsConfirmationSubmitted(true);
      }
    }

    useEffect(() => {
      if(isBuyerSubmitted) {
        createBooking();
      }
    }, [isBuyerSubmitted]);

    useEffect(() => {
      console.log(resp);
    }, [resp]);

    const createBooking = async () => {
      try {
        
        let bodyDict = {
          booking_date: date.toISOString().split('T')[0],
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

        let res = await fetch("http://localhost:8000/api/create-booking/", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(bodyDict),
        }).then(response => response.json())
        .then(response => setResp(response))
        .catch(error => console.log(error));
        
        // TODO: se puede cambiar y evaluar el código de respuesta HTTP
        if (resp.code !== null) {
          setMessage("La reserva fue generada con éxito");
        } else {
          setMessage("Ocurrió un error al crear la reserva, recargue la página e intente nuevamente");
        }
      } catch (err) {
        console.log(err);
      }
    }

    // TODO: terminar el frontend, crear sistema de pagos y sistema de administración (bloquear bloques y días)
    // TODO: cuando se ingrese a la vista con el calendario, el día seleccionado por defecto debe ser el siguiente en el cual hay una fecha disponible

    return (
        <div>
            {!isBookingSubmitted 
                ? (<BookingForm submitForm={submitBookingForm}/>)
                : !isBuyerSubmitted
                    ? (<BuyerForm submitForm={submitBuyerForm} />)
                    : !isConfirmationSubmitted
                        ? (<><ConfirmationForm submitForm={submitConfirmationForm} /></>
                          )
                        : (
                          <div>
                            <p>{message}</p>
                            <p>Código de la reserva: {resp.code}</p>
                            <p>Fecha de la reserva: {resp.booking_date}</p>
                            <p>Bloque de la reserva: {resp.block}</p>
                            <p>Número de visitantes ingresados: {resp.visitants}</p>
                            <button type="button" className="btn" onClick={() => window.location.reload()}>Volver</button>
                          </div>
                    )
            }
            
            {/* <BookingForm submitForm={submitBookingForm} /> */}
        </div>
    )
}

export default BookForms