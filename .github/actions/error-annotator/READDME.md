# Unity Logs Error and Warning Annotator

This GitHub Action parses Unity Editor log files to identify and annotate errors and warnings. It is designed to integrate seamlessly into your CI/CD pipelines to enhance debugging and streamline issue resolution.

## **Features**

- Extracts errors and warnings from Unity log files.
- Annotates errors and warnings in GitHub Actions for visibility.
- Outputs a list of parsed errors for further use in workflows.

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

If no errors are found, the output will explicitly state "No errors found."

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

      - name: Parse Unity Logs
        uses: ./.github/actions/error-annotator
        with:
          log-path: ${{ inputs.log-path }}
