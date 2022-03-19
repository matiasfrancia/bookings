import { useState, useEffect } from "react";

const useFormBooking = (callback, validate) => {

    const [values, setValues] = useState({
        booking_date: new Date(),
        visitants: 0,
        block: 0,
        price: 100000,
        buyer: 1
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = e => {
        const {name, value} = e.target
        setValues({
            ...values,
            [name]: parseInt(value)
        })
    };
    
    function handleCalendarChange(value) {
        console.log("Cambio en calendar: " + value);
        setValues({
            ...values,
            ["booking_date"]: value
        });
    }

    const handleSubmit = e => {
        e.preventDefault();

        setErrors(validate(values));
        setIsSubmitting(true);
    };

    useEffect(() => {
        console.log(values);
        if(Object.keys(errors).length === 0 && isSubmitting) {
            callback(values);
        }
    }, [errors]);

    return {handleChange, handleCalendarChange, values, handleSubmit, errors};
};

export default useFormBooking;