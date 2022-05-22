import React from 'react';
import { validate as validateRut } from 'rut.js';
    
export function validationsBooking (disabledDates, groupsSelect, blocks, getValues) {

    let validations = {
        "booking_date": {
            required: v => v !== null && v !== undefined && v !== '' || (
                <p>Este campo es obligatorio</p>
            ),
            available: v => !disabledDates.includes(v) || (
                <p>El día seleccionado no se encuentra disponible</p>
            ),
        },

        "block": {
            required: v => v !== null && v !== undefined && v !== '' || (
                <p>Este campo es obligatorio</p>
            ),
            available: v => blocks.includes(v) || (
                <p>El bloque seleccionado no se encuentra disponible</p>
            ),
        },

        "visitants": {
            required: v => v !== null && v !== undefined && v !== '' || (
                <p>Este campo es obligatorio</p>
            ),
            interval: v => {
                if(getValues('group').value === "estudiante" && (parseInt(v) < 20 || parseInt(v) > 50)) { 
                    return <p>El número de visitantes para un grupo de tipo 
                        estudiante debe ser de al menos 20 y máximo 50</p>;
                }
                else if(getValues('group').value === "general" && (parseInt(v) < 10 || parseInt(v) > 50)) {
                    return <p>El número de visitantes para un grupo de tipo 
                        general debe ser de al menos 10 y máximo 50</p>;
                }
                return true;
            }
        },

        "group": {
            required: v => v !== null && v !== undefined && v !== '' || (
                <p>Este campo es obligatorio</p>
            ),
            checkOptions: v => groupsSelect.map(group => group.value).includes(v.value) || (
                <p>El día seleccionado no se encuentra disponible</p>
            ),
        },

        "school": {
            required: v => {
                if(getValues('group').value === 'estudiante' && (v === null || v === undefined || v === '')) {
                    return <p>Dado que es un grupo de estudiantes, este campo es obligatorio</p>;
                }
                return true;
            }
        }
    }

    return validations;
};

export function validationsBuyer (getValues) {

    let validations = {
        "name": {
            required: v => v !== null && v !== undefined && v !== '' || (
                <p>Este campo es obligatorio</p>
            ),
        },

        "lastname": {
            required: v => v !== null && v !== undefined && v !== '' || (
                <p>Este campo es obligatorio</p>
            ),
        },

        "email": {
            required: v => v !== null && v !== undefined && v !== '' || (
                <p>Este campo es obligatorio</p>
            ),
            validEmail: v => {
                if(!/\S+@\S+\.\S+/.test(v)) {
                    return <p>El email es inválido</p>;
                }
                return true;
            }
        },

        "documentType": {
            required: v => v !== null && v !== undefined && v !== '' || (
                <p>Este campo es obligatorio</p>
            ),
            valid: v => {
                if(!["rut", "pasaporte"].includes(v)) {
                    return <p>El tipo de documento es inválido</p>;
                }
                return true;
            }
        },

        // TODO: validar número de pasaporte según país

        "documentNumber": {
            required: v => v !== null && v !== undefined && v !== '' || (
                <p>Este campo es obligatorio</p>
            ),
            valid: v => {
                if(getValues("documentType") === "rut" && !validateRut(v)) {
                    return <p>El número del rut no coincide, verifique que está bien escrito</p>
                }
                return true;
            }
        }
    }

    return validations;
};

export function validationsConfirmation () {

    let validations = {
        "confirmation": {
            required: v => v === true || (
                <p>Este campo es obligatorio</p>
            ),
        },

        "webpay": {
            required: v => v !== null && v !== undefined && v !== '' || (
                <p>Este campo es obligatorio</p>
            ),
        },
    }

    return validations;
};