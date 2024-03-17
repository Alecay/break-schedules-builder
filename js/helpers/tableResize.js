function setupTableResize(parent)
{
    const tables = parent.getElementsByTagName("table");    
    for (let i = 0; i < tables.length; i++) {
        const table = tables[i];

        window.addEventListener("resize", (event) =>
        {        
            resizeTable(table);
        });
    
        window.addEventListener("load", (event) =>
        {        
            resizeTable(table);
        });        
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

    const text = document.getElementsByTagName("td");                        
    for (let i = 0; i < text.length; i++) 
    {
        const t = text[i];

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
        console.log(oth);

        oth.style.height = "";
        
        const style = getComputedStyle(oth);
        const originalSize = parseInt(style.height);                       

        oth.style.height = String(originalSize * scaleRatio).concat("px");
    }
}