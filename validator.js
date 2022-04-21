const {ObjectId} = require('mongodb');
const emailValidator = require('email-validator');

function checkId(id){
    if(!id) throw "Error: must provide ID";
    if(typeof id !== "string") throw "Error: invalid ID type";
    id = id.trim();
    if(id.length ===0) throw "Error: empty ID provided";
    if (!ObjectId.isValid(id)) throw "Error: invalid Object ID";
    return id;
}

function checkString(strVal) {
    if (!strVal) throw "Error: You must supply a string";
    if (typeof strVal !== 'string') throw "Error: input must be a string!";
    strVal = strVal.trim();
    if (strVal.length === 0)
        throw "Error: input cannot be an empty string or string with just spaces";
    return strVal;
}

function checkStringArray(arr) {
    //We will allow an empty array for this,
    //if it's not empty, we will make sure all tags are strings
    let arrayInvalidFlag = false;
    if (!arr || !Array.isArray(arr))
        throw "You must provide an array of strings";
    for (i in arr) {
        if (typeof arr[i] !== 'string' || arr[i].trim().length === 0) {
            arrayInvalidFlag = true;
            break;
        }
        arr[i] = arr[i].trim();
    }
    if (arrayInvalidFlag)
        throw "One or more elements in array is not a string or is an empty string";
    return arr;
}

function checkEmail(addr){
    if(!emailValidator.validate(addr)) throw "Error: Invalid email address";
}




module.exports = {
    checkId,
    checkString,
    checkStringArray,
    checkEmail
}