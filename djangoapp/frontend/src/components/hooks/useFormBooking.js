import { useState, useEffect } from "react";

const useFormBooking = (callback, validate) => {

    const [values, setValues] = useState({
        booking_date: new Date(),
        visitants: 0,
        block: "",
        group: "",
        school: '',
        price: 100000
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableBlocks, setAvailableBlocks] = useState([]);
    const [disabledBlocks, setDisabledBlocks] = useState([]);

    useEffect(() => {
        getAvailableBlocks();
    }, [disabledBlocks]);

    useEffect(() => {
        getDisabledBlocks(new Date());
    }, []);

    function getAvailableBlocks() {
        const blocks = ["8:00-9:50", "10:00-11:50", "12:00-13:50", "16:00-17:50"];

        var auxList1 = Object.values(blocks);
        var auxList2 = disabledBlocks.map(disabledBlock => disabledBlock.block);
        var res = auxList1.filter(block => !auxList2.includes(block));

        setAvailableBlocks(res);
    }

    const getDisabledBlocks = async (day) => {

        try {
  
          let res = await fetch("http://localhost:8000/api/disabled-blocks?day=" + day.toISOString().split('T')[0], {
            method: "GET",
            headers: {"Content-Type": "application/json"},
          }).then(response => {
              return response.status !== 404 ? response.json() : []
            })
          .then(response => setDisabledBlocks(response))
          .catch(error => console.log(error));
          
        } catch (err) {
          console.log(err);
        }
    }

    const handleChange = e => {
        const {name, value} = e.target
        console.log(name + ": " + value);
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
    
    function handleBlockChange(value) {
        console.log("Cambio en block: " + value);
        setValues({
            ...values,
            ["block"]: value
        });
    }
    
    function handleGroupChange(value) {
        console.log("Cambio en group: " + value);
        setValues({
            ...values,
            ["group"]: value
        });
    }
    
    function handleSchoolChange(value) {
        console.log("Cambio en school: " + value);
        setValues({
            ...values,
            ["school"]: value
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

    return {handleChange, handleCalendarChange, handleBlockChange, handleGroupChange, handleSchoolChange, values, handleSubmit, errors, availableBlocks};
};

export default useFormBooking;