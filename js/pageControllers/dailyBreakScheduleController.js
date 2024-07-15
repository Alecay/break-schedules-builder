let previewPageIndex = 0;

function loadTemplates()
{
    //Loading Templates
    const templatesElem = document.createElement("div");    
    templatesElem.setAttribute("class", "hidden");
    templatesElem.setAttribute("id", "templates");

    document.body.appendChild(templatesElem);

    var template = loadFile("../templates/breakSheet.html");
    var noCommTemplate = loadFile("../templates/breakSheetNoComm.html");        
    var treeTemplate = loadFile("../templates/checkboxTree.html");
    templatesElem.innerHTML = template.concat(noCommTemplate, treeTemplate);
}

function setupDailyBreakSchedulePage()
{
    loadLeaderData();
    loadStoredDataFiles();

    clearInterval(updateCurrentTimeSelectors());
    setInterval(() => { updateCurrentTimeSelectors(); }, 15000);
    
    if(!isAllowedUser(localStorage.loginID))
    {
        clearStoredFilters();
        signOut();
    }

    const leaderInfo = getCurrentUserInfo();

    if(!isCurrentUserADev())
    {        
        setFilterDropdownsActive(false);
        setDevItemsVisible(false);
    }
    else
    {
        setFilterDropdownsActive(true);
        setDevItemsVisible(true);
        console.log("Welcome back developer");
    }


    document.getElementById("current-user-name").innerText = leaderInfo["nameFormatted"].concat(", ", leaderInfo["job"]);     

    loadTemplates();

    setupOnChangeEventsForDropdowns();

    const treeHolder = document.getElementById("areas-tree-holder");
    treeHolder.innerHTML ="";
    createCheckboxTree(treeHolder, departmentTree, "areas-tree");

    // document.getElementById('csvFile').addEventListener('change', (event) =>
    // {
    //     readScheduleDataFile(event);
    //     updateMainMenu();
    // });

    // document.getElementById('csvFile2').addEventListener('change', (event) =>
    // {
    //     readTrainingDataFile(event);
    //     updateMainMenu();
    // });

    window.addEventListener("load", function() 
    {
        if(isLoggedIn())
        {            
            //storeCurrentFilters();
        }        
            
    });


    // const storedFilters = getStoredFilters();
    // if(storedFilters != undefined && storedFilters != {} && storedFilters["loginID"] != localStorage.loginID)
    // {
    //     loadUsersDefaultFilters();
    // }
    
    loadUsersDefaultFilters();
    updateDailyBreakSchedulePage(); 
}

function setupOnChangeEventsForDropdowns()
{
    const startSelector = document.getElementById("start-date-dropdown");
    startSelector.onchange = (event) => { startDateSelected(); };

    const endSelector = document.getElementById("end-date-dropdown");
    endSelector.value = datesArray[datesArray.length - 1];
    endSelector.onchange = (event) => { endDateSelected(); };

    const shiftSelector = document.getElementById("tm-working-dropdown");
    shiftSelector.onchange = (event) => { onShiftFilterChanged(); updatePreviewPage(); };

    const startTimeSelector = document.getElementById("shift-start-time");
    startTimeSelector.onchange = (event) => { onStartTimeChanged(); updatePreviewPage(); };

    const endTimeSelector = document.getElementById("shift-end-time");
    endTimeSelector.onchange = (event) => { onEndTimeChanged(); updatePreviewPage(); };

    const districtSelector = document.getElementById("district-dropdown");
    districtSelector.onchange = (event) => { updateStoresDropDown(); updatePreviewPage(); };

    const storeSelector = document.getElementById("store-dropdown");
    storeSelector.onchange = (event) => { updatePreviewPage(); };    

    const autoFillSelector = document.getElementById("autofill-breaks-dropdown");
    autoFillSelector.onchange = (event) => { updatePreviewPage(); };  

    const break1Selector = document.getElementById("break1-dropdown");
    break1Selector.onchange = (event) => { updatePreviewPage(); };  

    const break2Selector = document.getElementById("break2-dropdown");
    break2Selector.onchange = (event) => { updatePreviewPage(); };  

    const break3Selector = document.getElementById("break3-dropdown");
    break3Selector.onchange = (event) => { updatePreviewPage(); };  

    const showTrainingSelector = document.getElementById("show-training-dropdown");
    showTrainingSelector.onchange = (event) => { updatePreviewPage(); }; 

    const closingTimeSelector = document.getElementById("closing-time-dropdown");
    closingTimeSelector.onchange = (event) => { updatePreviewPage(); }; 

    const showClosingSelector = document.getElementById("show-closing-dropdown");
    showClosingSelector.onchange = (event) => { updatePreviewPage(); }; 

    const checkoffBreaksSelector = document.getElementById("checkoff-breaks-dropdown");
    checkoffBreaksSelector.onchange = (event) => { onBreakCheckoffChanged(); updatePreviewPage(); }; 

    const checkoffBreaksTimeSelector = document.getElementById("checkoff-breaks-time");
    checkoffBreaksTimeSelector.onchange = (event) => { updatePreviewPage(); }; 
}

