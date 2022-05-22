
import { differenceInCalendarDays } from 'date-fns'

export function isSameDay(a, b) {
    return differenceInCalendarDays(a, b) === 0;
}

export function convertStringstoDates(strDates) {
    return strDates.map(strDate => {
        let [year, month, day] = strDate.day.split('-');
        return new Date(year, month-1, day);
    });
}

export function getBlocksInfo(disabledBlocks) {

    let blocks = [{"block": "8:00-9:50", "active": true}, {"block": "10:00-11:50", "active": true}, 
    {"block": "12:00-13:50", "active": true}, {"block": "16:00-17:50", "active": true}];

    let auxList = disabledBlocks.map(disabledBlock => disabledBlock.block);

    for(let i = 0; i < blocks.length; i++) {
        if(auxList.includes(blocks[i].block)) {
            blocks[i].active = false;
        }
    }

    return blocks;
}

export function getBlocksForSelect(disabledBlocks) {

    let blocks = [
        { value: '8:00-9:50', label: '8:00-9:50' }, 
        { value: '10:00-11:50', label: '10:00-11:50' }, 
        { value: '12:00-13:50', label: '12:00-13:50' }, 
        { value: '16:00-17:50', label: '16:00-17:50' }
    ];

    if(disabledBlocks === null || disabledBlocks === undefined) return blocks;

    let auxList = disabledBlocks.map(disabledBlock => disabledBlock.block);

    for(let i = blocks.length-1; i >= 0; i--) {
        if(auxList.includes(blocks[i].value)) {
            console.log();
            blocks.splice(i, 1);
        }
    }

    return blocks;
}