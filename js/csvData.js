let scheduleArray = new Array();
let trainingArray = new Array();

let trainingLookup = {};

let storesArray = new Array();
let districtsArray = new Array();
let datesArray = new Array();

let departmentsArray = new Array();
let rollupDepartmentsArray = new Array();
let jobsArray = new Array();

let departmentTree = {};

//https://greenfield.target.com/l/card/1732386/fi0bldv

//https://greenfield.target.com/l/card/1732305/wrrjw43

//https://greenfield.target.com/card/1732305?$filters@$ref_id=rjavftcxo5&field_name=job_area_a&obj_type=column&type=in&pattern@=Front%20Lanes&=Guest%20Services;&display_name=Job%20Area&dimension=job_area_a;&$type=in&dimension=region_format_short_n&display_name=Region&ref_id=rzhn4vt26l1&obj_type=column&pattern@=R300;;&$type=in&dimension=district_format_short_n&display_name=District&ref_id=r4uedak5j76&obj_type=column&pattern@=D322;;;&timePeriod$calendar_type=Fiscal&granularity=All&interval=(this.day.begin,%20this.week.end%20%3E%3E%201%20week)&type=relative

//https://greenfield.target.com/card/1732305?$filters@$ref_id=rjavftcxo5&field_name=job_area_a&obj_type=column&type=in&pattern@=Front%20Lanes;&display_name=Job%20Area&dimension=job_area_a;&$type=in&dimension=home_location&display_name=Store&ref_id=rxdxp8x5pcc&obj_type=column&pattern@=T1061;;;&timePeriod$calendar_type=Fiscal&granularity=All&interval=(this.day.begin,%20this.week.end%20%3E%3E%201%20week)&type=relative

function loadStoredDataFiles()
{
    console.log("Loaded data files");
    var csvText = loadFile("/break-schedules-builder/csvData/scheduleData.csv");
    storeScheduleArray(csvText, false);

    var csvTextTraining = loadFile("/break-schedules-builder/csvData/trainingData.csv");
    storeTrainingArray(csvTextTraining, false);    
}

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

function getRollupDepartments()
{
    return rollupDepartmentsArray;
}

function getDepartments()
{
    return departmentsArray;
}

function getJobs()
{
    return jobsArray;
}

function getTrainingCounts(tmNumber)
{
    return trainingLookup[tmNumber];
}

function getScheduleDataArray(districts, stores, jobs, dates)
{
    var filtered = getFilteredArray(scheduleArray, "district", districts, "store", stores, "job", jobs, "date", dates);
    filtered.sort(dynamicSortMultiple("district", "store", "date", "rollupDepartment",  "department", "START TIME"));
    return filtered;
}

function getDepartmentsTree()
{
    const tree = {};

    rollupDepartmentsArray.forEach(rollup => 
    {
        if(rollup == null || rollup == undefined)
        {
            return;
        }

        const holder = {};

        var filtered = getFilteredArray(scheduleArray, "rollupDepartment", [rollup]);

        const departments = getUniqueElements(filtered, "department");;
        //holder["departments"] = 

        departments.forEach(department => 
        {
            var filteredD = getFilteredArray(filtered, "department", [department]);
            const jobs = getUniqueElements(filteredD, "job");
            holder[department] = jobs;
        });        

        tree[rollup] = holder;
    });

    return tree;
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

function storeScheduleArray(data, shouldUpdateMainMenu = true) 
{    
    scheduleArray = csvToArr(data);
    scheduleArray.sort(dynamicSortMultiple("DISTRICT", "STORE", "SCHEDULED DATE", "ROLLUP DEPARTMENT",  "DEPARTMENT", "START TIME"));


    scheduleArray = getFormattedScheduleArray(scheduleArray);  
    updateTrainingNames();      

    districtsArray = getUniqueElements(scheduleArray, "district");
    storesArray = getUniqueElements(scheduleArray, "store");
    datesArray = getUniqueElements(scheduleArray, "date");

    rollupDepartmentsArray = getUniqueElements(scheduleArray, "rollupDepartment");
    departmentsArray = getUniqueElements(scheduleArray, "department");
    jobsArray = getUniqueElements(scheduleArray, "job");    

    rollupDepartmentsArray.sort();
    departmentsArray.sort();
    jobsArray.sort();

    departmentTree = getDepartmentsTree();

    //Set supported ditrctits    

    if(shouldUpdateMainMenu)
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

function storeTrainingArray(data, shouldUpdateMainMenu = true) 
{    
    trainingArray = csvToArr(data);
    trainingArray.sort(dynamicSortMultiple("TM NUMBER"));
    //console.log("Loaded ", trainingArray.length, " rows of training data");

    trainingLookup = {};

    var count = 0;

    trainingArray.forEach(person => 
    {        

        if(person["TM NUMBER"] == undefined || person["TM NUMBER"].length <= 0)
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

    //document.getElementById("training-count").innerHTML = count;

    updateTrainingNames();
    
    if(shouldUpdateMainMenu)
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

    //updatePreviewPage();
}

function getFormattedScheduleArray(array)
{
    var newArr = new Array();
    array.forEach((row) =>
    {        
        //To do: remove this check and update csvToArray to remove rows missing data
        if(row["TM NAME (NUM)"].length == 0 || row["LOAD DATE"] == undefined || row["LOAD DATE"].length != 8)
            return;

        var singleObj = {};

        singleObj["district"] = String(row["DISTRICT"]);
        singleObj["store"] = String(row["STORE"]);

        singleObj["area"] = String(row["JOB AREA"]);

        singleObj["department"] = String(row["DEPARTMENT"]);
        singleObj["rollupDepartment"] = String(row["ROLLUP DEPARTMENT"]);


        singleObj["name"] = String(row["TM NAME (NUM)"]).replace(/"/g, "");
        singleObj["trainingName"] = singleObj["name"];

        singleObj["job"] = String(row["JOB NAME"]);
        singleObj["schedule"] = String(row["SCHEDULE"]);
        
        singleObj["load"] = String(row["LOAD DATE"]);
        singleObj["tmNumber"] = String(row["TM NUMBER"]);
        singleObj["startTime"] = String(row["START TIME"]);

        var startTime = String(row["SCHEDULE"]).substring(0, 8);
        var endTime = String(row["SCHEDULE"]).substring(11, 19);

        singleObj["hours"] = timeDifference(endTime, startTime).toFixed(1);
        
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

        const closingSymbol = "c";//"🌙";//"*"
        singleObj["closing"] = (timeToHourValue(endTime) >= timeToHourValue("09:45 PM")) ? closingSymbol : "";


        if(singleObj["department"] == "Service and Engagement")
        {
            if(singleObj["job"] == "Service" || singleObj["job"] == "Order Pickup")
            {
                singleObj["department"] = "Guest Services";
            }
            else
            {
                singleObj["department"] = "Front Lanes";
            }
        }

        if(singleObj["job"] == "Order Pickup")
        {
            singleObj["department"] = "Order Pickup";
            singleObj["rollupDepartment"] = "Fulfillment";
        }

        newArr.push(singleObj);
    });

    newArr.sort(dynamicSortMultiple("district", "store", "date", "rollupDepartment",  "department", "startTime"));

    return newArr;
}

function getTrainingCount(store)
{    
    const storeSchedulues = getFilteredArray(scheduleArray, "store", [store]);    
    const tmNumbers = getUniqueElements(storeSchedulues, "tmNumber");

    var count = 0;
    tmNumbers.forEach(num => 
    {
        if(trainingLookup[num] != undefined && trainingLookup[num]["count"] > 0)
        {
            count++;
        }
    });


    return count;
}