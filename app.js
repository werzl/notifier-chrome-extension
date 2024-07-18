document.getElementById("retrieveWorkflowsButton").addEventListener("click", retrieveWorkflows);

async function getData() {
    const url = "https://api.github.com/repos/werzl/notifier-chrome-extension/actions/runs";

    try {
      const response = await fetch(url, { headers: { "Authorization": "Bearer " }});

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

    document.getElementById("workflows").innerText = JSON.stringify(workflows);

    console.log("retrieved workflows");
}

