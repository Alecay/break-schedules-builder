let scheduleArray = new Array();
let trainingArray = new Array();

let trainingLookup = {};

let storesArray = new Array();
let districtsArray = new Array();
let datesArray = new Array();
let areasArray = new Array();

//https://greenfield.target.com/l/card/1732386/fi0bldv

//https://greenfield.target.com/l/card/1732305/wrrjw43

function getStores()
{
    return storesArray;
}

function getDistricts()
{
    return districtsArray;
}

function getDates()
{
    return datesArray;
}

function getAreas()
{
    return areasArray;
}

function getTrainingCounts(tmNumber)
{
    return trainingLookup[tmNumber];
}

function getScheduleDataArray(districts, stores, areas, dates)
{
    return getFilteredArray(scheduleArray, "district", districts, "store", stores, "date", dates);
}

function readScheduleDataFile(event) {
    var file = event.target.files[0];
    if (file) {
      new Promise(function(resolve, reject) 
      {
        var reader = new FileReader();
        reader.onload = function (evt) 
        {
          resolve(evt.target.result);
        };

        reader.readAsText(file);
        reader.onerror = reject;
      })
      .then(storeScheduleArray)
      .catch(function(err) 
      {
        console.log(err)
      });
    }
}

function storeScheduleArray(data) 
{    
    scheduleArray = csvToArr(data);
    scheduleArray.sort(dynamicSortMultiple("DISTRICT", "STORE", "SCHEDULED DATE", "JOB AREA", "START TIME"));


    scheduleArray = getFormattedScheduleArray(scheduleArray);  
    updateTrainingNames();      

    districtsArray = getUniqueElements(scheduleArray, "district");
    storesArray = getUniqueElements(scheduleArray, "store");
    datesArray = getUniqueElements(scheduleArray, "date");
    areasArray = getUniqueElements(scheduleArray, "area");

    updateMainMenu();
}

function readTrainingDataFile(event) 
{
    var file = event.target.files[0];
    if (file) {
      new Promise(function(resolve, reject) 
      {
        var reader = new FileReader();
        reader.onload = function (evt) 
        {
          resolve(evt.target.result);
        };

        reader.readAsText(file);
        reader.onerror = reject;
      })
      .then(storeTrainingArray)
      .catch(function(err) 
      {
        console.log(err)
      });
    }
}

function storeTrainingArray(data) 
{    
    trainingArray = csvToArr(data);
    trainingArray.sort(dynamicSortMultiple("TM NUMBER"));
    //console.log("Loaded ", trainingArray.length, " rows of training data");

    trainingLookup = {};

    var count = 0;

    trainingArray.forEach(person => 
    {        
        if(person["TM NUMBER"].length <= 0)
        {
            return;
        }

        trainingLookup[person["TM NUMBER"]] = 
        {   
            count: person["PERSONAL COUNT"],
            overdue: person["OVERDUE COUNT"]
        };

        count++;
    });    

    document.getElementById("training-count").innerHTML = count;

    updateTrainingNames();
    updateMainMenu();
}

function updateTrainingNames()
{
    scheduleArray.forEach(row => 
    {
        row["trainingName"] = row["name"]; 
        var training = getTrainingCounts(row["tmNumber"]);
        if(!(training === undefined) && training["count"] > 0)
        {
            row["trainingName"] = row["name"].concat(" T:", training["count"]);

            if(training["overdue"] > 0)
            {
                row["trainingName"] = row["trainingName"].concat("*");
            }
        } 
    });
}

function getFormattedScheduleArray(array)
{
    var newArr = new Array();
    array.forEach((row) =>
    {        

        if(row["TM NAME (NUM)"].length == 0)
            return;

        var singleObj = {};

        singleObj["district"] = String(row["DISTRICT"]);
        singleObj["store"] = String(row["STORE"]);


        singleObj["name"] = String(row["TM NAME (NUM)"]).replace(/"/g, "");
        singleObj["trainingName"] = singleObj["name"];

        singleObj["job"] = String(row["JOB NAME"]);
        singleObj["schedule"] = String(row["SCHEDULE"]);
        singleObj["area"] = String(row["JOB AREA"]);
        singleObj["load"] = String(row["LOAD DATE"]);
        singleObj["tmNumber"] = String(row["TM NUMBER"]);
        singleObj["startTime"] = String(row["START TIME"]);

        var startTime = String(row["SCHEDULE"]).substring(0, 8);
        var endTime = String(row["SCHEDULE"]).substring(11, 19);

        singleObj["hours"] = (timeToHourValue(endTime) - timeToHourValue(startTime)).toFixed(1);
        
        const break1Threshold = 4;
        const break2Threshold = 6;
        const break3Threshold = 7;

        //Calcalute breaks
        if(singleObj["hours"] >= break1Threshold)
        {
            if(singleObj["hours"] < break2Threshold)
            {
                singleObj["break1"] = shiftTime(startTime, Math.round(singleObj["hours"] / 2));
            }
            else
            {
                singleObj["break1"] = shiftTime(startTime, 2);
            }
            
        }
        else
        {
            singleObj["break1"] = "X";
        }

        if(singleObj["hours"] >= break2Threshold)
        {
            singleObj["break2"] = shiftTime(startTime, 4);
        }
        else
        {
            singleObj["break2"] = "X";
        }

        if(singleObj["hours"] >= break3Threshold)
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



        newArr.push(singleObj);
    });

    return newArr;
}