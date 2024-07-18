document
    .getElementById("retrieveWorkflowsButton")
    .addEventListener("click", () => pollForPipelineUpdate(''));

async function getData(url, personalAccessToken) {
    try {
        const response = await fetch(url, {
            headers: {
                Authorization:
                    `Bearer ${personalAccessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error.message);
    }
}

async function retrieveWorkflows(fullName, personalAccessToken) {
    console.log("retrieving workflows");

    var workflowRuns = await getData(`https://api.github.com/repos/${fullName}/actions/runs?per_page=100`, personalAccessToken);

    var latestWorkflowRunNumbers = workflowRuns.workflow_runs.map((workflow) => {
        return workflow.run_number;
    });

    var latestRun = Math.max(...latestWorkflowRunNumbers);

    var workflows = workflowRuns.workflow_runs.filter((workflow) => workflow.run_number === latestRun).map((workflow) => {
        return {
            name: workflow.repository.name,
            repo: fullName,
            status: workflow.status,
            conclusion: workflow.conclusion
        };
    });

    console.log("retrieved workflows");

    return workflows;
}

async function retrieveRepos(personalAccessToken) {
    console.log("retrieving repositories");

    var repos = await getData("https://api.github.com/user/repos?per_page=100", personalAccessToken);

    document.getElementById("workflows-table").innerHTML = "";
    
    await repos.forEach(async (repo) => {
        workflows = await retrieveWorkflows(repo.full_name);

        workflows.forEach((workflow) => {
            document.getElementById("workflows-table").innerHTML += '<tr><td>' + workflow.name + '</td><td>' + workflow.status + '</td></tr>';
        });
    })

    console.log("retrieved repositories");

    setTimeout(async () => await retrieveRepos(personalAccessToken), 5000);
}

function pollForPipelineUpdate(personalAccessToken) {
    setTimeout(async () => await retrieveRepos(personalAccessToken), 5000);
}