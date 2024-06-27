let previousWidth = "";

let serviceTasks = [];
let currentServiceTMCount = 0;

let checkoutTasks = [];
let currentCheckoutTMCount = 0;

let fosTasks = [];
let currentFOSTMCount = 0;

let savedPageData = {};

function loadServiceTasks()
{
    const taskTable = document.getElementById("service-tasks");
    const tasks = taskTable.querySelectorAll("td");
    const tasksArr = [];

    for (let i = 0; i < tasks.length; i++) 
    {
        const task = tasks[i]; 
        tasksArr.push(task.innerText.replace("• ", ""));
    }

    serviceTasks = tasksArr;
    shuffle(serviceTasks);

    //Set positions of certain tasks that should occur first
    var index = serviceTasks.indexOf("Move carts and open entrance doors");
    // And swap it with the current element.
    [serviceTasks[0], serviceTasks[index]] = [serviceTasks[index], serviceTasks[0]];

    index = serviceTasks.indexOf("Complete RTS & sort");
    // And swap it with the current element.
    [serviceTasks[1], serviceTasks[index]] = [serviceTasks[index], serviceTasks[1]];

    index = serviceTasks.indexOf("Restock drinks cooler with water/gatorade/ice");
    // And swap it with the current element.
    [serviceTasks[2], serviceTasks[index]] = [serviceTasks[index], serviceTasks[2]];    
}

function loadCheckoutTasks()
{
    const taskTable = document.getElementById("checkout-tasks");
    const tasks = taskTable.querySelectorAll("td");
    const tasksArr = [];

    for (let i = 0; i < tasks.length; i++) 
    {
        const task = tasks[i]; 
        tasksArr.push(task.innerText.replace("• ", ""));
    }

    checkoutTasks = tasksArr;
    shuffle(checkoutTasks);    
}

function loadFOSTasks()
{
    const taskTable = document.getElementById("fos-tasks");
    const tasks = taskTable.querySelectorAll("td");
    const tasksArr = [];

    for (let i = 0; i < tasks.length; i++) 
    {
        const task = tasks[i]; 
        tasksArr.push(task.innerText.replace("• ", ""));
    }

    fosTasks = tasksArr;
    shuffle(fosTasks);    
}

function setupAssignmentSheetPage()
{    
    loadStoredDataFiles();
    loadLeaderData();

    const dateDropdown = document.getElementById("date-dropdown");
    setDropdownOptionsFromSelect(dateDropdown, datesArray, "");

    dateDropdown.value = getTodayDate(); 

    window.addEventListener("beforeprint", (event) =>
    {        
        savePageData();
    }); 
}

function loadSuggested()
{
    loadPageData();

    loadStoredDataFiles();
    loadLeaderData();
    var leaderInfo = getCurrentUserInfo();

    loadServiceTasks();
    currentServiceTMCount = 0;

    loadCheckoutTasks();
    currentCheckoutTMCount = 0;

    loadFOSTasks();
    currentFOSTMCount = 0;

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
        addTMRow("service-table", row, "service");
    });   
    

    array = getScheduleDataArray([leaderInfo["district"]], [leaderInfo["store"]], ["Checkout", "Cash Off."], [date]);    

    clearTMRows("checkout-table");
    array.forEach(row => 
    {
        addTMRow("checkout-table", row, "checkout");
    });  


    array = getScheduleDataArray([leaderInfo["district"]], [leaderInfo["store"]], ["Front Att."], [date]);    

    clearTMRows("front-of-store-table");
    array.forEach(row => 
    {
        addTMRow("front-of-store-table", row, "fos");
    }); 
}

function savePageData()
{
    savedPageData = {};

    savedPageData["signup-goal"] = document.getElementById("signup-goal").innerText;
    savedPageData["saftey-tip"] = document.getElementById("saftey-tip").innerText;

    savedPageData["checkout-am-backups"] = document.getElementById("checkout-am-backups").innerText;
    savedPageData["checkout-pm-backups"] = document.getElementById("checkout-pm-backups").innerText;

    savedPageData["service-am-backups"] = document.getElementById("service-am-backups").innerText;
    savedPageData["service-pm-backups"] = document.getElementById("service-pm-backups").innerText;

    const metrics = [];
    const themes = [];

    const metricsTable = document.getElementById("metrics-table");
    const metricsElements = metricsTable.querySelectorAll("#value");
    const themesElements = metricsTable.querySelectorAll("#themes");

    for (let i = 0; i < metricsElements.length; i++) 
    {
        metrics.push(metricsElements[i].innerText);
    }

    for (let i = 0; i < themesElements.length; i++) 
    {
        themes.push(themesElements[i].innerText);
    }    

    savedPageData["metrics"] = metrics;
    savedPageData["themes"] = themes;

    localStorage.setItem("savedPageData", JSON.stringify(savedPageData));
}

