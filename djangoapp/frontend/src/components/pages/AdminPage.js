import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { formatInTimeZone } from 'date-fns-tz';
import { isSameDay, convertStringstoDates, getBlocksInfo } from '../../utils/functions/date_management';
import { UncontrolledAccordion } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import AccordionBlockItem from './../AccordionBlockItem';

function AdminPage() {

    const [disabledDates, setDisabledDates] = useState([]);

    const [isSelectedDayBlocked, setIsSelectedDayBlocked] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [disabledBlocks, setDisabledBlocks] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [blocks, setBlocks] = useState([]);
    
    const [loading, setLoading] = useState(true);
    
    async function getDisabledDates(date = null) {
        
        await fetch("http://localhost:8000/api/disabled-days/", {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        }).then( response => {
            if(response.status !== 200 && response.status !== 204) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        })
        .then(json => {
            console.log("Text: ", json);
            if(json !== null) {
                setDisabledDates(convertStringstoDates(json));
            }
            else {
                setDisabledDates([]);
            }

            setSelectedDay(date === null ? new Date() : date);
            setLoading(false);
        })
        .catch(e => console.error("Ha ocurrido un error al conseguir las 'disabled dates': ", e));
    }

    async function createDisabledDate() {

        let bodyDict = {
            "day": formatInTimeZone(selectedDay, 'America/Santiago', 'yyyy-MM-dd'),
        }

        await fetch("http://localhost:8000/api/create-day/", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(bodyDict),
        }).then(response => {

            if(response.status !== 201 && response.status !== 400) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            getDisabledDates(selectedDay);

            return response.json();
        })
        .then(json => {
            console.log(json);
            if(json["error_msg"] !== null && json["error_msg"] !== undefined) {
                let error = json["error_msg"];
                alert("No se pudo bloquear el día:\n" + error);
            }
            else {
                setIsSelectedDayBlocked(true);
            }
        })
        .catch(function (e) {
            console.error("Ha ocurrido un error al deshabilitar el día: ", e);
        });
    }

    async function deleteDisabledDate() {

        await fetch("http://localhost:8000/api/days/delete/?day=" + formatInTimeZone(selectedDay, 'America/Santiago', 'yyyy-MM-dd'), {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
        }).then(function(response) {

            if(response.status !== 202) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            getDisabledDates(selectedDay);
            setIsSelectedDayBlocked(false);
            console.log("Pasó por la función del no catch!!!");
        })
        .catch(function (e) {
            console.error("Ha ocurrido un error al habilitar el día: ", e);
        });
    }

    async function getDisabledBlocks(day) {
        
        await fetch("http://localhost:8000/api/disabled-blocks/?day=" + formatInTimeZone(day, 'America/Santiago', 'yyyy-MM-dd'), {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        }).then( response => {
            if(response.status !== 200 && response.status !== 204) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            if(response.status === 204) {
                console.log("Paso por el if con 204");
                return [];
            }
            return response.json();
        })
        .then(json => {
            console.log("Blocks: ", json);
            if(json !== null && json !== []) {
                setDisabledBlocks(json);
            }
        })
        .catch(e => console.error("Ha ocurrido un error al conseguir los 'disabled blocks': ", e));
    }

    async function getBookings(day) {
        
        await fetch("http://localhost:8000/api/bookings/?booking_date=" + formatInTimeZone(day, 'America/Santiago', 'yyyy-MM-dd'), {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        }).then( response => {
            if(response.status !== 200 && response.status !== 204) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            if(response.status === 204) {
                console.log("Paso por el if con 204 (booking)");
                return [];
            }
            return response.json();
        })
        .then(json => {
            if(json !== null && json !== []) {
                setBookings(json);
            }
        })
        .catch(e => console.error("Ha ocurrido un error al buscar la reserva: ", e));
    }

    let handleCalendarChange = (value) => {
        setSelectedDay(value);
        getDisabledBlocks(value);
    }

    let checkIsSelectedDayBlocked = () => {
        disabledDates.find(disabledDate => isSameDay(disabledDate, selectedDay))
            ? setIsSelectedDayBlocked(true)
            : setIsSelectedDayBlocked(false);
    }

    useEffect(() => {

        checkIsSelectedDayBlocked();

        if(selectedDay !== null) {
            getBookings(selectedDay);
            getDisabledBlocks(selectedDay);
        }

    }, [selectedDay]);

    useEffect(() => {
        getDisabledDates();
    }, []);
    
    useEffect(() => {
        console.log("Loading: ", loading);
    }, [loading]);

    useEffect(() => {
        console.log("Disabled blocks: ", disabledBlocks);
        setBlocks(getBlocksInfo(disabledBlocks));
    }, [disabledBlocks]);
    
    useEffect(() => {
        console.log("Bookings: ", bookings);
    }, [bookings]);
    
    useEffect(() => {
        console.log("isSelectedDayBlocked: ", isSelectedDayBlocked);
    }, [isSelectedDayBlocked]);

    return (
        !loading && <div className='admin__container'>
            <p className='section__title'>Perfil de Administrador</p>

            <Calendar 
                value={selectedDay}
                name="calendar"
                onChange={handleCalendarChange}
            />
            
            <p className='subsection__title'>{formatInTimeZone(selectedDay, 'America/Santiago', 'yyyy-MM-dd')}</p>

            {isSelectedDayBlocked
                ? <button className='active btn mg_bt_2' onClick={deleteDisabledDate}>Desbloquear día</button>
                : <button className='disable btn mg_bt_2' onClick={createDisabledDate}>Bloquear día</button>
            }
            
            <UncontrolledAccordion
                defaultOpen={[
                    '0',
                    '1',
                    '2',
                    '3'
                ]}
                stayOpen
            >

                {blocks.map((block, index) => {

                    let booking_data = bookings.filter(booking => booking.block === block.block);
                    booking_data = booking_data ? booking_data[0] : [];
                    console.log("Block active: ", block.active);

                    return (
                        <AccordionBlockItem 
                            block={block.block} 
                            index={index} 
                            booking={booking_data} 
                            active={block.active}
                            getDisabledBlocks={getDisabledBlocks}
                            selectedDay={selectedDay}
                            getBookings={getBookings}
                            key={index} 
                        />
                    );
                    
                })}

            </UncontrolledAccordion>
        </div>
    );
}

export default AdminPage