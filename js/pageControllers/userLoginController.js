//Sets up login page buttons and form, attempts login if saved in local storage
function setupUserLoginPage()
{
    loadLeaderData();
    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener('submit', function (event)
    {
        console.log("Submit");
        event.preventDefault();
        onTMLoginSubmit();
    });

    const guestLoginForm = document.getElementById("guest-login-form");
    guestLoginForm.addEventListener('submit', function (event)
    {
        console.log("Guest Submit");
        event.preventDefault();
        //onTMLoginSubmit();
    });

    if(localStorage.loginID && localStorage.loginID != "")
        attemptLogin(localStorage.loginID, "/break-schedules-builder/pages/dailyBreakSchedule.html");

    loadStoredDataFiles();
    
    var tString = "";
    storesArray.forEach(store => 
    {
        tString = tString.concat(store, ", ");
    });

    tString = tString.substring(0, tString.length - 2);    
    document.getElementById("supported-districts").innerHTML = tString;      
}

function onTMLoginSubmit()
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

    attemptLogin(tmNumber, "/break-schedules-builder/pages/dailyBreakSchedule.html");
}