function updateDailyBreakSchedulePage()
{
    console.log("Updated page");
    const  districtsArray = getDistricts();
    const storesArray = getStores();
    const datesArray = getDates();
    const jobsArray = getJobs();

    //document.getElementById("data-load-date").innerHTML = scheduleArray[0]["load"];

    //document.getElementById("district-count").innerHTML = districtsArray.length;
    //document.getElementById("store-count").innerHTML = storesArray.length;
    //document.getElementById("job-count").innerHTML = jobsArray.length;

    //document.getElementById("dates-range").innerHTML = datesArray[0].concat(" - ", datesArray[datesArray.length - 1]);     

    setDropdownOptions("district-dropdown", districtsArray); 
    updateStoresDropDown();        

    setDropdownOptions("start-date-dropdown", datesArray);
    setDropdownOptions("end-date-dropdown", datesArray);

    const endSelector = document.getElementById("end-date-dropdown");
    endSelector.value = datesArray[datesArray.length - 1];    

    loadStoredFilters();
    updatePreviewPage();

    const trainingCount = getTrainingCount(sessionStorage.selectedStore);
    //document.getElementById("training-count").innerText = trainingCount == 0 ? "Not Loaded" : trainingCount;
}


function updateStoresDropDown()
{
    var districtSelector = document.getElementById("district-dropdown");

    var districtSArray = getFilteredArray(scheduleArray, "district", [districtSelector.value]);
    var selectedStoresArray = getUniqueElements(districtSArray, "store");    
    setDropdownOptions("store-dropdown", selectedStoresArray);
}

function updatePreviewPage()
{    
    console.log("Updating Preview Page"); 
    storeCurrentFilters();   

    setupShiftAdjustmentDropdowns();

    const sheetsHolder = document.getElementById("sample-sheet-holder");
    sheetsHolder.innerHTML="";

    const storedFilters = getStoredFilters();

    createBreakSheets(sheetsHolder, getCurrentPreviewArrayWithAdjustments(), storedFilters["sheetSettings"]);
}

function getCurrentPreviewArray()
{
    const storedFilters = getStoredFilters();
    const district = storedFilters["district"];
    const store =  storedFilters["store"];
    const areas =  storedFilters["areas"];

    const date = getPreviewDate();
    const array = getScheduleDataArray([district], [store], areas, [date]);
    array.sort(dynamicSortMultiple("district", "store", "date", "rollupDepartment",  "department", "startTime"));
    return array;
}

