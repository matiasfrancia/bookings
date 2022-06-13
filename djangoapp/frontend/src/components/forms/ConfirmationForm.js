import React, {useState} from 'react';
// import { Form, FormGroup, Label, Input, FormFeedback, FormText } from 'reactstrap'
import '../../../static/css/Forms.css'
import { useForm } from 'react-hook-form';
import { validationsConfirmation as validationsFunction } from './validations';

function ConfirmationForm({ bookingDetails }) {

    const [confirmation, setConfirmation] = useState(false);

    return (
        <div className='form__container'>
            <p className='form__title'>Confirmar Reserva</p><br />

            <p>Fecha de la reserva: {bookingDetails.booking_date}</p>
            <p>Bloque de la reserva: {bookingDetails.block}</p>
            <p>Número de visitantes ingresados: {bookingDetails.visitants}</p>
            <p>Total: {bookingDetails.price}</p>

            <label htmlFor='confirmation' className='form__label'>
                Acepto los términos y condiciones, al igual que las políticas de cancelación y reembolso
            </label>
            <input
                id='confirmation'
                type='checkbox' 
                name='confirmation'
                className='checkbox__input'
                onChange={(e) => setConfirmation(!confirmation)}
            />

            <form action={bookingDetails.url}>
                <input type="hidden" name="token_ws" value={bookingDetails.token}/>
                <input 
                    disabled={!confirmation}
                    type="submit" 
                    value="Pagar con Webpay" 
                />
            </form>

        </div>
    );
}

export default ConfirmationForm