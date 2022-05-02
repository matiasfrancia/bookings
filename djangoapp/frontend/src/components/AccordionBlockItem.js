import React from 'react';
import { AccordionBody, AccordionHeader, AccordionItem, Table } from 'reactstrap';
import { formatInTimeZone } from 'date-fns-tz';

function AccordionBlockItem({block, index, booking, active, getDisabledBlocks, selectedDay, getBookings}) {

    console.log("Booking in accordion: ", active);
    let formatter = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
    });

    async function createDisabledBlock() {

        let bodyDict = {
            "day": formatInTimeZone(selectedDay, 'America/Santiago', 'yyyy-MM-dd'),
            "block": block,
        }

        await fetch("http://localhost:8000/api/create-block/", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(bodyDict),
        }).then(response => {

            if(response.status !== 201 && response.status !== 400) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            getDisabledBlocks(selectedDay);

            return response.json();
        })
        .then(json => {
            console.log(json);
            if(json["error_msg"] !== null && json["error_msg"] !== undefined) {
                let error = json["error_msg"];
                alert("No se pudo deshabilitar el bloque:\n" + error);
            }
        })
        .catch(function (e) {
            console.error("Ha ocurrido un error al deshabilitar el bloque: ", e);
        });
    }

    async function deleteDisabledBlock() {

        await fetch("http://localhost:8000/api/blocks/delete/?day="
            + formatInTimeZone(selectedDay, 'America/Santiago', 'yyyy-MM-dd') + "&block=" + block, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
        }).then(response => {

            if(response.status !== 202 && response.status !== 401) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            getDisabledBlocks(selectedDay);

            return response.json();
        })
        .then(json => {
            console.log("Json delete block: ", json);
            if(json !== undefined && json["error_msg"] !== null && json["error_msg"] !== undefined) {
                let error = json["error_msg"];
                alert("No se pudo habilitar el bloque:\n" + error);
            }
        })
        .catch(function (e) {
            console.error("Ha ocurrido un error al habilitar el bloque: ", e);
        });
    }

    async function deleteBooking() {

        await fetch("http://localhost:8000/api/bookings/delete/?day="
            + formatInTimeZone(selectedDay, 'America/Santiago', 'yyyy-MM-dd') + "&block=" + block, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
        }).then(response => {

            if(response.status !== 202) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            getDisabledBlocks(selectedDay);
            getBookings(selectedDay);

            return response.json();
        })
        .then(json => {
            console.log("Json delete booking: ", json);
            if(json !== undefined && json["error_msg"] !== null && json["error_msg"] !== undefined) {
                let error = json["error_msg"];
                alert("No se pudo eliminar la reserva:\n" + error);
            }
        })
        .catch(function (e) {
            console.error("Ha ocurrido un error al eliminar la reserva: ", e);
        });
    }

    let handleBookingDelete = () => {
        if (confirm("¿Está seguro que desea eliminar la reserva? Esta acción no se puede deshacer, " +
            "si aún así desea hacerlo asegúrese de informarle al cliente")) {
            deleteBooking();
            console.log("Se eliminó la reserva");

          } else {
            console.log("No se eliminó la reserva");
          }
    }    

    return (
        <AccordionItem key={index}>
            <AccordionHeader targetId={index.toString()}>
                {block}
            </AccordionHeader>
            <AccordionBody accordionId={index.toString()}>

                {booking !== undefined ?
                <div>
                <p className='subsection__title'>Datos de la Reserva</p>
                <Table
                    bordered
                    hover
                    responsive
                    size=""
                >
                <tbody>
                    <tr>
                        <td>Código de la reserva</td>
                        <td>{booking.code}</td>
                    </tr>
                    <tr>
                        <td>Fecha de creación reserva</td>
                        <td>{formatInTimeZone(booking.creation_date, 'America/Santiago', 'yyyy-MM-dd HH:mm:ss')}</td>
                    </tr>
                    <tr>
                        <td>Nombre y apellido</td>
                        <td>{booking.name} {booking.lastname}</td>
                    </tr>
                    <tr>
                        <td>Celular</td>
                        <td>{booking.cellphone}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>{booking.email}</td>
                    </tr>
                    <tr>
                        <td>Tipo de documento</td>
                        <td>{booking.document_type}</td>
                    </tr>
                    <tr>
                        <td>Número de documento</td>
                        <td>{booking.document_number}</td>
                    </tr>
                    <tr>
                        <td>Tipo de grupo</td>
                        <td>{booking.group}</td>
                    </tr>
                    {booking.group == 'Estudiantes' && <tr>
                        <td>Escuela</td>
                        <td>{booking.school}</td>
                    </tr>}
                    <tr>
                        <td>Cantidad de visitantes</td>
                        <td>{booking.visitants}</td>
                    </tr>
                    <tr>
                        <td>Precio total</td>
                        <td>{formatter.format(booking.price)}</td>
                    </tr>
                </tbody>
                </Table>
                </div>
                : (active
                    ? 'El bloque se encuentra disponible'
                    : 'El bloque se encuentra bloqueado')}

                {/* TODO: dejar funcional el botón de crear reserva */}

                {!booking ? <div className='mg_tp_1'>

                    {active
                    ? <>
                        <p>Crear reserva</p>
                        <button className='create btn mg_bt_2'><i className={'fas fa-plus'} /></button>
                        <p>Deshabilitar bloque:</p>
                        <button className='disable btn mg_bt_2' onClick={createDisabledBlock}><i className={'fas fa-lock'} /></button>
                    </>
                    : <>
                        <p>Habilitar bloque:</p>
                        <button className='active btn mg_bt_2' onClick={deleteDisabledBlock}><i className={'fas fa-unlock'} /></button>
                    </>}

                </div>
            : <>
                <p>Eliminar reserva</p>
                <button className='disable btn mg_bt_2' onClick={handleBookingDelete}><i className={'fas fa-trash'} /></button>
            </>}

            </AccordionBody>
        </AccordionItem>
    )
}

export default AccordionBlockItem