function getAllPreviewArray()
{
    const storedFilters = getStoredFilters();
    const district = storedFilters["district"];
    const store =  storedFilters["store"];
    const areas =  storedFilters["areas"];

    const dates = getDates();
    const array = getScheduleDataArray([district], [store], areas, dates);
    array.sort(dynamicSortMultiple("district", "store", "date", "rollupDepartment",  "department", "startTime"));
    return array;
}

function getCurrentPreviewArrayWithAdjustments()
{
    const array = getCurrentPreviewArray();

    return applyShiftAdjusments(array);

}

function applyShiftAdjusments(array)
{    
    const filters = getStoredFilters();    
    const shiftAdjustments = filters["shiftAdjustments"];

    for(var i = 0; i < array.length; i++)
    {
        var rowData = array[i];
        for(var j = 0; j < shiftAdjustments.length; j++)
        {
            const shiftAdjustment = shiftAdjustments[j];

            if(rowData["shortName"] == shiftAdjustment["name"] && rowData["date"] == shiftAdjustment["date"])
            {                
                rowData["job"] = shiftAdjustment["job"];
                rowData["schedule"] = shiftAdjustment["schedule"];


                if(!shiftAdjustment["visible"])
                {
                    rowData = {};
                }

                array[i] = rowData;

                //console.log("Modfied data", rowData);
                break;
            }            
        }
    }

    return array;

}

function createPrintableSheetsFromStoredFilters()
{
    const sheetsHolder = document.getElementById("print-sheet-holder");
    sheetsHolder.innerHTML="";

    const storedFilters = getStoredFilters();
    console.log(storedFilters);
    const district = storedFilters["district"];
    const store = storedFilters["store"];
    const area = storedFilters["areas"];
    const dates = getDatesFromRange(storedFilters["startDate"], storedFilters["endDate"]);

    console.log(area);

    const array = applyShiftAdjusments(getScheduleDataArray([district], [store], area, dates));

    createBreakSheets(sheetsHolder, array, storedFilters["sheetSettings"]);
}

function printSelectedPages()
{
    storeCurrentFilters();
    window.open('breakSchedulesPrintable.html', '_blank');
}

function startDateSelected()
{    
    const startSelector = document.getElementById("start-date-dropdown");
    const endSelector = document.getElementById("end-date-dropdown");
    //console.log("Selected: ", date);
    

    const dates = getDates();
    const startIndex = dates.indexOf(startSelector.value);
    const endIndex = dates.indexOf(endSelector.value);

    if(startIndex > endIndex)
    {
        endSelector.value = startSelector.value;
    }

    previewPageIndex = 0;

    updatePreviewPage();
}

function endDateSelected()
{    
    const startSelector = document.getElementById("start-date-dropdown");
    const endSelector = document.getElementById("end-date-dropdown");
    
    const dates = getDates();
    const startIndex = dates.indexOf(startSelector.value);
    const endIndex = dates.indexOf(endSelector.value);

    if(startIndex > endIndex)
    {
        startSelector.value = endSelector.value;
    }

    previewPageIndex = 0;

    updatePreviewPage();
}

function getSelectedDates()
{
    const startSelector = document.getElementById("start-date-dropdown");
    const endSelector = document.getElementById("end-date-dropdown");

    return getDatesFromRange(startSelector.value, endSelector.value);
}

function getPreviewDate()
{
    const dates = getSelectedDates();
    const length = dates.length;

    if(previewPageIndex < 0)
    {
        previewPageIndex = 0;
    }       
    else if(previewPageIndex >= length)
    {
        previewPageIndex = length - 1;
    }

    const date = dates[previewPageIndex];

    return date;
}

function getDatesFromRange(startDate, endDate)
{
    const dates = getDates();
    const startIndex = dates.indexOf(startDate);
    const endIndex = dates.indexOf(endDate);

    var newArr = new Array();
    for (let index = startIndex; index <= endIndex; index++) {
        newArr.push(dates[index]);        
    }        

    return newArr;
}

