
function validateInfoBuyer(values) {
    let errors = {}

    if(!values.name.trim()) {
        errors.name = "Este campo es obligatorio"
    }
    
    if(!values.lastname.trim()) {
        errors.lastname = "Este campo es obligatorio"
    }
    
    if(!values.documentType) {
        errors.documentType = "Este campo es obligatorio"
    }

    if(!values.documentNumber) {
        errors.documentNumber = "Este campo es obligatorio"
    }
    
    if(!values.email) {
        errors.email = "Este campo es obligatorio"
    }
    else if(!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "El email ingresado es inválido"
    }

    return errors
}

export default validateInfoBuyer