function loadPageData()
{
    const json = localStorage.getItem("savedPageData");
    if(json == undefined)
        return;

    savedPageData = JSON.parse(json);    

    console.log(savedPageData);

    if(savedPageData == undefined)
        return;

    //Set undefined data to blank
    const props = ["signup-goal", "saftey-tip", "checkout-am-backups", "checkout-pm-backups", "service-am-backups", "service-pm-backups"];
    props.forEach(prop => 
    {
        if(savedPageData[prop] == undefined)        
        {
            savedPageData[prop] = "";
        }
    });



    document.getElementById("signup-goal").innerText = savedPageData["signup-goal"];
    document.getElementById("saftey-tip").innerText = savedPageData["saftey-tip"];

    document.getElementById("checkout-am-backups").innerText = savedPageData["checkout-am-backups"];
    document.getElementById("checkout-pm-backups").innerText = savedPageData["checkout-pm-backups"];

    document.getElementById("service-am-backups").innerText = savedPageData["service-am-backups"];
    document.getElementById("service-pm-backups").innerText = savedPageData["service-pm-backups"];


    const metricsTable = document.getElementById("metrics-table");
    const metricsElements = metricsTable.querySelectorAll("#value");
    const themesElements = metricsTable.querySelectorAll("#themes");

    for (let i = 0; i < metricsElements.length; i++) 
    {
        metricsElements[i].innerText = savedPageData["metrics"][i];        
    }

    for (let i = 0; i < themesElements.length; i++) 
    {
        themesElements[i].innerText = savedPageData["themes"][i];        
    }    

    console.log("Loaded data");
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

function addTMRow(holderID, rowData, area = "service")
{
    const rowTemplate = document.getElementById("tm-row-template");
    const holder = document.getElementById(holderID);
    const row = rowTemplate.cloneNode(true);
    row.setAttribute("id", holderID.concat("-row"));
    row.style.display = "";
    holder.appendChild(row);

    row.querySelector("#name").innerHTML = rowData["nameNoNum"];
    row.querySelector("#training").innerHTML = rowData["trainingStr"];
    row.querySelector("#shift").innerHTML = rowData["schedule"];
    row.querySelector("#break1").innerHTML = rowData["break1"];
    row.querySelector("#break2").innerHTML = rowData["break2"];
    row.querySelector("#break3").innerHTML = rowData["break3"];        
    row.querySelector("#tasks").innerHTML = "";

    if(area == "service" && currentServiceTMCount < serviceTasks.length)
        row.querySelector("#tasks").innerHTML = serviceTasks[currentServiceTMCount++];

    else if(area == "checkout")
    {
        row.querySelector("#register").classList.remove("hidden");
        row.querySelector("#signups").classList.remove("hidden");
        row.querySelector("#signups").innerText = getRandomInt(2, 4);
        row.querySelector("#cards").classList.remove("hidden");
        row.querySelector("#cards").innerText = getRandomInt(1, 2);

        if(rowData["job"] == "Cash Off.")
        {
            row.querySelector("#tasks").innerHTML = "Complete Cash Office daily routines";

            row.querySelector("#register").setAttribute("contenteditable", "false");
            row.querySelector("#register").setAttribute("onClick", "");
            row.querySelector("#register").innerText = "X";
            row.querySelector("#register").classList.remove("editable");
            row.querySelector("#register").classList.add("shaded");

            row.querySelector("#signups").setAttribute("contenteditable", "false");
            row.querySelector("#signups").setAttribute("onClick", "");
            row.querySelector("#signups").innerText = "X";
            row.querySelector("#signups").classList.remove("editable");
            row.querySelector("#signups").classList.add("shaded");

            row.querySelector("#cards").setAttribute("contenteditable", "false");
            row.querySelector("#cards").setAttribute("onClick", "");
            row.querySelector("#cards").innerText = "X";
            row.querySelector("#cards").classList.remove("editable");
            row.querySelector("#cards").classList.add("shaded");
        }
            

        else if(rowData["nameNoNum"] == "Ort, Carmen")
            row.querySelector("#tasks").innerHTML = "Push Bullseye freight until store open";

        else if(rowData["nameNoNum"] == "Bow, Sherwin")
            row.querySelector("#tasks").innerHTML = "";

        else if(currentCheckoutTMCount < checkoutTasks.length)
        {
            row.querySelector("#tasks").innerHTML = checkoutTasks[currentCheckoutTMCount++];
        }
            
    }

    else if(area == "fos")
    {
        if(currentFOSTMCount < fosTasks.length - 1)
        {
            row.querySelector("#tasks").innerHTML = fosTasks[currentFOSTMCount++];
            row.querySelector("#tasks").innerHTML += ", " + fosTasks[currentFOSTMCount++];
        }
            
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

function selectText(element)
{
    var text = element.innerText.replace("• ", "");
    navigator.clipboard.writeText(text);    

    const messages = document.querySelectorAll("#copyMessage");
    for (let i = 0; i < messages.length; i++) 
    {
        const message = messages[i];
        message.innerText = "Copied: " + text;
    }

    //document.getElementById("copyMessage").innerText = "Copyied: " + text;
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

function getRandomInt(min, max) 
{
    return Math.round(lerp(min, max, Math.random()));    
}

function lerp(start, end, amt) 
{
    return (1 - amt) * start + amt * end;
}

function shuffle(array) 
{
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
}