let previewPageIndex = 0;

//New link
//https://greenfield.target.com/l/card/1732305/m8zjhh4
//https://greenfield.target.com/l/card/1732305/n122hwz

function setupMainMenu()
{
    console.log("Setup Main Menu");

    //Loading Templates
    const templatesElem = document.createElement("div");    
    templatesElem.setAttribute("class", "hidden");
    templatesElem.setAttribute("id", "templates");

    document.body.appendChild(templatesElem);

    var template = loadFile("templates/breakSheet.html");
    var noCommTemplate = loadFile("templates/breakSheetNoComm.html");        
    var treeTemplate = loadFile("templates/checkboxTree.html");
    templatesElem.innerHTML = template.concat(noCommTemplate, treeTemplate);

    const startSelector = document.getElementById("start-date-dropdown");
    startSelector.onchange = (event) => { startDateSelected(); };

    const endSelector = document.getElementById("end-date-dropdown");
    endSelector.value = datesArray[datesArray.length - 1];
    endSelector.onchange = (event) => { endDateSelected(); };

    const districtSelector = document.getElementById("district-dropdown");
    districtSelector.onchange = (event) => { updateStoresDropDown(); updatePreviewPage(); };

    const storeSelector = document.getElementById("store-dropdown");
    storeSelector.onchange = (event) => { updatePreviewPage(); };

    loadStoredDataFiles();

    districtSelector.value = "D322";
    storeSelector.value = "T1061";

    const treeHolder = document.getElementById("areas-tree-holder");
    treeHolder.innerHTML ="";
    createCheckboxTree(treeHolder, departmentTree, "test-tree");

    window.onafterprint = function()
    {
        setMainMenuVisible(true);
    };

    window.addEventListener("load", function() 
    {
        if(isLoggedIn())
            storeCurrentFilters();
    });

    loadUsersDefaultFilters();
    updateMainMenu(); 
}

function updateMainMenu()
{
    console.log("Updated main menu");
    const  districtsArray = getDistricts();
    const storesArray = getStores();
    const datesArray = getDates();
    const jobsArray = getJobs();
    const jobs = getTreeSelectedValues("areas-tree-holder");

    document.getElementById("data-load-date").innerHTML = scheduleArray[0]["load"];

    document.getElementById("district-count").innerHTML = districtsArray.length;
    document.getElementById("store-count").innerHTML = storesArray.length;
    document.getElementById("job-count").innerHTML = jobsArray.length;

    document.getElementById("dates-range").innerHTML = datesArray[0].concat(" - ", datesArray[datesArray.length - 1]);     

    setDropdownOptions("district-dropdown", districtsArray); 
    updateStoresDropDown();        

    setDropdownOptions("start-date-dropdown", datesArray);
    setDropdownOptions("end-date-dropdown", datesArray);

    const endSelector = document.getElementById("end-date-dropdown");
    endSelector.value = datesArray[datesArray.length - 1];    

    loadStoredFilters();
    updatePreviewPage();

    const trainingCount = getTrainingCount(sessionStorage.selectedStore);
    document.getElementById("training-count").innerText = trainingCount == 0 ? "Not Loaded" : trainingCount;
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
    //console.log("Updating Preview Page");    

    const sheetsHolder = document.getElementById("sample-sheet-holder");
    sheetsHolder.innerHTML="";

    const district = document.getElementById("district-dropdown").value;
    const store = document.getElementById("store-dropdown").value;
    const jobs = getTreeSelectedValues("areas-tree-holder");
    const startDate = document.getElementById("start-date-dropdown").value;
    const endDate = document.getElementById("end-date-dropdown").value;

    document.getElementById("custom-link").setAttribute("href", getScheduleDataLink(store));


    sessionStorage.selectedDistrict = district;
    sessionStorage.selectedStore = store;
    sessionStorage.selectedAreas = jobs;
    sessionStorage.startDate = startDate;
    sessionStorage.endDate = endDate;

    const length = getSelectedDates().length;

    if(previewPageIndex < 0)
    {
        previewPageIndex = 0;
    }       
    else if(previewPageIndex >= length)
    {
        previewPageIndex = length - 1;
    }

    const date = getSelectedDates()[previewPageIndex];

    const useComm = store == "T1061" && (jobs.includes("Service") || jobs.includes("Checkout"));
    createBreakSheets(sheetsHolder, getScheduleDataArray([district], [store], jobs, [date]), useComm);
}

