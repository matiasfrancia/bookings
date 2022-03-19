import React, {useEffect, useState} from 'react'
import '../../static/css/Forms.css'
import validateBooking from './validateInfoBooking'
import useFormBooking from './../components/hooks/useFormBooking'

import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import { differenceInCalendarDays } from 'date-fns';

// Hay que entregarle una lista con los días que van a estar bloqueadas las reservas en formato List<Date>
const disabledDates = [new Date(2022, 2, 19), new Date(2022, 2, 22)];
    
function isSameDay(a, b) {
    return differenceInCalendarDays(a, b) === 0;
}

function tileDisabled({ date, view }) {
    if (view === 'month') {
        return disabledDates.find(dDate => isSameDay(dDate, date));
    }
}

/* Para crear una nueva reserva hay que mandar estos datos
booking_date
block
visitants
price
buyer */

function BookingForm({ submitForm }) {

    const {handleChange, handleCalendarChange, values, handleSubmit, errors} = useFormBooking(submitForm, validateBooking);
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        handleCalendarChange(date);
    }, [date]);
    
    function handleCalendar(newDate) {
        setDate(newDate);
    }

    return (
        <div className='form__container'>
            <p className='form__title'>Datos de la reserva</p>
            <form className='form' onSubmit={handleSubmit}>

            <div className='form__inputs'>
                    <label htmlFor='visitants' className='form__label'>
                        Cantidad de Visitantes
                    </label>
                    <input
                        id='visitants'
                        type='number' 
                        name='visitants'
                        className='form__input'
                        placeholder=''
                        value={values.visitants} // Revisar que exista ese atributo en values
                        onChange={handleChange}
                    />
                    {errors.visitants && <p className='form__error__text'>{errors.visitants}</p>}
                </div>

                <div className='form__inputs'>
                    <Calendar
                        value={values.booking_date}
                        name="booking_date"
                        onChange={handleCalendar}
                        minDate={new Date()}
                        minDetail='year'
                        next2Label=''
                        prev2Label=''
                        tileDisabled={tileDisabled}
                    />
                </div>

                <div className='form__inputs'>
                    <label htmlFor='block' className='form__label'>
                        Bloque
                    </label>
                    <input
                        id='block'
                        type='number' 
                        name='block'
                        className='form__input'
                        placeholder=''
                        value={values.block} // Revisar que exista ese atributo en values
                        onChange={handleChange}
                    />
                    {errors.block && <p className='form__error__text'>{errors.block}</p>}
                </div>

                <button className='form__input__btn' type='submit'>
                    Enviar
                </button>
            </form>
        </div>
    )
}

export default BookingForm