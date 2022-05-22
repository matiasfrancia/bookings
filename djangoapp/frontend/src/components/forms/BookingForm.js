import React, {useEffect, useState} from 'react';
import '../../../static/css/Forms.css';
import { validationsBooking as validationsFunction } from './validations';
import {Controller, useForm} from 'react-hook-form';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { differenceInCalendarDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

import { getBlocksForSelect } from '../../utils/functions/date_management';
import Select from "react-select";


function BookingForm({ submitForm }) {

    const prices = {
        "estudiante": 3000,
        "general": 10000,
    };

    const groupsSelect = [
        { value: 'general', label: 'General' },
        { value: 'estudiante', label: 'Estudiante' },
    ];

    const [group, setGroup] = useState("");
    const [date, setDate] = useState(null);
    const [disabledDates, setDisabledDates] = useState(null);
    const [disabledBlocks, setDisabledBlocks] = useState(null);
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);

    const { getValues, register, control, handleSubmit, formState: { errors } } = useForm();

    console.log("Errors:", errors);
    
    const onSubmit = data => {
        data.price = prices[data.group.value] * parseInt(data.visitants);
        console.log(data);
        submitForm(data);
    };

    // TODO: obtener los bloques desde variables de configuración
    
    
    const dateToString = (day) => formatInTimeZone(day, 'America/Santiago', 'yyyy-MM-dd');

    async function getDisabledBlocks(day) {

        // console.log("Day: ", day);   
        
        await fetch("http://localhost:8000/api/disabled-blocks/?day=" + dateToString(day), {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        }).then( response => {
            if(response.status !== 200 && response.status !== 204) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            if(response.status === 204) {
                return [];
            }
            return response.json();
        })
        .then(json => {
            if(json !== null && json !== []) {
                setDisabledBlocks(json);
            }
        })
        .catch(e => console.error("Ha ocurrido un error al conseguir los 'disabled blocks': ", e));
    }

    const setNextAvailableDate = () => {

        let auxDate = new Date();
        let isFree;

        if(disabledDates === null || disabledDates === []) {
            return auxDate;
        }

        do {
            isFree = true;
            for(let i = 0; i < disabledDates.length; i++) {
                if(dateToString(auxDate) == dateToString(disabledDates[i])) {
                    auxDate.setDate(auxDate.getDate() + 1);
                    isFree = false;
                    break;
                }
            }
        } while (!isFree);
        
        setDate(auxDate);
    }

    function convertStringstoDates(strDates) {
        return strDates.map(strDate => {
            var [year, month, day] = strDate.day.split('-');
            return new Date(year, month-1, day);
        });
    }
        
    function isSameDay(a, b) {
        return differenceInCalendarDays(a, b) === 0;
    }

    function tileDisabled({ date, view }) {
        if (view === 'month') {
            return disabledDates.find(dDate => isSameDay(dDate, date));
        }
    }

    async function getDisabledDates() {
        
        await fetch("http://localhost:8000/api/disabled-days/", {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        }).then( response => {
            if(response.status !== 200 && response.status !== 204) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            if(response.status === 204) {
                return [];
            }
            return response.json();
        })
        .then(json => {
            console.log(json);
            if(json !== null && json !== undefined && json !== []) {
                setDisabledDates(convertStringstoDates(json));
                console.log("Json con las fechas: ", json);
            }
            else {
                setDisabledDates([]);
            }
            setLoading(false);
        })
        .catch(e => console.error("Ha ocurrido un error al conseguir las 'disabled dates': ", e));
    }

    useEffect(async () => {
        await getDisabledDates();
    }, []);

    useEffect(() => {
        setNextAvailableDate();
    }, [disabledDates]);

    useEffect(() => {
        console.log("Disabled blocks:", disabledBlocks);
        setBlocks(getBlocksForSelect(disabledBlocks));
    }, [disabledBlocks]);

    useEffect(() => {
        console.log("Blocks:", blocks);
    }, [blocks]);

    useEffect(() => {
        if(date !== null) {
            console.log("Date in use effect:", date);
            getDisabledBlocks(date);
        }
    }, [date]);

    return (

        !loading && <form onSubmit={handleSubmit(onSubmit)}>

            <div className='form__inputs'>
                <Controller
                    name="booking_date"
                    control={control}
                    rules={{
                        validate: validationsFunction(disabledDates, groupsSelect, blocks, getValues)["booking_date"],
                    }}
                    defaultValue={date}
                    render={({field}) => (
                    <Calendar
                        {...field}
                        onChange={(e) => {
                            setDate(e);
                            field.onChange(e);
                        }}
                        minDate={new Date()}
                        minDetail='year'
                        next2Label=''
                        prev2Label=''
                        tileDisabled={tileDisabled}
                    />
                    )}
                />
                {errors.booking_date?.message}
            </div>

            <div className='form__inputs'>
                <label htmlFor="block">Bloque:</label><br />
                <Controller
                    id="block"
                    name="block"
                    control={control}
                    rules={{
                        validate: validationsFunction(disabledDates, groupsSelect, blocks, getValues)["block"],
                    }}
                    render={({field}) => (
                    <Select
                        {...field}
                        onChange={(e) => {
                            field.onChange(e);
                        }}
                        options={blocks}
                    />
                    )}
                />
                {errors.block?.message}
            </div>

            <div className='form__inputs'>
                <label htmlFor="visitants">Número de visitantes:</label><br />
                <input 
                    name='visitants' 
                    id='visitants' 
                    type="number"
                    {...register("visitants", {
                        validate: validationsFunction(disabledDates, groupsSelect, blocks, getValues)["visitants"],
                    })}
                />
                {errors.visitants?.message}
            </div>

            <div className='form__inputs'>
                <label htmlFor="group">Tipo de grupo:</label><br />
                <Controller
                    id="group"
                    name="group"
                    control={control}
                    rules={{ 
                        validate: validationsFunction(disabledDates, groupsSelect, blocks, getValues)["group"] 
                    }}
                    defaultValue={groupsSelect[0]}
                    render={({field}) => (
                    <Select
                        {...field}
                        onChange={(e) => {
                            setGroup(e);
                            field.onChange(e);
                        }}
                        options={groupsSelect}
                    />
                    )}
                />
                {errors.group?.message}
            </div>

            {group.value == "estudiante" && <div className='form__inputs'>
                <label htmlFor="school">Escuela:</label><br />
                <input 
                    name='school' 
                    id='school' 
                    {...register("school", { 
                        validate: validationsFunction(disabledDates, groupsSelect, blocks, getValues)['school'],
                    })} 
                />
                {errors.school?.message}
            </div>}

          <input type="submit" />
        </form>

    );
}

export default BookingForm