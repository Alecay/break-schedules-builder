function setupTableResize(parent, referenceSize = 1000)
{
    beforePrintStyles = parent.style;
    const tables = parent.getElementsByTagName("table");    
    for (let i = 0; i < tables.length; i++) {
        const table = tables[i];

        window.addEventListener("resize", (event) =>
        {        
            resizeDivTables(parent);            
        });
    
        window.addEventListener("load", (event) =>
        {        
            resizeDivTables(parent);            
        });         
        
        window.addEventListener("beforeprint", (event) =>
        {        
            setDivTableSizes(parent);  
            console.log("print");
        });           

        window.addEventListener("afterprint", (event) =>
        {                             
            location.reload();      
            //resizeDivTables(parent);  
            console.log("after");
        }); 
    }

}

function resizeDivTables(container, referenceSize = 1000)
{            
    const windowWidth = document.documentElement.clientWidth;        
    const isPercent = container.style.width.includes("%");
    const containerWidth = isPercent ? parseInt(container.style.width) / 100 * windowWidth : parseInt(container.style.width);
    const containerRatio = containerWidth / referenceSize;            

    const tableDatas = container.getElementsByTagName("td");    
    for (let i = 0; i < tableDatas.length; i++) 
    {
        const t = tableDatas[i];

        t.style.fontSize = "";
        
        const style = getComputedStyle(t);
        const originalSize = parseInt(style.fontSize);
        //console.log("fSize:", originalSize, t);

        t.style.fontSize = String(originalSize * containerRatio).concat("px");                    
    }

    const tableHeaders = container.getElementsByTagName("th");    
    for (let i = 0; i < tableHeaders.length; i++) 
    {
        const t = tableHeaders[i];

        t.style.fontSize = "";
        
        const style = getComputedStyle(t);
        const originalSize = parseInt(style.fontSize);
        //console.log("fSize:", originalSize, t);

        t.style.fontSize = String(originalSize * containerRatio).concat("px");                    
    }

    //Also resize any object with the class tableResize
    const others = container.querySelectorAll(".tableResize"); 
                          
    for (let j = 0; j < others.length; j++) 
    {
        const oth = others[j];        

        oth.style.height = "";
        
        const style = getComputedStyle(oth);
        const originalSize = parseInt(style.height);                       

        oth.style.height = String(originalSize * containerRatio).concat("px");
    }
}

function setDivTableSizes(container, size = 1000)
{
    const windowWidth = document.documentElement.clientWidth;        
    const isPercent = container.style.width.includes("%");
    const containerWidth = isPercent ? parseInt(container.style.width) / 100 * windowWidth : parseInt(container.style.width);
    const containerRatio = size / containerWidth;
    
    container.style.width = String(size).concat("px");
    container.style.margin = "auto";

    const tableDatas = container.getElementsByTagName("td");    
    for (let i = 0; i < tableDatas.length; i++) 
    {
        const t = tableDatas[i];

        t.style.fontSize = "";
        
        const style = getComputedStyle(t);
        const originalSize = parseInt(style.fontSize);
        //console.log("fSize:", originalSize, t);

        t.style.fontSize = String(originalSize * containerRatio).concat("px");                    
    }

    const tableHeaders = container.getElementsByTagName("th");    
    for (let i = 0; i < tableHeaders.length; i++) 
    {
        const t = tableHeaders[i];

        t.style.fontSize = "";
        
        const style = getComputedStyle(t);
        const originalSize = parseInt(style.fontSize);
        //console.log("fSize:", originalSize, t);

        t.style.fontSize = String(originalSize * containerRatio).concat("px");                    
    }

    //Also resize any object with the class tableResize
    const others = container.querySelectorAll(".tableResize"); 
                          
    for (let j = 0; j < others.length; j++) 
    {
        const oth = others[j];        

        oth.style.height = "";
        
        const style = getComputedStyle(oth);
        const originalSize = parseInt(style.height);                       

        oth.style.height = String(originalSize * containerRatio).concat("px");
    }
}

function resizeTable(table)
{    
    const pageReferenceWidth = 1000;
    const windowWidth = document.documentElement.clientWidth;
    const scaleRatio = windowWidth / pageReferenceWidth;

    //const table = document.getElementById("shrink");
    const container = table.parentElement;
    const isPercent = container.style.width.includes("%");
    const containerWidth = isPercent ? parseInt(container.style.width) / 100 * windowWidth : parseInt(container.style.width);
    const containerRatio = containerWidth / windowWidth;            

    const useRatio = scaleRatio * containerRatio;      

    const tableDatas = table.getElementsByTagName("td");
    //const tableDatas = container.querySelectorAll("td");
    console.log(tableDatas);
    for (let i = 0; i < tableDatas.length; i++) 
    {
        const t = tableDatas[i];

        t.style.fontSize = "";
        
        const style = getComputedStyle(t);
        const originalSize = parseInt(style.fontSize);
        //console.log("fSize:", originalSize, t);

        t.style.fontSize = String(originalSize * useRatio).concat("px");                    
    }

    //Also resize any object with the class tableResize
    const others = container.querySelectorAll(".tableResize"); 
                          
    for (let j = 0; j < others.length; j++) 
    {
        const oth = others[j];        

        oth.style.height = "";
        
        const style = getComputedStyle(oth);
        const originalSize = parseInt(style.height);                       

        oth.style.height = String(originalSize * scaleRatio).concat("px");
    }
}