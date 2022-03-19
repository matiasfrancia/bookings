import React from 'react'
// import { Form, FormGroup, Label, Input, FormFeedback, FormText } from 'reactstrap'
import '../../static/css/Forms.css'
import useForm from './../components/hooks/useFormBuyer'
import validateBuyer from './validateInfoBuyer'

function BuyerForm({ submitForm }) {
 
    const {handleChange, values, handleSubmit, errors} = useForm(submitForm, validateBuyer);

    return (
        <div className='form__container'>
            <p className='form__title'>Ingrese sus datos</p>
            <form className='form' onSubmit={handleSubmit}>
                <div className='form__inputs'>
                    <label htmlFor='name' className='form__label'>
                        Nombre Completo
                    </label>
                    <input
                        id='name'
                        type='text' 
                        name='name'
                        className='form__input'
                        placeholder=''
                        value={values.name}
                        onChange={handleChange}
                    />
                    {errors.name && <p className='form__error__text'>{errors.name}</p>}
                </div>
                <div className='form__inputs'>
                    <label htmlFor='rut' className='form__label'>
                        Rut/N° pasaporte
                    </label>
                    <input
                        id='rut'
                        type='text' 
                        name='rut'
                        className='form__input'
                        placeholder=''
                        value={values.rut}
                        onChange={handleChange}
                    />
                    {errors.rut && <p className='form__error__text'>{errors.rut}</p>}
                </div>
                <div className='form__inputs'>
                    <label htmlFor='email' className='form__label'>
                        Email
                    </label>
                    <input 
                        id='email'
                        type='email' 
                        name='email'
                        className='form__input'
                        placeholder=''
                        value={values.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p className='form__error__text'>{errors.email}</p>}
                </div>
                <button className='form__input__btn' type='submit'>
                    Enviar
                </button>
            </form>
        </div>
    );
}

export default BuyerForm