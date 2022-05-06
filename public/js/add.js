const form = document.getElementById("eventadder");

form.addEventListener("submit", (e) => {
    const formData = new FormData(form);
    let entries = formData.entries();
    let entry;
    let data = [];

    for(let i=0; i<5; i++){
        entry = entries.next().value;
        data.push(entry[1]);
    }
    data.push(document.getElementById("tags").value);
    
    try{
        data[0] = checkString(data[0], "Name");
        data[2] = checkTime(data[2], "Time");
        data[1] = checkDate(data[1], data[2], "Date");
        data[3] = checkString(data[3], "Location");
        data[4] = checkString(data[4], "Description");
        data[5] = formatTags(data[5], "Tags");
        data[5] = checkStringArray(data[5], "Tags");
    }catch (emsg){
        var err = document.getElementById('add-err');
        if(!err) {
            e.preventDefault();
        }else{
            err.innerHTML = emsg;
            e.preventDefault();
        }
    }

});


function checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
    throw `Error: ${varName} cannot be an empty string or string with just spaces.`;
    return strVal;
}

function formatTags(tags, varName){
  if(!tags) throw `Error: Must supply ${varName}`;
  if (tags.length == 1) throw `Error: Must supply ${varName}`;
  tags = tags.substr(1);
  tags = this.checkString(tags, varName);
  tags = tags.trim();
  splitReg = /\s*,\s*/;
  tags = tags.split(splitReg);
  if (!Array.isArray(tags)) tags = [tags];
  return tags;
}

function checkStringArray(arr, varName, len) {
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
}

function checkDate(date, time, varName) {
    date = this.checkString(date, varName);
    let temp = new Date(date + ' ' + time);
    if (!temp) throw `Error: Must ${varName} be a valid date string`;
    let current = new Date();
    if (temp.getTime() < current.getTime()) throw `Error: ${varName} must be a time in the future`
    return date;
}

function checkTime(time, varName) {
    time = this.checkString(time, varName);
    let timeReg = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    if (!time.match(timeReg)) throw `${varName} must be a valid time.`;
    return time;
}