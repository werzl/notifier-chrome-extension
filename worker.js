importScripts("notifications.js");

let globalWorkflows = [];
let polling = false;

async function getData(url, personalAccessToken) {
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${personalAccessToken}`,
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
    var workflows = [];

    var allWorkflowRuns = await getData(
        `https://api.github.com/repos/${fullName}/actions/runs?per_page=100`,
        personalAccessToken
    );

    var grouped = Object.groupBy(
        allWorkflowRuns.workflow_runs,
        ({ name }) => name
    );

    for (const [_, value] of Object.entries(grouped)) {
        var latestWorkflowRunNumbers = value.map((workflow) => {
            return workflow.run_number;
        });

        var latestRun = Math.max(...latestWorkflowRunNumbers);

        var newWorkflow = value.find(
            (workflow) => workflow.run_number == latestRun
        );

        workflows.push({
            id: newWorkflow.workflow_id,
            name: newWorkflow.name,
            repo: newWorkflow.repository.name,
            repoFullName: newWorkflow.repository.full_name,
            status: newWorkflow.status,
            conclusion: newWorkflow.conclusion,
            url: newWorkflow.html_url,
            branch: newWorkflow.head_branch,
            title: newWorkflow.display_title,
            runNumber: newWorkflow.run_number,
            runAttempt: newWorkflow.run_attempt,
        });
    }

    return workflows;
}

async function retrieveRepos(personalAccessToken) {
    console.info("retrieving repositories");

    var repos = await getData(
        "https://api.github.com/user/repos?per_page=100",
        personalAccessToken
    );

    // document.getElementById("workflows-table").innerHTML = "";

    // await repos.forEach(async (repo) => {
    //     workflows = await retrieveWorkflows(repo.full_name, personalAccessToken);

    //     workflows.forEach((workflow) => {
    //         document.getElementById("workflows-table").innerHTML += '<tr><td>' + workflow.name + '</td><td>' + workflow.status + '</td></tr>';
    //     });
    // })

    let updatedWorkflows = [];

    for (const repo of repos) {
        workflows = await retrieveWorkflows(
            repo.full_name,
            personalAccessToken
        );

        updatedWorkflows = updatedWorkflows.concat(workflows);
    }

    console.info("found repositories:", repos);

    return updatedWorkflows;
}

async function pollForPipelineUpdate(personalAccessToken) {
    console.info("polling...");

    var updatedWorkflows = await retrieveRepos(personalAccessToken);

    console.info("found workflows: ", updatedWorkflows);

    for (const w of globalWorkflows) {
        var updatedWorkflow = updatedWorkflows.find((uw) => w.id == uw.id);

        if (
            updatedWorkflow.conclusion !== w.conclusion ||
            updatedWorkflow.runNumber > w.runNumber ||
            updatedWorkflow.runAttempt > w.runAttempt
        ) {
            console.info(
                `workflow: '${updatedWorkflow.name}' in repo: '${updatedWorkflow.repoFullName}' state has changed, sending notification`
            );

            var iconUrl = null;
            var title = "";

            switch (updatedWorkflow.conclusion) {
                case "failure":
                    iconUrl = icons.failed;
                    title = `GitHub Action '${updatedWorkflow.name}' failed`;
                    break;
                case "success":
                    iconUrl = icons.success;
                    title = `GitHub Action '${updatedWorkflow.name}' succeeded`;
                    break;
                default:
                    iconUrl = icons.inProgress;
                    title = `GitHub Action '${updatedWorkflow.name}' queued`;
                    break;
            }

            await sendNotification(
                title,
                `Branch: ${updatedWorkflow.branch}\nTitle: ${updatedWorkflow.title}\nRepo: ${updatedWorkflow.repoFullName}`,
                iconUrl
            );
        }
    }

    globalWorkflows = updatedWorkflows;

    console.info("polling complete, waiting 5 seconds...\n\n");

    setTimeout(
        async () => await pollForPipelineUpdate(personalAccessToken),
        5000
    );
}

chrome.runtime.onMessage.addListener(async ({ gitHubToken }) => {
    if (!polling) {
        polling = true;
        await pollForPipelineUpdate(gitHubToken);
    }

    //TODO: send polling start success message
});
