function validateInfoBooking(values) {
    let errors = {}

    if(!values.booking_date) {
        errors.booking_date = "Este campo es obligatorio"
    }

    if(values.block === "") {
        errors.block = "Este campo es obligatorio"
    }

    if(values.visitants === 0) {
        errors.visitants = "Este campo es obligatorio"
    }
    else if(values.visitants > 50) {
        errors.visitants = "Debido al distanciamiento social no se pueden realizar reservas de más de 50 personas"
    }

    return errors
}

export default validateInfoBooking