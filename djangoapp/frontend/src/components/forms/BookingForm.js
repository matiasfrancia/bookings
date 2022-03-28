import React, {useEffect, useState} from 'react'
import '../../../static/css/Forms.css'
import validateBooking from './validateInfoBooking'
import useFormBooking from './../hooks/useFormBooking'

import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import { differenceInCalendarDays } from 'date-fns';


function BookingForm({ submitForm }) {

    const {handleChange, handleCalendarChange, values, 
        handleSubmit, errors, availableBlocks} = useFormBooking(submitForm, validateBooking);

    const [date, setDate] = useState(new Date());
    // const [disabledBlocks, setDisabledBlocks] = useState([]);

    // Hay que entregarle una lista con los días que van a estar bloqueadas las reservas en formato List<Date>
    const [disabledDates, setDisabledDates] = useState([]);

    useEffect(() => {
        console.log(disabledDates);
    }, [disabledDates]);

    useEffect(() => {
        getDisabledDates();
        console.log(disabledDates);
    }, []);

    const getDisabledDates = async (day) => {
        try {
    
            let res = await fetch("http://localhost:8000/api/disabled-days/", {
                method: "GET",
                headers: {"Content-Type": "application/json"},
            }).then(response => response.json())
            .then(response => setDisabledDates(response))
            .catch(error => console.log(error));
        
        } catch (err) {
            console.log(err);
        }
    }
        
    function isSameDay(a, b) {
        return differenceInCalendarDays(a, b) === 0;
    }

    function tileDisabled({ date, view }) {
        if (view === 'month') {
            return disabledDates.find(dDate => isSameDay(dDate, date));
        }
    }

    useEffect(() => {
        handleCalendarChange(date);
    }, [date]);
    
    function handleCalendar(newDate) {
        setDate(newDate);
    }

    /* Clickeamos el día del calendario, se genera una query que busca en la bd si hay algun bloque ocupado aquel día
        de ser así, se renderizan los que están disponibles en pantalla */

    /* useEffect(() => {
        if (blocks !== null) {
            console.log(disabledBlocks);
        }
    }, [disabledBlocks]);

    const availableBlocks = async (day) => {

        try {
          let bodyDict = {
            day: day
          };
  
          let res = await fetch("http://localhost:8000/api/get-blocks/", {
            method: "GET",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(bodyDict),
          }).then(response => response.json())
          .then(response => setDisabledBlocks(response))
          .catch(error => console.log(error));
          
        } catch (err) {
          console.log(err);
        }
    } */

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
                    <select 
                        className='select__input'
                        name='block'
                        onChange={handleChange}
                    >
                        {Object.keys(availableBlocks).map((key) => <option key={key}>{availableBlocks[key]}</option>)}
                    </select>
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