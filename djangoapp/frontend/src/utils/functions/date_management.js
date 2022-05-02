
import { differenceInCalendarDays } from 'date-fns'

export function isSameDay(a, b) {
    if(differenceInCalendarDays(a, b) === 0) {
    }
    return differenceInCalendarDays(a, b) === 0;
}

export function convertStringstoDates(strDates) {
    return strDates.map(strDate => {
        let [year, month, day] = strDate.day.split('-');
        return new Date(year, month-1, day);
    });
}