# notifier-chrome-extension
Polls for GitHub pipeline state changes and sends a chrome desktop notification with a status icon and details of the pipeline. 


# Setup
Generate PAT token with the following scopes:
- workflow
- repo
- user
- project
- notification

Then add the string to line 4 in `index.js`.
