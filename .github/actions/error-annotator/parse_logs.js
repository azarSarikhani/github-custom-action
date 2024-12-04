const fs = require("fs");

function parseLogFile(filePath) {
	const logContent = fs.readFileSync(filePath, "utf-8");
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
	// Debugging to check the log path input
	console.log("Log Path from environment:", process.env.INPUT_LOG_PATH);

	let filePath = process.env.INPUT_LOG_PATH || process.argv[2];

	if (!filePath) {
		console.log("::error::No log file path provided.");
		process.exit(1);
	}

	// Check if file exists at the provided path
	if (!fs.existsSync(filePath)) {
		console.log("::error::Log file not found at:", filePath);
		process.exit(1);
	}

	const { errors, warnings } = parseLogFile(filePath);

	errors.forEach((error) => {
		createAnnotation("error", error.line, error.text);
	});

	warnings.forEach((warning) => {
		createAnnotation("warning", warning.line, warning.text);
	});

	// Set output
	if (errors.length > 0) {
		console.log(
			`::set-output name=errors::${JSON.stringify(errors.map((e) => e.text))}`
		);
	} else {
		console.log("::set-output name=errors::No errors found");
	}
}

main();
