import React, {useState} from 'react';
// import { Form, FormGroup, Label, Input, FormFeedback, FormText } from 'reactstrap'
import '../../../static/css/Forms.css'
import { useForm } from 'react-hook-form';
import { validationsConfirmation as validationsFunction } from './validations';

function ConfirmationForm({ bookingDetails }) {
 
    // const { register, handleSubmit, formState: { errors } } = useForm();

    const [confirmation, setConfirmation] = useState(false);
    
    const onSubmit = data => {
        console.log(data);
        // submitForm(data);
    };

    return (
        <div className='form__container'>
            <p className='form__title'>Confirmar Reserva</p><br />

            <p>Fecha de la reserva: {bookingDetails.booking_date}</p>
            <p>Bloque de la reserva: {bookingDetails.block}</p>
            <p>Número de visitantes ingresados: {bookingDetails.visitants}</p>
            <p>Total: {bookingDetails.price}</p>

            {/* <form className='form' onSubmit={handleSubmit(onSubmit)}>

                <div className='form__inputs'>
                    <label htmlFor='confirmation' className='form__label'>
                        Acepto los términos y condiciones, al igual que las políticas de cancelación y reembolso
                    </label>
                    <input
                        id='confirmation'
                        type='checkbox' 
                        name='confirmation'
                        className='form__input'
                        {...register("confirmation", {
                            validate: validationsFunction()["confirmation"]
                        })}
                    />
                    {errors.confirmation?.message}
                </div>

                <div className='form__inputs'>
                    <label htmlFor='webpay' className='form__label'>
                        Webpay
                    </label>
                    <input
                        id='webpay'
                        type='radio' 
                        name='webpay'
                        className='form__input'
                        {...register("webpay", {
                            validate: validationsFunction()["webpay"]
                        })} 
                    />
                    {errors.webpay?.message}
                </div>

                <button className='form__input__btn' type='submit'>
                    Pagar
                </button>
            </form> */}

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