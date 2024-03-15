let previewPageIndex = 0;

//New link
//https://greenfield.target.com/l/card/1732305/m8zjhh4
//https://greenfield.target.com/l/card/1732305/n122hwz

function setupMainMenu()
{
    //console.log("Loading Main Menu");

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

    var csvText = loadFile("csvData/scheduleData.csv");
    storeScheduleArray(csvText);

    var csvTextTraining = loadFile("csvData/trainingData.csv");
    storeTrainingArray(csvTextTraining);

    districtSelector.value = "D322";
    storeSelector.value = "T1061";

    createCheckboxTree(document.getElementById("areas-tree-holder"), departmentTree, "test-tree");

    window.onafterprint = function()
    {
        setMainMenuVisible(true);
    };

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
    //console.log(jobs);

    document.getElementById("data-load-date").innerHTML = scheduleArray[0]["load"];

    document.getElementById("district-count").innerHTML = districtsArray.length;
    document.getElementById("store-count").innerHTML = storesArray.length;
    document.getElementById("job-count").innerHTML = jobsArray.length;

    document.getElementById("dates-range").innerHTML = datesArray[0].concat(" - ", datesArray[datesArray.length - 1]);

    // console.log("Loaded ", scheduleArray.length, " rows of schedule data");
    // console.log(districtsArray);
    // console.log(storesArray);
    // console.log(datesArray);
    // console.log(areasArray);      

    setDropdownOptions("district-dropdown", districtsArray); 
    updateStoresDropDown();        

    setDropdownOptions("start-date-dropdown", datesArray);
    setDropdownOptions("end-date-dropdown", datesArray);

    const endSelector = document.getElementById("end-date-dropdown");
    endSelector.value = datesArray[datesArray.length - 1];


    setDefaultDropdowns();

    updatePreviewPage();
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
    sessionStorage.selectedJobs = jobs;
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

    createBreakSheets(sheetsHolder, getScheduleDataArray([district], [store], jobs, [date]), store == "T1061");
}

function createPrintableSheets()
{
    const sheetsHolder = document.getElementById("print-sheet-holder");
    sheetsHolder.innerHTML="";

    const district = document.getElementById("district-dropdown").value;
    const store = document.getElementById("store-dropdown").value;
    const jobs = getTreeSelectedValues("areas-tree-holder");
    const dates = getSelectedDates();

    createBreakSheets(sheetsHolder, getScheduleDataArray([district], [store], jobs, dates), store == "T1061");
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

function setDefaultDropdowns()
{
    //Set Defulat store to T1061
    const districtSelector = document.getElementById("district-dropdown");
    const storeSelector = document.getElementById("store-dropdown");    
    const startSelector = document.getElementById("start-date-dropdown");
    const endSelector = document.getElementById("end-date-dropdown");

    if(sessionStorage.selectedDistrict)
    {
        districtSelector.value = sessionStorage.selectedDistrict;
    }
    else
    {
        districtSelector.value = "D322";
    }

    updateStoresDropDown();

    if(sessionStorage.selectedStore)
    {
        storeSelector.value = sessionStorage.selectedStore;
    }
    else
    {
        storeSelector.value = "T1061";
    }

    // if(sessionStorage.selectedAreas)
    // {
    //     setSelectedOptions(areaSelector, sessionStorage.selectedAreas);
    // }
    // else
    // {
    //     setSelectedOptions(areaSelector, ["Front Lanes", "Guest Services"]);
    // }

    if(sessionStorage.startDate)
    {
        startSelector.value = sessionStorage.startDate;
    }

    if(sessionStorage.endDate)
    {
        endSelector.value = sessionStorage.endDate;
    }
}

function setMainMenuDropDowns(district, store)
{
    sessionStorage.selectedStore = store;
    sessionStorage.selectedDistrict = district;

    setDefaultDropdowns();
}

function disableMainMenuDropDowns()
{
    const districtSelector = document.getElementById("district-dropdown");
    const storeSelector = document.getElementById("store-dropdown");

    districtSelector.disabled = true;
    storeSelector.disabled = true;
}

function setMainMenuVisible(value)
{
    if(value)
    {
        document.getElementById("main-menu").style.display = "block";
        console.log("Setting main menu visible");
    }
    else
    {
        document.getElementById("main-menu").style.display = "none";
    }
}