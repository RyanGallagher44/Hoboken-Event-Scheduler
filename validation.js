const moment = require('moment');
const { ObjectId } = require('mongodb'); //need this for ObjectID
const emailValidator = require('email-validator');

module.exports = {
    checkId(id, varName) {
        if (!id) throw `Error: You must provide a ${varName}`;
        if (typeof id !== 'string') throw `Error: ${varName} must be a string`;
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
        return strVal;
    },

    formatTags(tags, varName){
      if(!tags) throw `Error: Must supply ${varName}`;
      if (tags.length == 1) throw `Error: Must supply ${varName}`;
      tags = tags.substr(1);
      tags = this.checkString(tags, varName);
      tags = tags.trim();
      splitReg = /\s*,\s*/;
      tags = tags.split(splitReg);
      if (!Array.isArray(tags)) tags = [tags];
      return tags;
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
          arr[i] = arr[i].trim().toLocaleLowerCase();
          arr[i] = this.checkString(arr[i], 'tag');
        }
        if (arrayInvalidFlag)
          throw `One or more elements in ${varName} array is not a string or is an empty string`;
        return arr;
    },

    checkDate(date, time, varName) {
        date = this.checkString(date, varName);
        if (!moment(date).isValid()) throw `Error: Must ${varName} be a valid date string`;
        let temp = new Date(date + ' ' + time);
        let current = new Date();
        if (temp.getTime() < current.getTime()) throw `Error: ${varName} must be a time in the future`
        return date;
    },

    checkTime(time, varName) {
        time = this.checkString(time, varName);
        let timeReg = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
        if (!time.match(timeReg)) throw `${varName} must be a valid time.`;
        return time;
    },

    checkEmail(addr){
      addr = this.checkString(addr, "Email");
      if(!emailValidator.validate(addr)) throw "You must supply a valid email address.";
  
      return addr;
    },

    checkPassword(pwd) {
      if (!pwd) throw 'You must supply a password!';
  
      return pwd;
    },
  
    checkConfirmPassword(pwd) {
      if (!pwd) throw 'You must confirm your password!';
  
      return pwd;
    }
}