function createPrintableSheets()
{
    const sheetsHolder = document.getElementById("print-sheet-holder");
    sheetsHolder.innerHTML="";

    const district = document.getElementById("district-dropdown").value;
    const store = document.getElementById("store-dropdown").value;
    const jobs = getTreeSelectedValues("areas-tree-holder");
    const dates = getSelectedDates();

    const useComm = store == "T1061" && (jobs.includes("Service") || jobs.includes("Checkout"));
    createBreakSheets(sheetsHolder, getScheduleDataArray([district], [store], jobs, dates), useComm);
}

function printSelectedPages()
{
    createPrintableSheets();
    setMainMenuVisible(false);
    print();
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

    const dates = getDates();
    const startIndex = dates.indexOf(startSelector.value);
    const endIndex = dates.indexOf(endSelector.value);

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

    sessionStorage.selectedDistrict = leaderInfo["district"];
    sessionStorage.selectedStore = leaderInfo["store"];

    const index = dates.indexOf(getTodayDate());
    sessionStorage.startDate = (index >= 0) ? dates[index] : dates[0];

    sessionStorage.endDate = dates[dates.length - 1];
    sessionStorage.selectedAreas = leaderInfo["areas"];

    loadStoredFilters();
}

function loadStoredFilters()
{
    console.log("Loading stored filters");
    //Set Defulat store to T1061
    const districtSelector = document.getElementById("district-dropdown");
    const storeSelector = document.getElementById("store-dropdown");    
    const startSelector = document.getElementById("start-date-dropdown");
    const endSelector = document.getElementById("end-date-dropdown");

    const stored = 
    {
        selectedDistrict:sessionStorage.selectedDistrict,
        selectedStore:sessionStorage.selectedStore,
        selectedAreas:sessionStorage.selectedAreas,
        startDate:sessionStorage.startDate,
        endDate:sessionStorage.endDate
    }

    //console.log(stored);

    if(sessionStorage.selectedDistrict != undefined && sessionStorage.selectedDistrict != "")
    {
        districtSelector.value = sessionStorage.selectedDistrict;
    }

    updateStoresDropDown();

    if(sessionStorage.selectedStore != undefined && sessionStorage.selectedStore != "")
    {
        storeSelector.value = sessionStorage.selectedStore;
    }

    if(sessionStorage.selectedAreas != undefined && sessionStorage.selectedAreas != "")
    {
        setTreeSelectedValues("areas-tree-holder", getAllTreeChildLabels("areas-tree-holder", sessionStorage.selectedAreas), false);
    }

    if(sessionStorage.startDate != undefined && sessionStorage.startDate != "")
    {
        startSelector.value = sessionStorage.startDate;
    }

    if(sessionStorage.endDate  != undefined && sessionStorage.endDate != "")
    {
        endSelector.value = sessionStorage.endDate;
    }
}

function storeCurrentFilters()
{
    console.log("Storing current filters");
    const districtSelector = document.getElementById("district-dropdown");
    const storeSelector = document.getElementById("store-dropdown");    
    const startSelector = document.getElementById("start-date-dropdown");
    const endSelector = document.getElementById("end-date-dropdown");
    const areas = getTreeSelectedValues("areas-tree-holder");

    sessionStorage.selectedDistrict = districtSelector.value;
    sessionStorage.selectedStore = storeSelector.value;
    sessionStorage.startDate = startSelector.value;
    sessionStorage.endDate = endSelector.value;
    sessionStorage.selectedAreas = areas;
}

function clearStoredFilters()
{
    console.log("Clearing stored filters");

    sessionStorage.selectedDistrict = "";
    sessionStorage.selectedStore = "";
    sessionStorage.startDate = "";
    sessionStorage.endDate = "";
    sessionStorage.selectedAreas = "";
}

function setMainMenuDropDowns(district, store, areas)
{
    sessionStorage.selectedStore = store;
    sessionStorage.selectedDistrict = district;
    sessionStorage.selectedAreas = areas;

    loadStoredFilters();
}

function setMainMenuDropdownsActive(value)
{
    const districtSelector = document.getElementById("district-dropdown");
    const storeSelector = document.getElementById("store-dropdown");

    districtSelector.disabled = !value;
    storeSelector.disabled = !value;
}

function setMainMenuVisible(value)
{
    setElementVisible(document.getElementById("main-menu"), value);
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