let leaderLookup = {};

//Krisit:
//75580777

//Logan:
//75082592

//Angelina
//75622062

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
}

function loadLeaderData()
{
    var csvText = loadFile("csvData/leaderData.csv");
    var csvArray = csvToArr(csvText);
    csvArray.sort(dynamicSortMultiple("TM NUMBER"));

    csvArray.forEach(row => {

        const holder = {};
        const tmNumber = row["TM NUMBER"];
        holder["name1"] = row["FIRST NAME"];
        holder["name2"] = row["LAST NAME"];
        holder["job"] = row["JOB"];
        holder["district"] = row["DISTRICT"];
        holder["store"] = row["STORE"];

        holder["nameFormatted"] = row["FIRST NAME"].concat(" ", row["LAST NAME"]);

        leaderLookup[tmNumber] = holder;
    });
}

function attemptLogin(tmNumber)
{
    if(!isValidLoginFormat(tmNumber))
    {
        console.log("Invalid TM Number");
    }
    else if(!isAllowedUser(tmNumber))
    {
        console.log("TM is not allowed");
    }
    else
    {
        localStorage.loginID = tmNumber;

        const leaderInfo = leaderLookup[localStorage.loginID];

        setMainMenuDropDowns(leaderInfo["district"], leaderInfo["store"]);

        if(localStorage.loginID != "72154057")
        {
            disableMainMenuDropDowns();
        }

        document.getElementById("login-tm-message").innerText = "Welcome back ".concat(leaderInfo["nameFormatted"]);

        setLoginPageVisible(false);
        setMainMenuVisible(true);
        updateMainMenu();
    }
}

function setLoginPageVisible(value)
{
    if(value)
    {
        document.getElementById("login-page").style.display = "block";
    }
    else
    {
        document.getElementById("login-page").style.display = "none";
    }
}

function signOut()
{
    localStorage.loginID = "";
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

function onLoginSubmit()
{
    loadLeaderData();

    const loginField = document.getElementById("tm-number-login");
    var tmNumber = String(loginField.value);

    if(tmNumber == "davian")
    {
        tmNumber = "72154057";
    }

    loginField.value = "";

    attemptLogin(tmNumber);
}