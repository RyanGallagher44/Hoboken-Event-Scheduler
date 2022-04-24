//Modified from https://github.com/lashaNoz/Calendar

(function ($) {

    const date = new Date();

    const renderCalendar = () => {
      date.setDate(1);
    
      const monthDays = document.querySelector(".days");
    
      const lastDay = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
      ).getDate();
    
      const prevLastDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        0
      ).getDate();
    
      const firstDayIndex = date.getDay();
    
      const lastDayIndex = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
      ).getDay();
    
      const nextDays = 7 - lastDayIndex - 1;
    
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
    
      document.querySelector(".date h1").innerHTML = `${months[date.getMonth()]} ${date.getFullYear()}`;
    
      document.querySelector(".date p").innerHTML = `Today: ${new Date().toDateString()}`;
    
      let days = "";
    
      for (let x = firstDayIndex; x > 0; x--) {
        days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
      }
    
      //Get the events the user is registered for as an array of event IDs
      all_events = [1, 2, 29, 7];
      //var element = document.getElementById('calendar_data');
      //console.log(JSON.parse(element.dataset.config));
      var element_names = $('#calendar_data_names').data('config');
      let names = element_names.substring(element_names.indexOf(":")+1, element_names.length-1).split(",");
      var element_dates = $('#calendar_data_dates').data('config');
      let dates = element_dates.substring(element_dates.indexOf(":")+1, element_dates.length-1).split(",");
      
      console.log(names);
      console.log(dates);

      all_events = [];
      for (let i = 0; i < dates.length; i++) {
          let temp = {
              name: names[i].trim(),
              date: dates[i].trim()
          };
          all_events.push(temp);
      }
      console.log(all_events)
    
      for (let i = 1; i <= lastDay; i++) { //days of the current month
        if (i === new Date().getDate() && date.getMonth() === new Date().getMonth()) { //If it is the current day
          days += `<div class="today">${i}<br>`; //start the html element
        }
        else {
          days += `<div>${i}<br>`; //start the html element
        }
        //Now, add the events for the specific day
        for (let j = 0; j < all_events.length; j++) { //Loop over each events
            console.log(j)
            curr_event = all_events[j];
            let event_month = Number(curr_event.date.split('/')[0]);
            let event_day = Number(curr_event.date.split('/')[1]);
            if (Number(date.getMonth())+1 === event_month && event_day === i){ //If the date of the event is the date we are at in the calendar right now
            //if(all_events[j] === i) {
                days += curr_event.name;
            }
        }
        days += '</div>'
      }
    
      for (let j = 1; j <= nextDays; j++) {
        days += `<div class="next-date">${j}</div>`;
      }
      monthDays.innerHTML = days;
    
    
    };
    
    document.querySelector(".prev").addEventListener("click", () => {
      date.setMonth(date.getMonth() - 1);
      renderCalendar();
    });
    
    document.querySelector(".next").addEventListener("click", () => {
      date.setMonth(date.getMonth() + 1);
      renderCalendar();
    });
    
    renderCalendar();



})(window.jQuery);