function selectPreviousPreviewPage()
{
    previewPageIndex--;

    updatePreviewPage();
}

function selectNextPreviewPage()
{
    previewPageIndex++;

    updatePreviewPage();
}

function loadUsersDefaultFilters()
{
    console.log("Setting default filters");
    const leaderInfo = getCurrentUserInfo();
    const dates = getDates();

    const index = dates.indexOf(getTodayDate());

    localStorage.storedFilters = JSON.stringify
    ({
        loginID : localStorage.loginID,
        district : leaderInfo["district"],
        store : leaderInfo["store"],
        startDate : (index >= 0) ? dates[index] : dates[0],
        endDate :  (index >= 0) ? dates[dates.length - 1] : dates[dates.length - 1],//dates[dates.length - 1],
        areas : leaderInfo["areas"],
        autoFillBreaks : true,
        break1 : 4.0,
        break2 : 6.0,
        break3 : 7.0,
    });    

    loadStoredFilters();
}

function getStoredFilters()
{
    if(localStorage.storedFilters != undefined && localStorage.storedFilters != "")
    {
        const filters = JSON.parse(localStorage.storedFilters);

        if(filters["sheetSettings"] != undefined)
        {
            const sheetSettings = filters["sheetSettings"];
            sheetSettings["autoFillBreaks"] = sheetSettings["autoFillBreaks"] == "true" || sheetSettings["autoFillBreaks"];
            sheetSettings["showTraining"] = sheetSettings["showTraining"] == "true" || sheetSettings["showTraining"];
            sheetSettings["showClosing"] = sheetSettings["showClosing"] == "true" || sheetSettings["showClosing"];
    
            filters["sheetSettings"] = sheetSettings;
        }


        return filters;
    }

    return {};
}

function loadStoredFilters()
{
    console.log("Loading stored filters");
    //Set Defulat store to T1061
    const districtSelector = document.getElementById("district-dropdown");
    const storeSelector = document.getElementById("store-dropdown");    
    const startSelector = document.getElementById("start-date-dropdown");
    const endSelector = document.getElementById("end-date-dropdown");

    const storedFilters = getStoredFilters();

    if(storedFilters["district"] != undefined && storedFilters["district"] != "")
    {
        districtSelector.value = storedFilters["district"];
    }

    updateStoresDropDown();

    if(storedFilters["store"] != undefined && storedFilters["store"] != "")
    {
        storeSelector.value = storedFilters["store"];
    }

    if(storedFilters["areas"] != undefined && storedFilters["areas"] != "")
    {
        const areas = getAllTreeChildLabels("areas-tree-holder", storedFilters["areas"]);
        setTreeSelectedValues("areas-tree-holder", areas, false);
    }

    if(storedFilters["startDate"] != undefined && storedFilters["startDate"] != "")
    {
        startSelector.value = storedFilters["startDate"];
    }

    if(storedFilters["endDate"] != undefined && storedFilters["endDate"] != "")
    {
        endSelector.value = storedFilters["endDate"];
    }
}

