let previousWidth = "";

function setupAssignmentSheetPage()
{    
    loadStoredDataFiles();
    loadLeaderData();

    const dateDropdown = document.getElementById("date-dropdown");
    setDropdownOptionsFromSelect(dateDropdown, datesArray, "");
}

function loadSuggested()
{
    loadStoredDataFiles();
    loadLeaderData();
    var leaderInfo = getCurrentUserInfo();

    const assignmentSheet = document.getElementById("se-assignment-sheet");
    setupTableResize(assignmentSheet);

    const date = document.getElementById("date-dropdown").value//getTodayDate();
    const dateHolders = document.querySelectorAll("#date");
    for (let i = 0; i < dateHolders.length; i++) {
        const element = dateHolders[i];
        element.innerText = date;
    }    

    var leadersString = "";
    var leadersSchedule = getScheduleDataArray([leaderInfo["district"]], [leaderInfo["store"]], ["S&E TL", "Order Pickup"], [date]);

    //leadersSchedule = getFilteredArray(leadersSchedule, "tmNumber", []);

    for (let i = 0; i < leadersSchedule.length; i++) 
    {
        const name = leadersSchedule[i]["shortName"];
        leadersString += name;

        if(i < leadersSchedule.length - 1)
            leadersString += ", ";
    }

    console.log(leadersSchedule);

    const leaderHolders = document.querySelectorAll("#leader-list");
    for (let i = 0; i < leaderHolders.length; i++) {
        const element = leaderHolders[i];
        element.innerText = leadersString;
    }  

    var array = getScheduleDataArray([leaderInfo["district"]], [leaderInfo["store"]], ["Service", "Order Pickup"], [date]);    

    clearTMRows("service-table");
    array.forEach(row => 
    {
        addTMRow("service-table", row);
    });   
    

    array = getScheduleDataArray([leaderInfo["district"]], [leaderInfo["store"]], ["Checkout", "Cash Off."], [date]);    

    clearTMRows("checkout-table");
    array.forEach(row => 
    {
        addTMRow("checkout-table", row, true);
    });  


    array = getScheduleDataArray([leaderInfo["district"]], [leaderInfo["store"]], ["Front Att."], [date]);    

    clearTMRows("front-of-store-table");
    array.forEach(row => 
    {
        addTMRow("front-of-store-table", row);
    }); 
}

function clearTMRows(holderID)
{
    const holder = document.getElementById(holderID);
    const rows = holder.querySelectorAll("#".concat(holderID).concat("-row"));
    for (let i = 0; i < rows.length; i++) 
    {
        const row = rows[i];
        holder.removeChild(row);
    }
}

function addTMRow(holderID, rowData, isCheckout = false)
{
    const rowTemplate = document.getElementById("tm-row-template");
    const holder = document.getElementById(holderID);
    const row = rowTemplate.cloneNode(true);
    row.setAttribute("id", holderID.concat("-row"));
    row.style.display = "";
    holder.appendChild(row);

    row.querySelector("#name").innerHTML = rowData["name"];
    row.querySelector("#training").innerHTML = rowData["trainingStr"];
    row.querySelector("#shift").innerHTML = rowData["schedule"];
    row.querySelector("#break1").innerHTML = rowData["break1"];
    row.querySelector("#break2").innerHTML = rowData["break2"];
    row.querySelector("#break3").innerHTML = rowData["break3"];        
    row.querySelector("#tasks").innerHTML = "";

    if(isCheckout)
    {
        row.querySelector("#register").classList.remove("hidden");
        row.querySelector("#signups").classList.remove("hidden");
        row.querySelector("#cards").classList.remove("hidden");
    }
        

    if(rowData["break1"] == "X")
    {
        row.querySelector("#break1").classList.add("shaded");
    }

    if(rowData["break2"] == "X")
    {
        row.querySelector("#break2").classList.add("shaded");
    }

    if(rowData["break3"] == "X")
    {
        row.querySelector("#break3").classList.add("shaded");
    }
}

function onBreakTimeChanged(element)
{
    const text = element.innerText
    const converted = convertToFormattedTime(text);

    if(converted != "invalid")
    {
        element.innerText = converted;
        
        element.classList.remove("invalidTimeColor");
        element.classList.remove("shaded");
    }
    else
    {
        // if(text == "x" || text == "X")
        // {
        //     element.classList.add("shaded");
        //     element.classList.remove("invalidTimeColor");
        //     element.innerText = "X";
        // }
        // else
        // {
        //     element.classList.add("invalidTimeColor");
        // }

        element.classList.add("shaded");
        element.classList.remove("invalidTimeColor");
        element.innerText = "X";
        
    }
}

function onShiftTimeChanged(element)
{
    const text = element.innerText
    const converted = convertToFormattedTimeRange(text);
    
    if(converted != "invalid")
    {
        element.innerText = converted;    
        element.classList.remove("invalidTimeColor");
    }
    else
    {
        element.classList.add("invalidTimeColor");
    }
}

function selectAllOnEdit()
{
    document.execCommand('selectAll', false, null);
}


function removeTMRow(row)
{    
    const parent = row.parentElement.parentElement.parentElement;
    const holder = row.parentElement.parentElement;
    parent.removeChild(holder);
}

function addCopyOfTMRow(row)
{    
    const holder = row.parentElement;
    const clone = row.cloneNode(true);
    
    holder.appendChild(clone);
}