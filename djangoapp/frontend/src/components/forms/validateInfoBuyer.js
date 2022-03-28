
function validateInfoBuyer(values) {
    let errors = {}

    if(!values.name.trim()) {
        errors.name = "Este campo es obligatorio"
    }

    if(!values.email) {
        errors.email = "Este campo es obligatorio"
    }
    else if(!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "El email ingresado es inválido"
    }

    if(!values.rut) {
        errors.rut = "Este campo es obligatorio"
    }

    return errors
}

export default validateInfoBuyer