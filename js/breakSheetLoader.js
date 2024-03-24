function createBreakSheets(parent, array, sheetSettings = undefined)
{
    //console.log("Creating sheets");
    var allDates = new Array();
    array.forEach((row) =>
    {        
        if(!allDates.includes(row["date"]))
        {
            allDates.push(row["date"]);
        }
    });
    
    // console.log(sheetSettings);
    //console.log("Creating sheets for dates:", allDates);

    allDates.forEach(date => 
    {
        if(date === null || date === undefined || String(date) == "undefined")
            return;

        createBreakSheet(parent, array, date, sheetSettings);        
    });
}

function createBreakSheet(parent, array, date, sheetSettings = undefined)
{    
    if(sheetSettings == undefined)
    {
        sheetSettings = {};
        sheetSettings["useCommTemplate"] = false;
        sheetSettings["autoFillBreaks"] = true;
        sheetSettings["break1Threshold"] = 4.0;
        sheetSettings["break2Threshold"] = 6.0;
        sheetSettings["break3Threshold"] = 7.0;
        sheetSettings["showTraining"] = true;
        sheetSettings["showClosing"] = true;
        sheetSettings["closingTime"] = "09:45 PM";
        sheetSettings["currentTime"] = "";
        sheetSettings["startTime"] = "12:00 AM";
        sheetSettings["endTime"] = "11:59 PM";

        console.log("Using default sheet settings");
    }

    sheetSettings["autoFillBreaks"] = sheetSettings["autoFillBreaks"] == "true" || sheetSettings["autoFillBreaks"] == true;
    sheetSettings["showTraining"] = sheetSettings["showTraining"] == "true" || sheetSettings["showTraining"] == true;
    sheetSettings["showClosing"] = sheetSettings["showClosing"] == "true" || sheetSettings["showClosing"] == true;

    const sheet = getNewBreakSheet(sheetSettings["useCommTemplate"]);
    
    setChildNodeValue(sheet, "#date", getFormattedDate(date));
    //setChildNodeValue(sheet, "#up-to-date", "Up to date as of: ".concat(array[0]["load"]));

    var filteredArr = getFilteredArray(array, "date", [date]);
    var departments = getUniqueElements(filteredArr, "department");

    var count = 0;
    var closingCount = 0;

    const solidClassName = "solidBackground";   

    filteredArr.forEach((data) =>
    {        
        if(data["date"] != date)
        {
            return;
        }

        const startTime = String(data["schedule"]).substring(0, 8);
        const endTime = String(data["schedule"]).substring(11, 19);

        const startTimeVal = timeToHourValue(startTime);
        const endTimeVal = timeToHourValue(endTime);

        const startRange = timeToHourValue(sheetSettings["startTime"]);
        const endRange = timeToHourValue(sheetSettings["endTime"]);

        if(endTimeVal <= startRange || startTimeVal > endRange)
        {
            return;
        }

        const breakData = getBreakTimes(data["schedule"], data["hours"], 
        sheetSettings["break1Threshold"], sheetSettings["break2Threshold"], sheetSettings["break3Threshold"], 
        sheetSettings["currentTime"]);//getCurrentTime(true, true, false, true, false));

        data["break1"] = breakData["break1"];
        data["break2"] = breakData["break2"];
        data["break3"] = breakData["break3"];
        data["closing"] = timeToHourValue(endTime) >= timeToHourValue(sheetSettings["closingTime"]) ? "c" : "";

        var row = addRowToBreakSheet(sheet);
        setRowValuesFromObject(row, data, sheetSettings["autoFillBreaks"], sheetSettings["showTraining"], sheetSettings["showClosing"]);

        if(data["break1"] == "X" || data["break1"] == "✔")
        {
            setChildNodeClass(row, "#break1", solidClassName);
        }

        if(data["break2"] == "X" || data["break2"] == "✔")
        {
            setChildNodeClass(row, "#break2", solidClassName);
        }

        if(data["break3"] == "X" || data["break3"] == "✔")
        {
            setChildNodeClass(row, "#break3", solidClassName);
        }

        if(departments.indexOf(data["department"]) % 2 == 1)
        {
            setChildNodeClass(row, "#job", solidClassName);
        }

        count++;

        if(data["closing"] != "")
        {
            closingCount++;
        }
    });

    const store = array[0]["store"];

    setChildNodeValue(sheet, "#total-tms", count);
    setChildNodeValue(sheet, "#closing-tms", closingCount);
    setChildNodeValue(sheet, "#store", store);
    
    if(count == 0)
    {
        return;
    }

    parent.appendChild(sheet);
}

