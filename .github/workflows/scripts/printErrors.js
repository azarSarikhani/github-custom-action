const errorsJson = process.env.ERRORS;

try {
  const errors = JSON.parse(errorsJson);

  if (Array.isArray(errors) && errors.length > 0) {
    console.log("Errors from log step:");
    errors.forEach((error, index) => {
      console.log(`${index + 1}: ${error}`);
    });
  } else {
    console.log("No errors found.");
  }
} catch (err) {
  console.error("Failed to parse errors as JSON:", err.message);
  process.exit(1);
}
