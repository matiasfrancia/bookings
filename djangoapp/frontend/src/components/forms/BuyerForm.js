import React from 'react';
import '../../../static/css/Forms.css';
import { validationsBuyer as validationsFunction } from './validations';
import {Controller, useForm} from 'react-hook-form';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

function BuyerForm({ submitForm }) {

    const { getValues, register, control, handleSubmit, formState: { errors } } = useForm();

    console.log("Errors:", errors);
    
    const onSubmit = data => {
        console.log(data);
        submitForm(data);
    };

    return (
        <div className='form__container'>
            <p className='form__title'>Ingrese sus datos</p>
            <form className='form' onSubmit={handleSubmit(onSubmit)}>
                <div className='form__inputs'>
                    <label htmlFor='name' className='form__label'>
                        Nombre
                    </label>
                    <input
                        id='name'
                        type='text' 
                        name='name'
                        className='form__input'
                        {...register("name", {
                            validate: validationsFunction(getValues)["name"],
                        })}
                    />
                    {errors.name?.message}
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
                        {...register("lastname", {
                            validate: validationsFunction(getValues)["lastname"],
                        })}
                    />
                    {errors.lastname?.message}
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
                        {...register("email", {
                            validate: validationsFunction(getValues)["email"],
                        })}
                    />
                    {errors.email?.message}
                </div>
                <div className='form__inputs'>
                    <label htmlFor='cellphone' className='form__label'>
                        Celular
                    </label>
                    <Controller
                        name="cellphone"
                        control={control}
                        rules={{
                            validate: (value) => isValidPhoneNumber(value) || (
                            <p>El formato del celular es incorrecto</p>)
                        }}
                        render={({ field: { onChange, value } }) => (
                            <PhoneInput
                            value={value}
                            onChange={onChange}
                            defaultCountry="CL"
                            id="cellphone"
                            />
                        )}
                    />
                    {errors.cellphone?.message}
                </div>
                <div className='form__inputs'>
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
                            {...register("documentType", {
                                validate: validationsFunction(getValues)["documentType"],
                            })}
                            defaultChecked
                        />
                        Rut
                        <input
                            id='documentType'
                            type="radio"
                            color="primary"
                            name="documentType"
                            key="pasaporte"
                            value="pasaporte"
                            {...register("documentType", {
                                validate: validationsFunction(getValues)["documentType"],
                            })}
                        />
                        Pasaporte
                    {errors.documentType?.message}
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
                        {...register("documentNumber", {
                            validate: validationsFunction(getValues)["documentNumber"],
                        })}
                    />
                    {errors.documentNumber?.message}
                </div>
                <button className='form__input__btn' type='submit'>
                    Enviar
                </button>
            </form>
        </div>
    );
}

export default BuyerForm