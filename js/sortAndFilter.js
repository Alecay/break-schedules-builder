//Input array then key and values array pairs
function getFilteredArray()
{
    var props = arguments;

    if(props.length < 3 || props.length % 2 != 1)
        return;

    const array = props[0];

    var newArr = new Array();

    array.forEach(element => 
    {
        var shouldAdd = true;
        for (let index = 1; index < props.length; index += 2) 
        {
            const key = props[index];
            const values = props[index + 1];

            var hasValue = false;
            for (let valIndex = 0; valIndex < values.length; valIndex++) 
            {            
                if(element[key] == values[valIndex])
                {
                    hasValue = true;
                    break;
                }
            }

            if(!hasValue)
            {
                shouldAdd = false;
                break;
            }
        }

        if(shouldAdd)
            newArr.push(element);
    });

    //console.log("Got filtered array with ", newArr.length, " elements");    

    return newArr;    
}

function getUniqueElements(array, key)
{
    var newArr = new Array();

    array.forEach(element => 
    {
        if(element !== undefined && !(element[key] === undefined) && element[key] != "undefined" && !newArr.includes(element[key]))
        {
            newArr.push(element[key]);
        }
    });

    return newArr;
}

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function dynamicSortMultiple() 
{
    /*
     * save the arguments object as it will be overwritten
     * note that arguments object is an array-like object
     * consisting of the names of the properties to sort by
     */
    var props = arguments;
    return function (obj1, obj2) {
        var i = 0, result = 0, numberOfProperties = props.length;
        /* try getting a different result from 0 (equal)
         * as long as we have extra properties to compare
         */
        while(result === 0 && i < numberOfProperties) {
            result = dynamicSort(props[i])(obj1, obj2);
            i++;
        }
        return result;
    }
}