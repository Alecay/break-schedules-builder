
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
    else
    {
        var hour = parseFloat(timeString.substring(0, 2));
        var mintues = parseFloat(timeString.substring(3, 5)) / 60.0;
        
        return hour + mintues;
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
        if(hours < 24)
        {
            isAM = false;  
        }

        hours %= 12;
        if(hours == 0)      
        {
            hours = 12;
        }
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

function timeDifference(time1, time2)
{
    var diff = (timeToHourValue(time1) - timeToHourValue(time2));

    if(diff < 0)
    {
        diff = (24.0 - timeToHourValue(time2)) + timeToHourValue(time1);
    }

    return diff;
}

function shiftTime(time, hours)
{
    var hourVal = timeToHourValue(time);
    hourVal += hours;

    return hourValueToTime(hourVal);
}

function getTodayDate()
{
    const dt = new Date();

    const month = String(dt.getMonth() + 1).padStart(2, "0");    
    const day = String(dt.getDate()).padStart(2, "0");  
    const year = String(dt.getFullYear()).slice(2, 4).padStart(2, "0"); 
    const str = "".concat(month, "/", day, "/", year);

    return str;
}

function convertToFormattedTime(inputStr)
{
    var timeStr = "";
    var parts = inputStr.split(":");



    if(parts.length == 1)
    {
        var num = parseInt(parts[0]);

        if(isNaN(num))
        {
            return "invalid";
        }

        if(num > 12)
        {
            if(num > 99 && num < 1260)
            {
                var numStr = String(num).padStart(4, "0");
                var num1 = parseInt(numStr.slice(0,2));
                var num2 = parseInt(numStr.slice(2,4));

                if(isNaN(num1) || isNaN(num2))
                {
                    return "invalid";
                }        

                if(num1 > 12)
                {
                    num1 = 12;
                }

                if(num1 < 1)
                {
                    num1 = 1;
                }

                if(num2 > 60)
                {
                    num2 = 59;
                }

                if(num2 < 0)
                {
                    num2 = 0;
                }

                const isMorning = parts[0].includes("am") || parts[0].includes("AM") || parts[0].includes("Am") || parts[0].includes("aM") || parts[0].includes("a");

                if(isMorning)
                {
                    return String(num1).padStart(2, "0").concat(":", String(num2).padStart(2, "0"), " AM");
                }
                else
                {
                    return String(num1).padStart(2, "0").concat(":", String(num2).padStart(2, "0"), " PM");
                }
            }

            num = 12;
        }

        if(num < 1)
        {
            num = 1;
        }

        const isMorning = parts[0].includes("am") || parts[0].includes("AM") || parts[0].includes("Am") || parts[0].includes("aM") || parts[0].includes("a");

        if(isMorning)
        {
            return String(num).padStart(2, "0").concat(":00 AM");
        }
        else
        {
            return String(num).padStart(2, "0").concat(":00 PM");
        }
    }
    else if(parts.length == 2)
    {
        var num1 = parseInt(parts[0]);
        var num2 = parseInt(parts[1]);

        if(isNaN(num1) || isNaN(num2))
        {
            return "invalid";
        }        

        if(num1 > 12)
        {
            num1 = 12;
        }

        if(num1 < 1)
        {
            num1 = 1;
        }

        if(num2 > 60)
        {
            num2 = 59;
        }

        if(num2 < 0)
        {
            num2 = 0;
        }

        const isMorning = parts[1].includes("am") || parts[1].includes("AM") || parts[1].includes("Am") || parts[1].includes("aM") || parts[1].includes("a");

        if(isMorning)
        {
            return String(num1).padStart(2, "0").concat(":", String(num2).padStart(2, "0"), " AM");
        }
        else
        {
            return String(num1).padStart(2, "0").concat(":", String(num2).padStart(2, "0"), " PM");
        }
    }
    else
    {
        timeStr = "invalid";
    }

    console.log("output", timeStr);

    return timeStr;
}

function convertToFormattedTimeRange(inputStr)
{
    var parts = inputStr.split("-");

    if(parts.length != 2)
    {
        return "invalid";
    }

    const leftConverted = convertToFormattedTime(parts[0]);
    const rightConverted = convertToFormattedTime(parts[1]);

    if(leftConverted ==  "invalid" || rightConverted ==  "invalid")
    {
        return  "invalid";
    }

    return leftConverted.concat(" - ", rightConverted);
}

function getCurrentTime(includeHour = true, inludeMinutes = true, includeSeconds = false, includeMeridian = true, use24HourFormat = false)
{
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    var meridian = h >= 12 ? "PM" : "AM";

    if(!use24HourFormat)
    {
        h = h % 12;
        h = h ? h : 12;
    }

    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    var time = String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0") + " " + meridian;

    const hStr = String(h).padStart(2, "0");
    const mStr = String(m).padStart(2, "0");
    const sStr = String(s).padStart(2, "0");

    var time = (includeHour ? hStr + ":" : "") + (inludeMinutes ? mStr + (includeSeconds ? ":" : "") : "") + (includeSeconds ? sStr : "") + (includeMeridian ? " " + meridian : "");

    return time;
}