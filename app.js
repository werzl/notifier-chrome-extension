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

function retrieveWorkflows() {
    console.log("test");
    
    // let workflows = getData();

    // document.getElementById("workflows").innerText = workflows;
}

