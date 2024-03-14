let previewPageIndex = 0;

function setupMainMenu()
{
    console.log("Loading Main Menu");

    //Loading Templates
    const templatesElem = document.createElement("div");    
    templatesElem.setAttribute("class", "hidden");
    templatesElem.setAttribute("id", "templates");

    document.body.appendChild(templatesElem);

    var template = loadFile("breakSheet.html");
    var noCommTemplate = loadFile("breakSheetNoComm.html");        
    templatesElem.innerHTML = template.concat(noCommTemplate);

    const startSelector = document.getElementById("start-date-dropdown");
    startSelector.onchange = (event) => { startDateSelected(); };

    const endSelector = document.getElementById("end-date-dropdown");
    endSelector.value = datesArray[datesArray.length - 1];
    endSelector.onchange = (event) => { endDateSelected(); };

    const districtSelector = document.getElementById("district-dropdown");
    districtSelector.onchange = (event) => { updatePreviewPage() };

    const storeSelector = document.getElementById("store-dropdown");
    storeSelector.onchange = (event) => { updatePreviewPage() };

    var csvText = loadFile("csvData/scheduleData.csv");
    storeScheduleArray(csvText);

    var csvTextTraining = loadFile("csvData/trainingData.csv");
    storeTrainingArray(csvTextTraining);

    updateMainMenu();
}

function updateMainMenu()
{
    const  districtsArray = getDistricts();
    const storesArray = getStores();
    const datesArray = getDates();
    const areasArray = getAreas();

    document.getElementById("data-load-date").innerHTML = scheduleArray[0]["load"];

    document.getElementById("district-count").innerHTML = districtsArray.length;
    document.getElementById("store-count").innerHTML = storesArray.length;
    document.getElementById("area-count").innerHTML = areasArray.length;

    document.getElementById("dates-range").innerHTML = datesArray[0].concat(" - ", datesArray[datesArray.length - 1]);

    // console.log("Loaded ", scheduleArray.length, " rows of schedule data");
    // console.log(districtsArray);
    // console.log(storesArray);
    // console.log(datesArray);
    // console.log(areasArray);

    setDropdownOptions("district-dropdown", districtsArray);
    setDropdownOptions("store-dropdown", storesArray);

    setDropdownOptions("area-dropdown", areasArray);

    setDropdownOptions("start-date-dropdown", datesArray);
    setDropdownOptions("end-date-dropdown", datesArray);

    const endSelector = document.getElementById("end-date-dropdown");
    endSelector.value = datesArray[datesArray.length - 1];

    updatePreviewPage();
}

function updatePreviewPage()
{    
    const sheetsHolder = document.getElementById("sample-sheet-holder");
    sheetsHolder.innerHTML="";

    const district = document.getElementById("district-dropdown").value;
    const store = document.getElementById("store-dropdown").value;

    const length = getSelectedDates().length;

    if(previewPageIndex < 0)
    {
        previewPageIndex = 0;
    }       
    else if(previewPageIndex >= length)
    {
        previewPageIndex = length - 1;
    }

    createBreakSheets(sheetsHolder, getScheduleDataArray([district], [store], "Front Lanes", [getSelectedDates()[previewPageIndex]]));
}

function createPrintableSheets()
{
    const sheetsHolder = document.getElementById("print-sheet-holder");
    sheetsHolder.innerHTML="";

    const district = document.getElementById("district-dropdown").value;
    const store = document.getElementById("store-dropdown").value;

    createBreakSheets(sheetsHolder, getScheduleDataArray([district], [store], "Front Lanes", getSelectedDates()));
}

function printSelectedPages()
{
    createPrintableSheets();
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

    //console.log("Dates selected: ", newArr);

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