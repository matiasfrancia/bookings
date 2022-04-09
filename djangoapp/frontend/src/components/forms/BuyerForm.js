import React from 'react'
// import { Form, FormGroup, Label, Input, FormFeedback, FormText } from 'reactstrap'
import '../../../static/css/Forms.css'
import useForm from './../hooks/useFormBuyer'
import validateBuyer from './validateInfoBuyer'

function BuyerForm({ submitForm }) {
 
    const {handleChange, values, handleSubmit, errors} = useForm(submitForm, validateBuyer);

    return (
        <div className='form__container'>
            <p className='form__title'>Ingrese sus datos</p>
            <form className='form' onSubmit={handleSubmit}>
                <div className='form__inputs'>
                    <label htmlFor='name' className='form__label'>
                        Nombre
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
                    <label htmlFor='lastname' className='form__label'>
                        Apellido
                    </label>
                    <input
                        id='lastname'
                        type='text' 
                        name='lastname'
                        className='form__input'
                        placeholder=''
                        value={values.lastname}
                        onChange={handleChange}
                    />
                    {errors.lastname && <p className='form__error__text'>{errors.lastname}</p>}
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
                <div className='form__inputs'>
                    <label htmlFor='cellphone' className='form__label'>
                        Celular
                    </label>
                    <input
                        id='cellphone'
                        type='text' 
                        name='cellphone'
                        className='form__input'
                        placeholder=''
                        value={values.cellphone}
                        onChange={handleChange}
                    />
                    {errors.cellphone && <p className='form__error__text'>{errors.cellphone}</p>}
                </div>
                <div className='form__inputs' onChange={handleChange}>
                    <label htmlFor='documentType' className='form__label'>
                        Tipo de documento
                    </label>
                        <input
                            id='documentType'
                            type="radio"
                            color="primary"
                            name="documentType"
                            value="rut"
                            key="rut"
                        />
                        Rut
                        <input
                            id='documentType'
                            type="radio"
                            color="primary"
                            name="documentType"
                            key="pasaporte"
                            value="pasaporte"
                        />
                        Pasaporte
                    {errors.documentType && <p className='form__error__text'>{errors.documentType}</p>}
                </div>
                <div className='form__inputs'>
                    <label htmlFor='documentNumber' className='form__label'>
                        Número de documento
                    </label>
                    <input
                        id='documentNumber'
                        type='text' 
                        name='documentNumber'
                        className='form__input'
                        placeholder=''
                        value={values.documentNumber}
                        onChange={handleChange}
                    />
                    {errors.documentNumber && <p className='form__error__text'>{errors.documentNumber}</p>}
                </div>
                <button className='form__input__btn' type='submit'>
                    Enviar
                </button>
            </form>
        </div>
    );
}

export default BuyerForm