function storeCurrentFilters()
{
    //console.log("Storing current filters");
    const district = document.getElementById("district-dropdown").value;
    const store = document.getElementById("store-dropdown").value;    
    const startDate = document.getElementById("start-date-dropdown").value;
    const endDate = document.getElementById("end-date-dropdown").value;
    var areas = getTreeSelectedValues("areas-tree-holder");
    //console.log("Stored Areas", areas);

    if(areas.length == 0)
    {
        //console.log("Zero Length");
        //areas = getCurrentUserInfo()["areas"];
    }

    const useComm = store == "T1061" && (areas.includes("Service") || areas.includes("Checkout"));

    const autoFillBreaks = document.getElementById("autofill-breaks-dropdown").value;
    const break1 = document.getElementById("break1-dropdown").value;
    const break2 = document.getElementById("break2-dropdown").value;
    const break3 = document.getElementById("break3-dropdown").value;    

    const showTraining = document.getElementById("show-training-dropdown").value;
    const showClosing = document.getElementById("show-closing-dropdown").value;

    const closingTime = document.getElementById("closing-time-dropdown").value; 
    var selectedTime = document.getElementById("checkoff-breaks-time").value;
    if(selectedTime != "")
    {
        selectedTime = timeToHourValue(selectedTime);
        selectedTime = hourValueToTime(selectedTime);
    }    

    const startTime = document.getElementById("shift-start-time").value; 
    const endTime = document.getElementById("shift-end-time").value; 

    const sheetSettings = 
    {
        useCommTemplate : useComm,
        autoFillBreaks : autoFillBreaks,
        break1Threshold : break1,
        break2Threshold : break2,
        break3Threshold : break3,
        showTraining : showTraining,
        showClosing : showClosing,
        closingTime : closingTime,
        currentTime : selectedTime,
        startTime : startTime,
        endTime : endTime,
    };

    const shiftAdjustments = getShiftAdjustmentArray();

    localStorage.storedFilters = JSON.stringify
    ({
        loginID : localStorage.loginID,
        district : district,
        store : store,
        startDate : startDate,
        endDate : endDate,
        areas : areas,
        autoFillBreaks : autoFillBreaks,
        break1 : break1,
        break2 : break2,
        break3 : break3,
        showTraining : showTraining,
        showClosing : showClosing,
        sheetSettings : sheetSettings,
        shiftAdjustments : shiftAdjustments
    });

    //console.log(JSON.parse(localStorage.storedFilters));
}

function clearStoredFilters()
{
    console.log("Clearing stored filters");

    localStorage.storedFilters = "";
}

function setFilterDropdowns(district, store, areas)
{
    sessionStorage.selectedStore = store;
    sessionStorage.selectedDistrict = district;
    sessionStorage.selectedAreas = areas;

    loadStoredFilters();
}

function setFilterDropdownsActive(value)
{
    const districtSelector = document.getElementById("district-dropdown");
    const storeSelector = document.getElementById("store-dropdown");

    districtSelector.disabled = !value;
    storeSelector.disabled = !value;
}

function setDevItemsVisible(value)
{
    const elements = document.getElementsByClassName("dev-visible");

    for (let i = 0; i < elements.length; i++) {        
        setElementVisible(elements[i], value);
    }
}

function setElementVisible(element, value)
{
    if(value)
    {
        element.classList.remove("hidden");
    }
    else
    {
        element.classList.add("hidden");
    }
}

function onBreakCheckoffChanged()
{
    const checkoffVal = document.getElementById("checkoff-breaks-dropdown").value;
    const checkoffTimeSelector = document.getElementById("checkoff-breaks-time");

    const d = new Date();
    const time = getCurrentTime(true, true, false, false, true);

    if(checkoffVal == 1)
    {
        checkoffTimeSelector.value = time;
        checkoffTimeSelector.disabled = true;
    }
    else if(checkoffVal == 2)
    {
        checkoffTimeSelector.value = time;
        checkoffTimeSelector.disabled = false;
    }
    else
    {
        checkoffTimeSelector.value = "";
        checkoffTimeSelector.disabled = true;
    }
}

function onShiftFilterChanged()
{
    const shiftVal = document.getElementById("tm-working-dropdown").value;
    const startTimeSelector = document.getElementById("shift-start-time");
    const endTimeSelector = document.getElementById("shift-end-time");

    const d = new Date();
    const time = getCurrentTime(true, true, false, false, true);

    if(shiftVal == 1)
    {
        startTimeSelector.value = time;
        endTimeSelector.value = "23:59";

        startTimeSelector.disabled = true;
        endTimeSelector.disabled = true;
    }
    else if(shiftVal == 2)
    {
        startTimeSelector.value = time;
        endTimeSelector.value = "23:59";

        startTimeSelector.disabled = false;
        endTimeSelector.disabled = true;
    }
    else if(shiftVal == 3)
    {
        startTimeSelector.value = time;
        endTimeSelector.value = "23:59";

        startTimeSelector.disabled = false;
        endTimeSelector.disabled = false;
    }
    else
    {
        startTimeSelector.value = "00:00";
        endTimeSelector.value = "23:59";

        startTimeSelector.disabled = true;
        endTimeSelector.disabled = true;
    }
}

