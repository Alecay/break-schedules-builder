let leaderArr = new Array();
let leaderJobs = new Array();
let leaderLookup = {};
let defaultAreasLookup = {};


//Leader Info Link
//https://greenfield.target.com/l/card/1734371/aoot1gm

function isLoggedIn()
{
    return localStorage.loginID != undefined && localStorage.loginID != "";
}

function getCurrentUserInfo()
{
    if(localStorage.loginID)
    {
        return leaderLookup[localStorage.loginID];
    }
    
    return {areas:"All Areas"};
}

//Sets up login page buttons and form, attempts login if saved in local storage
function setupLoginPage()
{
    loadLeaderData();
    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener('submit', function (event)
    {
        event.preventDefault();
        onLoginSubmit();
    });

    if(localStorage.loginID && localStorage.loginID != "")
        attemptLogin(localStorage.loginID);

    loadStoredDataFiles();
    
    var dString = "";
    districtsArray.forEach(district => 
    {
        dString = dString.concat(district, ", ");
    });

    dString = dString.substring(0, dString.length - 2);    
    document.getElementById("supported-districts").innerHTML = dString;    
}

function loadLeaderData(fromSubFolder = false)
{
    var csvText = loadFile(fromSubFolder ? "../csvData/leaderData.csv" : "csvData/leaderData.csv");
    leaderArr = csvToArr(csvText);
    leaderArr.sort(dynamicSortMultiple("TM NUMBER"));

    leaderJobs = getUniqueElements(leaderArr, "JOB");
    leaderJobs.sort();    

    csvText = loadFile(fromSubFolder ? "../csvData/defaultAreas.csv" : "csvData/defaultAreas.csv");
    const defaultAreasArr = csvToArr(csvText);

    defaultAreasLookup = {};
    defaultAreasArr.forEach(row => 
    {
        defaultAreasLookup[row["JOB"]] = row["AREAS"];
    });

    leaderArr.forEach(row => 
    {
        const holder = {};
        const tmNumber = row["TM NUMBER"];
        holder["number"] = tmNumber;
        holder["name1"] = row["FIRST NAME"];
        holder["name2"] = row["LAST NAME"];
        holder["job"] = row["JOB"];
        holder["district"] = row["DISTRICT"];
        holder["store"] = row["STORE"];

        holder["nameFormatted"] = row["FIRST NAME"].concat(" ", row["LAST NAME"]);
        holder["areas"] = defaultAreasLookup[row["JOB"]];
        leaderLookup[tmNumber] = holder;
    });    
}

function attemptLogin(tmNumber)
{    
    if(!isValidLoginFormat(tmNumber))
    {
        console.log("Invalid TM Number");
        setFailedLoginVisible(true);
    }
    else if(!isAllowedUser(tmNumber))
    {
        console.log("TM is not allowed");
        setFailedLoginVisible(true);
    }
    else
    {
        localStorage.loginID = tmNumber;        
        onLoginSuccessful();            
    }
}

function onLoginSuccessful()
{
    window.location.href = "mainMenu.html";
    console.log("Logged in");

    const leaderInfo = getCurrentUserInfo();

    dataLayer.push({
        'event' :'userData',
        'user_id' : leaderInfo["nameFormatted"].concat(" ", leaderInfo["number"])

    });
}

function setFailedLoginVisible(value)
{
    setElementVisible(document.getElementById("tm-number-login-invalid"), value);
}

//Also hides invalid login message
function setLoginPageVisible(value)
{
    setElementVisible(document.getElementById("login-page"), value);
    setFailedLoginVisible(false);
}

function signOut()
{
    localStorage.loginID = "";
    clearStoredFilters();

    window.location.href = "login.html";

    setMainMenuVisible(false);
    setLoginPageVisible(true);    
}

function isValidLoginFormat(tmNumber)
{    
    const valid = tmNumber.match(/^[0-9]+$/) != null && tmNumber.length == 8;
    return valid;
}

function isAllowedUser(tmNumber)
{
    const leaderInfo = leaderLookup[tmNumber];
    return leaderInfo != null && leaderInfo != undefined && leaderInfo != {};
}

function isDevUser(tmNumber)
{
    return tmNumber == "72154057";
}

function isCurrentUserADev()
{
    const leaderInfo = getCurrentUserInfo();
    return isDevUser(leaderInfo["number"]);
}

function onLoginSubmit()
{
    loadLeaderData();

    const loginField = document.getElementById("tm-number-login");
    var tmNumber = String(loginField.value);

    if(tmNumber == "davian")
    {
        tmNumber = "72154057";
    }

    if(tmNumber == "logan")
    {
        tmNumber = "75082592";
    }

    if(tmNumber == "kristi")
    {
        tmNumber = "75580777";
    }

    if(tmNumber == "angelina")
    {
        tmNumber = "75622062";
    }

    if(tmNumber == "victoria")
    {
        tmNumber = "76547957";
    }

    loginField.value = "";

    attemptLogin(tmNumber);
}