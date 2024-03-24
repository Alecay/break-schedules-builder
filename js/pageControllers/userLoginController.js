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
        attemptLogin(localStorage.loginID, "../../pages/dailyBreakSchedule.html");

    loadStoredDataFiles();
    
    var dString = "";
    districtsArray.forEach(district => 
    {
        dString = dString.concat(district, ", ");
    });

    dString = dString.substring(0, dString.length - 2);    
    document.getElementById("supported-districts").innerHTML = dString;    
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

    attemptLogin(tmNumber, "/pages/dailyBreakSchedule.html");
}

function signOut(pagePath = "login.html")
{
    localStorage.loginID = "";
    clearStoredFilters();

    window.location.href = pagePath;

    setMainMenuVisible(false);
    setLoginPageVisible(true);    
}