function onStartTimeChanged()
{
    const shiftVal = document.getElementById("tm-working-dropdown").value;
    const startTimeSelector = document.getElementById("shift-start-time");
    const endTimeSelector = document.getElementById("shift-end-time");

    const startTimeVal = timeToHourValue(startTimeSelector.value);
    const endTimeVal = timeToHourValue(endTimeSelector.value);

    if(shiftVal == 3 && startTimeVal > endTimeVal)
    {
        endTimeSelector.value = startTimeSelector.value;
    }
}

function onEndTimeChanged()
{
    const shiftVal = document.getElementById("tm-working-dropdown").value;
    const startTimeSelector = document.getElementById("shift-start-time");
    const endTimeSelector = document.getElementById("shift-end-time");

    const startTimeVal = timeToHourValue(startTimeSelector.value);
    const endTimeVal = timeToHourValue(endTimeSelector.value);

    if(shiftVal == 3 && startTimeVal > endTimeVal)
    {
        startTimeSelector.value = endTimeSelector.value;
    }
}

function updateCurrentTimeSelectors()
{
    const checkoffVal = document.getElementById("checkoff-breaks-dropdown").value;
    const checkoffTimeSelector = document.getElementById("checkoff-breaks-time");

    const shiftVal = document.getElementById("tm-working-dropdown").value;
    const startTimeSelector = document.getElementById("shift-start-time");

    const time = getCurrentTime(true, true, false, false, true);

    var shouldUpdatePage = false;
    if(checkoffVal == 1)
    {
        if(timeToHourValue(checkoffTimeSelector.value) != timeToHourValue(time))
        {
            shouldUpdatePage = true;
        }

        checkoffTimeSelector.value = time;
    }

    if(shiftVal == 1)
    {
        if(timeToHourValue(startTimeSelector.value) != timeToHourValue(time))
        {
            shouldUpdatePage = true;
        }

        startTimeSelector.value = time;
    }        
    
    if(shouldUpdatePage)
    {
        console.log("Updated current time");
        updatePreviewPage();
    }
}

function setupShiftAdjustmentDropdowns()
{
    const array = getAllPreviewArray();
    const dates = getDates();
    const options = getUniqueElements(array, "shortName");
    options.sort();
    options.splice(0, 0, "TM Name");

    const table = document.getElementById("shift-adjustment-table");
    const rowTemplate = table.querySelector("#shift-adjustment-row-template");
    const selector = rowTemplate.querySelector("#tm-name-dropdown");    
    setDropdownOptionsFromSelect(selector, options, "");

    const nameDropdowns = table.querySelectorAll("#tm-name-dropdown");    

    for(var i = 0; i < nameDropdowns.length; i++)
    {
        const value = nameDropdowns[i].value;
        setDropdownOptionsFromSelect(nameDropdowns[i], options, "");

        if(options.includes(value))
        {
            nameDropdowns[i].value = value;
        }

        //loadDefaultShiftAdjustmentRowData(nameDropdowns[i]);
    }

    //setupDateDropdowns();

    for(var i = 0; i < nameDropdowns.length; i++)
    {
        loadDefaultShiftAdjustmentRowData(nameDropdowns[i]);
    }

    getShiftAdjustmentArray();
}

