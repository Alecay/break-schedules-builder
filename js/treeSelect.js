function createCheckboxTree(parent, tree, id)
{      
    const treeElement = createNewTree();
    const rollupDepartmentBranch = treeElement.querySelector("#rollup-department-branch");
    const rollupDepartment = treeElement.querySelector("#rollup-department");

    const rollups = Object.keys(tree);
    rollups.forEach(rollup => 
    {
        const departments = Object.keys(tree[rollup]);
        const clone = rollupDepartment.cloneNode(true);        

        clone.querySelector(".caret").innerText = rollup;
        rollupDepartmentBranch.appendChild(clone);

        const departmentBranchElem = clone.querySelector("#department-branch");
        const departmentElem = clone.querySelector("#department");

        departments.forEach(department => 
        {            
            const jobs = tree[rollup][department];
            const clone = departmentElem.cloneNode(true);        
    
            clone.querySelector(".caret").innerText = department;
            departmentBranchElem.appendChild(clone);

            const jobBranchElem = clone.querySelector("#job-branch");
            const jobElem = clone.querySelector("#job");

            jobs.forEach(job => 
            {                                
                const clone = jobElem.cloneNode(true);        
                    
                clone.querySelector("#label").innerText = job;
                jobBranchElem.appendChild(clone);
            });

            jobBranchElem.removeChild(jobElem);
        });

        departmentBranchElem.removeChild(departmentElem);
    });

    rollupDepartmentBranch.removeChild(rollupDepartment);

    parent.appendChild(treeElement);

    updateOnClicks();
    
}

function updateOnClicks()
{
    var toggler = document.getElementsByClassName("caret");
    var i;

    for (i = 0; i < toggler.length; i++) 
    {
        toggler[i].addEventListener("click", function() {
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("caret-down");
        });
    }

    var checkBoxes = document.getElementsByClassName("checkbox");

    for (i = 0; i < checkBoxes.length; i++) 
    {
        checkBoxes[i].removeEventListener("click", onAreaSelectorClicked, false);
        checkBoxes[i].addEventListener("click", onAreaSelectorClicked, false);
    }
}

function onAreaSelectorClicked(event)
{
    const children = this.parentElement.querySelectorAll(".checkbox");
    if(children.length <= 1)
    {
        storeCurrentFilters();
        updatePreviewPage();
        return;
    }

    let shouldUpdatePreviewPage = false;
    for (let j = 1; j < children.length; j++) 
    {
        if(children[j].checked != children[0].checked)
        {
            children[j].removeEventListener("click", onAreaSelectorClicked, false);
            children[j].click();
            children[j].addEventListener("click", onAreaSelectorClicked, false);
        }
            
    }

    shouldUpdatePreviewPage = true;

    if(shouldUpdatePreviewPage)
    {
        storeCurrentFilters();
        updatePreviewPage();
    }
}

function createNewTree()
{
    const node = document.getElementById("templates");
    const tree = node.querySelector("#tree-template").cloneNode(true);    
    return tree;
}

function getTreeSelectedValues(parentID)
{
    const parent = document.getElementById(parentID);        
    const values = new Array();

    var labels = parent.querySelectorAll("#label");

    labels.forEach(label => 
    {
        const checkbox = label.parentElement.querySelector(".checkbox");        
        //console.log(label);
        if(checkbox.checked && label.innerText != undefined && label.innerText != "" && !values.includes(label.innerText))
        {            
            values.push(label.innerText);
        }
    });

    return values;
}

function setTreeSelectedValues(parentID, values, triggerOnClick)
{
    const parent = document.getElementById(parentID);            

    var labels = parent.querySelectorAll("#label");    

    labels.forEach(label => 
    {
        const checkbox = label.parentElement.querySelector(".checkbox");        

        if(values.includes(label.innerText))
        {
            if(!checkbox.checked)
            {
                if(!triggerOnClick)
                {
                    checkbox.removeEventListener("click", onAreaSelectorClicked, false);
                    checkbox.click();
                    checkbox.addEventListener("click", onAreaSelectorClicked, false);
                }
                else
                {
                    checkbox.click();
                }                
            }                
        }
        else
        {
            if(checkbox.checked)
            {
                if(!triggerOnClick)
                {
                    checkbox.removeEventListener("click", onAreaSelectorClicked, false);
                    checkbox.click();
                    checkbox.addEventListener("click", onAreaSelectorClicked, false);
                }
                else
                {
                    checkbox.click();
                }   
            }                
        }
    });
}

function getAllTreeChildLabels(parentID, rootLabel, includeRootLabel = true)
{
    const parent = document.getElementById(parentID);  
    var labels = parent.querySelectorAll("#label"); 
    const values = new Array();

    labels.forEach(label => 
    {        
        if(label.innerText != rootLabel)
        {
            return;
        }

        //console.log("Found root");

        const children = label.parentElement.querySelectorAll("#label");        
        children.forEach(child => 
        {
            if(child.innerText != undefined && child.innerText != "" && !values.includes(child.innerText))
            {
                if(!includeRootLabel && child.innerText == rootLabel)
                {
                    return;                    
                }

                values.push(child.innerText);
            }
        });
    });  

    return values;
}