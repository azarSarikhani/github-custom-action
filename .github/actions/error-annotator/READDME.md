# Unity Logs Error and Warning Annotator

This GitHub Action parses Unity Editor log files to identify and annotate errors and warnings. It is designed to integrate seamlessly into your CI/CD pipelines to enhance debugging.

## **Features**

- Extracts errors and warnings from Unity log files. This includes any distinct occurance of any of the words error, warning, fail, and exception in the log.
- Annotates errors and warnings in GitHub Actions for visibility.
- Outputs a list of parsed errors for further use in workflows.

---

## **Requirements**

- @actions/core is required to have been either present in the repo or to have been installed on the runner. It could be installed in either, using

```bash
	npm install @actions/core
```
---

## **Inputs**

### **`log-path`**
- **Description**: Path to the Unity log file.  
- **Required**: Yes.  
- **Type**: String.

Provide the relative path to the Unity log file within the repository.

---

## **Outputs**

### **`errors`**
- **Description**: A list of parsed errors extracted from the log file.

If no errors are found, the output will be an empty array."

---

## **Usage**

Here’s an example of how to use the `Unity Logs Error and Warning Annotator` in a GitHub Actions workflow:

```yaml
name: Parse Unity Logs
on:
  workflow_dispatch:
    inputs:
      log-path:
        description: "Path to the log file"
        required: true
        type: choice
        options:
          - "logs/sample-project-failure.log"
          - "logs/sample-project-success.log"

jobs:
  parse-logs:
    runs-on: ubuntu-latest
    
    steps:

      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up dependencies
        run: sudo npm install @actions/core

      - name: Parse Unity Logs
        uses: ./.github/actions/error-annotator
        with:
          log-path: ${{ inputs.log-path }}
```