function createBreakSheetByArea(parent, array, date, area)
{    
    const sheet = getNewBreakSheet();
    
    setChildNodeValue(sheet, "#date", getFormattedDate(date));
    //setChildNodeValue(sheet, "#up-to-date", "Up to date as of: ".concat(array[0]["LOAD DATE"]));

    var count = 0;
    var closingCount = 0;

    const solidClassName = "solidBackground";  

    array.forEach((data) =>
    {        
        if(data["date"] != date || data["area"] != area)
        {
            return;
        }

        var row = addRowToBreakSheet(sheet);
        setRowValuesFromObject(row, data, autoFillBreaks, showClosing);

        if(data["break1"] == "X")
        {
            setChildNodeClass(row, "#break1", solidClassName);
        }

        if(data["break2"] == "X")
        {
            setChildNodeClass(row, "#break2", solidClassName);
        }

        if(data["break3"] == "X")
        {
            setChildNodeClass(row, "#break3", solidClassName);
        }

        if(data["job"] == "Service")
        {
            setChildNodeClass(row, "#job", solidClassName);
        }

        count++;

        if(data["closing"] != "")
        {
            closingCount++;
        }
    });

    const store = document.getElementById("store-dropdown").value;

    setChildNodeValue(sheet, "#total-tms", count);
    setChildNodeValue(sheet, "#closing-tms", closingCount);
    setChildNodeValue(sheet, "#store", store);
    
    if(count == 0)
    {
        return;
    }

    parent.appendChild(sheet);
}

function getNewBreakSheet(useCommTemplate)
{
    const node = document.getElementById("templates");
    const sheet = node.querySelector(useCommTemplate ? "#breakSheetHolder" : "#breakSheetHolderNoComm").cloneNode(true);    
    const table = sheet.querySelector("#breakTable");    
    
    //Remove header and data row
    table.removeChild(table.firstChild);
    table.removeChild(table.firstChild);

    //Add back header row
    table.appendChild(getNewHeaderRow());

    return sheet;
}

function getNewHeaderRow()
{
    const node = document.getElementById("templates");
    const sheet = node.querySelector("#breakSheetHolder");
    const table = sheet.querySelector("#breakTable");
    const row = table.querySelector("#header-row");

    return row.cloneNode(true);

}

function getNewBreaksRow()
{
    const node = document.getElementById("templates");
    const sheet = node.querySelector("#breakSheetHolder");
    const table = sheet.querySelector("#breakTable");
    const row = table.querySelector("#data-row");

    return row.cloneNode(true);

}

function addRowToBreakSheet(sheet)
{
    const table = sheet.querySelector("#breakTable");

    const row = getNewBreaksRow();
    table.appendChild(row);

    return row;
}

function setChildNodeClass(parent, id, className)
{
    var holder = parent.querySelector(id);
    holder.classList.add(className);
}

function setChildNodeValue(parent, id, value)
{
    var holder = parent.querySelector(id);
    holder.innerHTML = value;
}

function setRowValuesFromObject(row, data, setBreaks = true, showTraining = true, showClosing = true)
{
    if(showTraining)
    {
        setChildNodeValue(row, "#name", data["trainingName"]);
    }
    else
    {
        setChildNodeValue(row, "#name", data["name"]);
    }

    setChildNodeValue(row, "#job", data["job"]);
    setChildNodeValue(row, "#schedule", data["schedule"]);

    if(setBreaks)
    {        
        setChildNodeValue(row, "#break1", data["break1"]);
        setChildNodeValue(row, "#break2", data["break2"]);
        setChildNodeValue(row, "#break3", data["break3"]);
    }
    else
    {
        setChildNodeValue(row, "#break1", data["break1"].length == 1 ? data["break1"] : "");
        setChildNodeValue(row, "#break2", data["break2"].length == 1 ? data["break2"] : "");
        setChildNodeValue(row, "#break3", data["break3"].length == 1 ? data["break3"] : "");
    }

    setChildNodeValue(row, "#hours", data["hours"]);

    if(showClosing)
    {
        setChildNodeValue(row, "#closing-flag", data["closing"]);
    }
    else
    {
        setChildNodeValue(row, "#closing-flag", "");
    }
    
}


