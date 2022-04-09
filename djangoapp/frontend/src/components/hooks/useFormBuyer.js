import { useState, useEffect } from "react";

const useFormBuyer = (callback, validate) => {

    const [values, setValues] = useState({
        name: '',
        lastname: '',
        email: '',
        cellphone: '',
        documentType: '',
        documentNumber: ''
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = e => {
        const {name, value} = e.target
        console.log(name + ": " + value)
        setValues({
            ...values,
            [name]: value
        })
    };

    const handleSubmit = e => {
        e.preventDefault();

        setErrors(validate(values));
        setIsSubmitting(true);
    };

    useEffect(() => {
        if(Object.keys(errors).length === 0 && isSubmitting) {
            callback(values);
        }
    }, [errors]);

    return {handleChange, values, handleSubmit, errors};
};

export default useFormBuyer;