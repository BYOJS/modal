// note: this module specifier comes from the import-map
//    in index.html; swap "src" for "dist" here to test
//    against the dist/* files
import Modal from "modal/src";


// ***********************

var testResultsEl;

if (document.readyState == "loading") {
	document.addEventListener("DOMContentLoaded",ready,false);
}
else {
	ready();
}


// ***********************

async function ready() {
	var runSpinnerTestsBtn = document.getElementById("run-spinner-tests-btn");
	testResultsEl = document.getElementById("test-results");

	runSpinnerTestsBtn.addEventListener("click",runSpinnerTests,false);
}

async function runSpinnerTests() {
	testResultsEl.innerHTML = "Running spinner tests... please wait.";

	Modal.configSpinner(100,100);

	Modal.startSpinner();
	await timeout(110);
	Modal.stopSpinner();
	await timeout(110);
	Modal.startSpinner();
	Modal.startSpinner();
	Modal.startSpinner();
	Modal.stopSpinner();
	await timeout(110);
	Modal.startSpinner();
	Modal.stopSpinner();
	Modal.stopSpinner();
	Modal.stopSpinner();
	await timeout(110);
	Modal.startSpinner();
	await timeout(50);
	Modal.stopSpinner();
	await timeout(50);
	Modal.startSpinner();
	await timeout(110);
	Modal.stopSpinner();
	await timeout(500);
	Modal.startSpinner();
	await timeout(110);
	Modal.stopSpinner();
	await timeout(50);
	Modal.startSpinner();
	await timeout(110);
	Modal.stopSpinner();
	await timeout(110);

	testResultsEl.innerHTML = "Done.";
}

function timeout(ms) {
	return new Promise(res => setTimeout(res,ms));
}

function logError(err,returnLog = false) {
	var err = `${
			err.stack ? err.stack : err.toString()
		}${
			err.cause ? `\n${logError(err.cause,/*returnLog=*/true)}` : ""
	}`;
	if (returnLog) return err;
	else console.error(err);
}
