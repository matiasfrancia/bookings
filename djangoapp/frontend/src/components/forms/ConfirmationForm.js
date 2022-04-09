import React from 'react'
// import { Form, FormGroup, Label, Input, FormFeedback, FormText } from 'reactstrap'
import '../../../static/css/Forms.css'
import useForm from './../hooks/useFormConfirmation'
import validateConfirmation from './validateInfoConfirmation'

function ConfirmationForm({ submitForm }) {
 
    const {handleChange, values, handleSubmit, errors} = useForm(submitForm, validateConfirmation);

    return (
        <div className='form__container'>
            <p className='form__title'>Confirmar Reserva</p>
            <form className='form' onSubmit={handleSubmit}>
                <div className='form__inputs'>
                    <label htmlFor='confirmation' className='form__label'>
                        Acepto los términos y condiciones, al igual que las políticas de cancelación y reembolso
                    </label>
                    <input
                        id='confirmation'
                        type='checkbox' 
                        name='confirmation'
                        className='form__input'
                        placeholder=''
                        value={values.confirmation}
                        onChange={handleChange}
                    />
                    {errors.confirmation && <p className='form__error__text'>{errors.confirmation}</p>}
                </div>
                <button className='form__input__btn' type='submit'>
                    Pagar
                </button>
            </form>
        </div>
    );
}

export default ConfirmationForm