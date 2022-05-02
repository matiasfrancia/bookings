import React, {useEffect, useState} from 'react'
import '../../../static/css/Forms.css'
import validateBooking from './validateInfoBooking'
import useFormBooking from './../hooks/useFormBooking'

import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { differenceInCalendarDays } from 'date-fns'

import {ButtonGroup, Button} from 'reactstrap'


function BookingForm({ submitForm }) {

    const {
        handleChange, 
        handleCalendarChange, 
        handleBlockChange,
        handleGroupChange,
        handleSchoolChange,
        values, 
        handleSubmit, 
        errors, 
        availableBlocks
    } = useFormBooking(submitForm, validateBooking);

    const [date, setDate] = useState(new Date());
    const [disabledDates, setDisabledDates] = useState([]);
    const [block, setBlock] = useState("");
    const [group, setGroup] = useState("");
    const [school, setSchool] = useState("");

    useEffect(() => {
        console.log(disabledDates);
    }, [disabledDates]);

    useEffect(() => {
        getDisabledDates();
        console.log(disabledDates);
    }, []);

    useEffect(() => {
        handleCalendarChange(date);
    }, [date]);

    useEffect(() => {
        handleBlockChange(block);
    }, [block]);

    useEffect(() => {
        handleGroupChange(group);
    }, [group]);

    useEffect(() => {
        handleSchoolChange(school);
    }, [school]);

    function convertStringstoDates(strDates) {
        return strDates.map(strDate => {
            console.log("StrDate: " + strDate.day);
            var [year, month, day] = strDate.day.split('-');
            return new Date(year, month-1, day);
        });
    }

    const getDisabledDates = async () => {
        try {
    
            await fetch("http://localhost:8000/api/disabled-days/", {
                method: "GET",
                headers: {"Content-Type": "application/json"},
            }).then(response => response.json())
            .then(response => setDisabledDates(convertStringstoDates(response)))
            .catch(error => console.log(error));
        
        } catch (err) {
            console.log(err);
        }
    }
        
    function isSameDay(a, b) {
        if(differenceInCalendarDays(a, b) === 0) {
            console.log("Son iguales!!");
        }
        return differenceInCalendarDays(a, b) === 0;
    }

    function tileDisabled({ date, view }) {
        if (view === 'month') {
            return disabledDates.find(dDate => isSameDay(dDate, date));
        }
    }
    
    function handleCalendar(newDate) {
        setDate(newDate);
    }

    return (
        <div className='form__container'>
            <p className='form__title'>Datos de la reserva</p>
            <form className='form' onSubmit={handleSubmit}>

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
                    </label><p></p>
                    <ButtonGroup>
                    {Object.values(availableBlocks).length > 0 
                        ? Object.values(availableBlocks).map((key) => 
                        <Button
                            className={block == key ? 'btn__active' : ''}
                            color="primary"
                            name={key}
                            value={values.block}
                            onClick={(e) => {setBlock(key)}}
                        >
                        {key}
                        </Button>
                        )
                        : 'Se encuentran todos los bloques del día reservados'
                    }
                    </ButtonGroup>
                    {errors.block && <p className='form__error__text'>{errors.block}</p>}
                </div>

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
                    <label htmlFor='group' className='form__label'>
                        Tipo de grupo
                    </label>
                    <ButtonGroup>
                        <Button
                            className={group == "estudiante" ? 'btn__active' : ''}
                            color="primary"
                            name="estudiante"
                            value={values.group}
                            key="estudiante"
                            onClick={(e) => {setGroup("estudiante")}}
                        >
                        {"Estudiante"}
                        </Button>
                        <Button
                            className={group == "general" ? 'btn__active' : ''}
                            color="primary"
                            name="general"
                            key="general"
                            value={values.group}
                            onClick={(e) => {setGroup("general")}}
                        >
                        {"General"}
                        </Button>
                    </ButtonGroup>
                    {errors.group && <p className='form__error__text'>{errors.group}</p>}
                </div>

                {/* TODO: crear un solo componente con todos los input
                    Tendría que tener:
                    - label
                    - name
                    - id
                    - clase 
                    - placeholder
                    - value
                    - setter
                    - errors
                */}

                {group == "estudiante" 
                ?    <div className='form__inputs'>
                        <label htmlFor='school' className='form__label'>
                            Nombre de la institución educativa
                        </label>
                        <input
                            id='school'
                            type='text' 
                            name='school'
                            className='form__input'
                            placeholder=''
                            value={values.school} // Revisar que exista ese atributo en values
                            onChange={(e) => {setSchool(e.target.value)}}
                        />
                        {/* TODO: agregar iconos de error */}
                        {errors.school && <p className='form__error__text'>{errors.school}</p>}
                    </div>
                : <div></div>
                }

                <button className='form__input__btn' type='submit'>
                    Enviar
                </button>
            </form>
        </div>
    )
}

export default BookingForm