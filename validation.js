const moment = require('moment');

module.exports = {
    checkId(id, varName) {
        if (!id) throw `Error: You must provide a ${varName}`;
        if (typeof id !== 'string') throw `Error:${varName} must be a string`;
        id = id.trim();
        if (id.length === 0)
          throw `Error: ${varName} cannot be an empty string or just spaces`;
        if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
        return id;
    },
    

    checkString(strVal, varName) {
        if (!strVal) throw `Error: You must supply a ${varName}!`;
        if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
        strVal = strVal.trim();
        if (strVal.length === 0)
        throw `Error: ${varName} cannot be an empty string or string with just spaces.`;
        if (!isNaN(strVal))
        throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits.`;
        return strVal;
    },

    checkStringArray(arr, varName, len) {
        let arrayInvalidFlag = false;
        if (!arr || !Array.isArray(arr))
          throw `You must provide an array of ${varName}`;
        if (arr.length < len) throw `You must supply at least ${len} element(s) in ${varName} array`;
        for (i in arr) {
          if (typeof arr[i] !== 'string' || arr[i].trim().length === 0) {
            arrayInvalidFlag = true;
            break;
          }
          arr[i] = arr[i].trim();
        }
        if (arrayInvalidFlag)
          throw `One or more elements in ${varName} array is not a string or is an empty string`;
        return arr;
    },

    checkDate(date, varName) {
        date = this.checkString(date, varName);
        if (!moment(date).isValid()) throw `Must ${varName} be a valid date string`;
        let temp = new Date(date);
        if (temp.getFullYear() < '1900' || temp.getFullYear() > '2025') {
            throw `${varName} must be a date between 1900 and 2025.`;
        }
        return date;
    },

    checkTime(time, varName) {
        time = this.checkString(time, varName);
        let timeReg = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
        if (!time.match(timeReg)) throw `${varName} must be a valid time.`;
        return time;
    }
}