function setupDateDropdowns()
{
    const array = getAllPreviewArray();
    const table = document.getElementById("shift-adjustment-table");
    const nameDropdowns = table.querySelectorAll("#tm-name-dropdown");   
    const dateDropdowns = table.querySelectorAll("#date-dropdown");

    for(var i = 0; i < dateDropdowns.length; i++)
    {
        const name = nameDropdowns[i].value;
        console.log(name);
        const tmArray = getFilteredArray(array, "shortName", [name]);
        const tmDates = getUniqueElements(tmArray, "date");
        const value = dateDropdowns[i].value;
        setDropdownOptionsFromSelect(dateDropdowns[i], tmDates, "");

        if(tmDates.includes(value))
        {
            dateDropdowns[i].value = value;
        }
    }
}

function onAddShiftAdjustmentRow()
{
    const table = document.getElementById("shift-adjustment-table");
    const rowTemplate = table.querySelector("#shift-adjustment-row-template");
    const row = rowTemplate.cloneNode(true);
    row.classList.remove("hidden");
    row.setAttribute("id", "shift-adjustment-row");
    table.appendChild(row);

    storeCurrentFilters();
}

function onRemoveShiftAdjustmentRow(row)
{
    const parent = row.parentElement.parentElement.parentElement;
    const holder = row.parentElement.parentElement;
    parent.removeChild(holder);

    storeCurrentFilters();
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

    storeCurrentFilters();
}

function selectAllOnEdit()
{
    document.execCommand('selectAll', false, null);
}

function loadDefaultShiftAdjustmentRowData(select, setDates = true)
{    
    //setupDateDropdowns();

    const array = getAllPreviewArray();
    array.sort
    const name = select.value;
    const tmArray = getFilteredArray(array, "shortName", [name]);

    if(tmArray.length == 0)
        return;

    const tmDates = getUniqueElements(tmArray, "date");

    const row = select.parentElement.parentElement;//.parentElement;
    const dateDropdown = row.querySelector("#date-dropdown");
    var date = dateDropdown.value;

    if(setDates)
    {
        setDropdownOptionsFromSelect(dateDropdown, tmDates, "");
    
        const previewDate = getPreviewDate();
        if(tmDates.includes(previewDate))
        {
            dateDropdown.value = previewDate;
        }
        else if(tmDates.includes(date))
        {
            dateDropdown.value = date;
        }
        else
        {
            date =  dateDropdown.value;
        }
    }


    const rowData = arrayLookup(tmArray, "date", date);
    

    
    

    
    const job = row.querySelector("#job-name");
    const shift = row.querySelector("#shift");

    if(rowData["schedule"] == undefined)
    {
        job.innerHTML = "Job Name";
        shift.innerHTML = "08:00 AM - 04:00 PM";
    }
    else
    {
        job.innerHTML = rowData["job"];
        shift.innerHTML = rowData["schedule"];
    }


    //console.log(rowData);
}

function onShowHideButtonClicked(button)
{
    const icon = button.querySelector("i");

    if(icon.classList.contains("fa-eye"))
    {
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    }
    else
    {
        icon.classList.add("fa-eye");
        icon.classList.remove("fa-eye-slash");
    }

    storeCurrentFilters();

    updatePreviewPage();
}

function getShiftAdjustmentArray()
{
    const table = document.getElementById("shift-adjustment-table");
    const rows = table.querySelectorAll("#shift-adjustment-row");
    
    var newArr = new Array();
    for(var i = 0; i < rows.length; i++)
    {
        const name = rows[i].querySelector("#tm-name-dropdown").value; 
        const date = rows[i].querySelector("#date-dropdown").value;
        const job = rows[i].querySelector("#job-name").innerText;
        const shift = rows[i].querySelector("#shift").innerText;
        const icon = rows[i].querySelector("#show-hide-icon");
        const visible = icon.classList.contains("fa-eye");

        const rowData = {
            name : name,
            date : date,
            job : job,
            schedule : shift,
            visible : visible
        }; 
        
        newArr.push(rowData);
    }

    return newArr;
}