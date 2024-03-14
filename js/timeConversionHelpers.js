
function getFormattedDate(date)
{
    if(date === undefined)
    {
        console.log("Date is undefined");
        return "Sunday 1/1";
    }

    var dt = new Date(date);
    var dayStrings = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return dayStrings[dt.getDay()].concat(" ", dt.getMonth() + 1, "/", dt.getDate());
}

function timeToHourValue(time)
{
    var timeString = String(time);

    if(timeString.endsWith("AM"))
    {
        var hour = parseFloat(timeString.substring(0, 2));
        var mintues = parseFloat(timeString.substring(3, 5)) / 60.0;

        if(hour == 12)
        {
            return mintues;
        }

        return hour + mintues;
    }
    else if(timeString.endsWith("PM"))
    {
        var hour = parseFloat(timeString.substring(0, 2));
        var mintues = parseFloat(timeString.substring(3, 5)) / 60.0;

        if(hour == 12)
        {
            return hour + mintues;
        }

        return hour + mintues + 12.0;
    }

    return -1.0;
}

function hourValueToTime(hourValue)
{    
    var hours = Math.floor(hourValue);    
    var minutes = Math.floor((hourValue - hours) * 60);

    var isAM = true;

    if(hours > 12)
    {
        hours -= 12;
        isAM = false;        
    }

    if(hours == 12)
    {
        isAM = false;
    }
    
    var hoursStr = hours.toString().padStart(2, '0');
    var minutesStr = minutes.toString().padStart(2, '0');

    if(minutesStr == "49")
    {
        minutesStr = "50";
    }

    if(isAM)
        return hoursStr.concat(":",minutesStr, " AM");
    else
        return hoursStr.concat(":",minutesStr, " PM");
}

function shiftTime(time, hours)
{
    var hourVal = timeToHourValue(time);
    hourVal += hours;

    return hourValueToTime(hourVal);
}