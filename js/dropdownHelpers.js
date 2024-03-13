function createDropdown(parent, labelText, id, options)
{
    var label = document.createElement("label");
    label.setAttribute("for", id);
    label.innerHTML = labelText;

    parent.appendChild(label);

    var selectList = document.createElement("select");
    selectList.id = "id";
    selectList.name = "id";
    parent.appendChild(selectList);

    for (var i = 0; i < options.length; i++)
    {
        var option = document.createElement("option");
        option.value = options[i];
        option.text = options[i];
        selectList.appendChild(option);
    }
}

function setDropdownOptions(id, options)
{
    var selectList = document.getElementById(id);
    selectList.innerHTML="";

    for (var i = 0; i < options.length; i++)
    {
        var option = document.createElement("option");
        option.value = options[i];
        option.text = options[i];
        selectList.appendChild(option);
    }
}