function validateInfoBooking(values) {
    let errors = {}

    if(!values.booking_date) {
        errors.booking_date = "Este campo es obligatorio"
    }

    if(values.block === 0) {
        errors.block = "Este campo es obligatorio"
    }

    if(values.visitants === 0) {
        errors.visitants = "Este campo es obligatorio"
    }

    return errors
}

export default validateInfoBooking