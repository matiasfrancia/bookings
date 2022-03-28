import { useState, useEffect } from "react";

const useFormBooking = (callback, validate) => {

    const [values, setValues] = useState({
        booking_date: new Date(),
        visitants: 0,
        block: 0,
        price: 100000
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableBlocks, setAvailableBlocks] = useState({});

    useEffect(() => {
        console.log("Available blocks");
        console.log(availableBlocks);
    }, [availableBlocks]);

    useEffect(() => {
        getDisabledBlocks(new Date());
    }, []);

    function getAvailableBlocks(disabledBlocks) {
        var blocks = {1: "8:00-9:50", 2: "10:00-11:50", 3: "12:00-13:50", 4: "16:00-17:50"}

        for(var i = 1; i < Object.keys(blocks).length + 1; i++) {
            if(disabledBlocks.some(e => e.block === i)) {
                delete blocks[i];
            }
        }

        setAvailableBlocks(blocks);
    }

    const getDisabledBlocks = async (day) => {

        try {
  
          let res = await fetch("http://localhost:8000/api/disabled-blocks/" + day.toISOString().split('T')[0], {
            method: "GET",
            headers: {"Content-Type": "application/json"},
          }).then(response => response.json())
          .then(response => getAvailableBlocks(response))
          .catch(error => console.log(error));
          
        } catch (err) {
          console.log(err);
        }
    }

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
        getDisabledBlocks(value);
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

    return {handleChange, handleCalendarChange, values, handleSubmit, errors, availableBlocks};
};

export default useFormBooking;