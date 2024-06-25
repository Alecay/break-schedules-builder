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

function setDropdownOptions(id, options, style)
{
    var selectList = document.getElementById(id);
    selectList.innerHTML="";

    for (var i = 0; i < options.length; i++)
    {
        var option = document.createElement("option");
        option.setAttribute("style", style);
        option.value = options[i];
        option.text = options[i];
        selectList.appendChild(option);
    }
}

function setDropdownOptionsFromSelect(selectList, options, style)
{
    selectList.innerHTML="";
    for (var i = 0; i < options.length; i++)
    {
        var option = document.createElement("option");
        option.setAttribute("style", style);
        option.value = options[i];
        option.text = options[i];
        selectList.appendChild(option);
    }
}

function getSelectedOptions(select)
{
    var result = [];
    var options = select && select.options;
    var opt;
  
    for (var i = 0, length = options.length; i < length; i++) 
    {
      opt = options[i]; 

      if (opt.selected) 
      {
        result.push(opt.value || opt.text);
      }
    }

    return result;
}

function setSelectedOptions(select, values)
{    
    var options = select && select.options;    
  
    for (var i = 0, length = options.length; i < length; i++) 
    {
      select.options[i].selected = values.indexOf(select.options[i].value) >= 0 || values.indexOf(select.options[i].text) >= 0;
    }    
}