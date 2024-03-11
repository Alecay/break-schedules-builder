function createBreakSheets(array)
{
    console.log("Creating sheets");
    var allDates = new Array();
    array.forEach((row) =>
    {        
        if(!allDates.includes(row["SCHEDULED DATE"]))
        {
            allDates.push(row["SCHEDULED DATE"]);
        }
    });

    allDates.forEach(date => 
    {
        if(date === null || date === undefined || String(date) == "undefined")
            return;

        createBreakSheet(array, date);
        createBreakSheetByArea(array, date, "Guest Services");
    });
}

function createBreakSheet(array, date)
{
    const node = document.getElementById("templates");
    const sheet = getNewBreakSheet();
    
    setChildNodeValue(sheet, "#date", getFormattedDate(date));
    setChildNodeValue(sheet, "#up-to-date", "Up to date as of: ".concat(array[0]["LOAD DATE"]));

    var formattedArr = getFormattedArray(array);

    var count = 0;
    var closingCount = 0;

    formattedArr.forEach((data) =>
    {        
        if(data["date"] != date)
        {
            return;
        }

        var row = addRowToBreakSheet(sheet);
        setRowValuesFromObject(row, data);

        if(data["break1"] == "X")
        {
            setChildNodeClass(row, "#break1", "breakEmpty")
        }

        if(data["break2"] == "X")
        {
            setChildNodeClass(row, "#break2", "breakEmpty")
        }

        if(data["break3"] == "X")
        {
            setChildNodeClass(row, "#break3", "breakEmpty")
        }

        count++;

        if(data["closing"] != "")
        {
            closingCount++;
        }
    });

    setChildNodeValue(sheet, "#total-tms", "Total TMs: ".concat(count));
    setChildNodeValue(sheet, "#closing-tms", "Closing TMs: ".concat(closingCount));
    

    document.body.appendChild(sheet);
}

function createBreakSheetByArea(array, date, area)
{
    const node = document.getElementById("templates");
    const sheet = getNewBreakSheet();
    
    setChildNodeValue(sheet, "#date", getFormattedDate(date));
    setChildNodeValue(sheet, "#up-to-date", "Up to date as of: ".concat(array[0]["LOAD DATE"]));

    var formattedArr = getFormattedArray(array);

    var count = 0;
    var closingCount = 0;

    formattedArr.forEach((data) =>
    {        
        if(data["date"] != date || data["area"] != area)
        {
            return;
        }

        var row = addRowToBreakSheet(sheet);
        setRowValuesFromObject(row, data);

        if(data["break1"] == "X")
        {
            setChildNodeClass(row, "#break1", "breakEmpty")
        }

        if(data["break2"] == "X")
        {
            setChildNodeClass(row, "#break2", "breakEmpty")
        }

        if(data["break3"] == "X")
        {
            setChildNodeClass(row, "#break3", "breakEmpty")
        }

        count++;

        if(data["closing"] != "")
        {
            closingCount++;
        }
    });

    setChildNodeValue(sheet, "#total-tms", "Total TMs: ".concat(count));
    setChildNodeValue(sheet, "#closing-tms", "Closing TMs: ".concat(closingCount));
    

    document.body.appendChild(sheet);
}

function getFormattedArray(array)
{
    var newArr = new Array();
    array.forEach((row) =>
    {        
        var singleObj = {};
        singleObj["name"] = String(row["TM NAME (NUM)"]).replace(/"/g, "");        
        singleObj["job"] = String(row["JOB NAME"]);
        singleObj["schedule"] = String(row["SCHEDULE"]);

        var startTime = String(row["SCHEDULE"]).substring(0, 8);
        var endTime = String(row["SCHEDULE"]).substring(11, 19);

        singleObj["hours"] = (timeToHourValue(endTime) - timeToHourValue(startTime)).toFixed(1);


        
        //Calcalute breaks
        if(singleObj["hours"] >= 4)
        {
            singleObj["break1"] = shiftTime(startTime, 2);
        }
        else
        {
            singleObj["break1"] = "X";
        }

        if(singleObj["hours"] >= 6)
        {
            singleObj["break2"] = shiftTime(startTime, 4);
        }
        else
        {
            singleObj["break2"] = "X";
        }

        if(singleObj["hours"] >= 7)
        {
            singleObj["break3"] = shiftTime(startTime, 6);
        }
        else
        {
            singleObj["break3"] = "X";
        } 

        singleObj["date"] = String(row["SCHEDULED DATE"]);
        singleObj["area"] = String(row["JOB AREA"]);
        singleObj["closing"] = (timeToHourValue(endTime) >= timeToHourValue("09:45 PM")) ? "*" : "";

        if(singleObj["name"].length == 0 || singleObj["job"].length == 0)
            return;

        newArr.push(singleObj);
    });

    return newArr;
}

function getNewBreakSheet()
{
    const node = document.getElementById("templates");
    const sheet = node.querySelector("#breakSheetHolder").cloneNode(true);    
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

function setRowValuesFromObject(row, data)
{
    setChildNodeValue(row, "#name", data["name"]);
    setChildNodeValue(row, "#job", data["job"]);
    setChildNodeValue(row, "#schedule", data["schedule"]);
    setChildNodeValue(row, "#break1", data["break1"]);
    setChildNodeValue(row, "#break2", data["break2"]);
    setChildNodeValue(row, "#break3", data["break3"]);
    setChildNodeValue(row, "#hours", data["hours"]);
    setChildNodeValue(row, "#closing-flag", data["closing"]);
}