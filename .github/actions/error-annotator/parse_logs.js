const core = require("@actions/core");
const fs = require("fs");

function parseLogFile(filePath) {
    const logContent = fs.readFileSync(filePath, "utf-8");
	//Case insensitive, group matching regex for any of the words listed between pipes
    //the words listed are ensured to starts and ends at a word boundary
    const errorRegex = /\b(error|fail|exception)\b/i;
    const warningRegex = /\b(warning)\b/i;

    const errors = [];
    const warnings = [];
    const lines = logContent.split("\n");

    lines.forEach((line, index) => {
        if (errorRegex.test(line)) {
            errors.push({ line: index + 1, text: line });
        } else if (warningRegex.test(line)) {
            warnings.push({ line: index + 1, text: line });
        }
    });

    return { errors, warnings };
}

function createAnnotation(type, line, message) {
    console.log(
		`::${type} file=${process.env.INPUT_LOG_PATH},line=${line}::${message}`
	);
}

function main() {
    try {
        const filePath = core.getInput("log-path");
        console.log("Log Path from environment:", filePath);

		//check if filePath is passed as an input
        if (!filePath) {
            throw new Error("No log file path provided.");
        }
		// Check if file exists at the provided path
        if (!fs.existsSync(filePath)) {
            throw new Error(`Log file not found at: ${filePath}`);
        }

        const { errors, warnings } = parseLogFile(filePath);

        errors.forEach((error) => {
            createAnnotation("error", error.line, error.text);
        });

        warnings.forEach((warning) => {
            createAnnotation("warning", warning.line, warning.text);
        });

        // Set errors to action output
        if (errors.length > 0) {
            core.setOutput("errors", JSON.stringify(errors.map((e) => e.text)));
			//debug message
			const errorMessages = JSON.stringify(errors.map((e) => e.text));
			console.log("Debug - Format of errors output:", errorMessages);
		
        }
		//test setting time as output
		const time = (new Date()).toTimeString();
	    core.setOutput("time", time);
    } catch (error) {
        // In case of unexpected errors fail the action gracefully and log the error message
        core.setFailed(error.message);
    }
}

main();
