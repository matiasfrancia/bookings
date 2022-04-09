function validateInfoBooking(values) {
    let errors = {}

    if(!values.booking_date) {
        errors.booking_date = "Este campo es obligatorio"
    }

    if(values.block === "") {
        errors.block = "Este campo es obligatorio"
    }

    if(values.group == "general" && values.visitants < 10) {
        errors.visitants = "La cantidad mínima de visitantes para un tipo de grupo 'general' es de 10"
    }
    else if(values.group == "estudiante" && values.visitants < 20) {
        errors.visitants = "La cantidad mínima de visitantes para un tipo de grupo 'estudiante' es de 20"
    }
    if(values.visitants > 50) {
        errors.visitants = "Debido al distanciamiento social no se pueden realizar reservas de más de 50 personas"
    }

    return errors
}

export default validateInfoBooking