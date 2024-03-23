function createBreakSheets(parent, array, useCommTemplate)
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
    
    console.log("Creating sheets for dates:", allDates);

    allDates.forEach(date => 
    {
        if(date === null || date === undefined || String(date) == "undefined")
            return;

        createBreakSheet(parent, array, date, useCommTemplate);        
    });
}

function createBreakSheet(parent, array, date, useCommTemplate)
{    
    const sheet = getNewBreakSheet(useCommTemplate);
    
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

        var row = addRowToBreakSheet(sheet);
        setRowValuesFromObject(row, data);

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
        setRowValuesFromObject(row, data);

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

function setRowValuesFromObject(row, data)
{
    setChildNodeValue(row, "#name", data["trainingName"]);
    setChildNodeValue(row, "#job", data["job"]);
    setChildNodeValue(row, "#schedule", data["schedule"]);
    setChildNodeValue(row, "#break1", data["break1"]);
    setChildNodeValue(row, "#break2", data["break2"]);
    setChildNodeValue(row, "#break3", data["break3"]);
    setChildNodeValue(row, "#hours", data["hours"]);
    setChildNodeValue(row, "#closing-flag", data["closing"]);
}


