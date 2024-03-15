let shouldUpdateMainMenu = true;


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
        checkBoxes[i].addEventListener("click", onDepartClicked, false);
    }
}

function onDepartClicked(event)
{
    const children = this.parentElement.querySelectorAll(".checkbox");
    if(children.length <= 1)
    {
        return;
    }

    shouldUpdateMainMenu = false;
    for (let j = 1; j < children.length; j++) 
    {
        if(children[j].checked != children[0].checked)
        {
            children[j].removeEventListener("click", onDepartClicked, false);
            children[j].click();
            children[j].addEventListener("click", onDepartClicked, false);
        }
            
    }

    shouldUpdateMainMenu = true;

    if(shouldUpdateMainMenu)
    {
        updateMainMenu();
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
    var checkboxes = parent.querySelectorAll(".checkbox");
    

    const values = new Array();

    checkboxes.forEach(checkbox => 
    {
        if(checkbox.checked == false)
        {
            return;
        }

        var labels = checkbox.parentElement.querySelectorAll("#label");

        labels.forEach(label => 
        {
            //console.log(label);
            if(label.innerText != undefined && label.innerText != "" && !values.includes(label.innerText))
            {
                values.push(label.innerText);
            }
        });
    });

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