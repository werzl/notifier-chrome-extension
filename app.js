document.getElementById("retrieveWorkflowsButton").addEventListener("click", retrieveWorkflows);

async function getData() {
    const url = "https://api.github.com/repos/werzl/notifier-chrome-extension/actions/runs";

    try {
      const response = await fetch(url, { headers: { "Authorization": "Bearer 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" }});

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      return json;

    } 
    catch (error) {
      console.error(error.message);
    }
  }

async function retrieveWorkflows() {
    console.log("retrieving workflows");
    
    let workflows = await getData();

    var structured_workflows = JSON.stringify(workflows);

    workflows.workflow_runs.forEach( e => {
      var icon = '';

      if (e.conculsion === 'undefined'){
        icon = '<i class="fi fi-rs-lightbulb-exclamation"></i>'
      }

      document.getElementById("workflows-table").innerHTML = '<tr><td>' + e.name + '</td><td>' + e.conclusion + '</td></tr>'
    })

     = structured_workflows
    


    console.log("retrieved workflows");
}

