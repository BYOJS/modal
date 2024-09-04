// note: this module specifier comes from the import-map
//    in index.html; swap "src" for "dist" here to test
//    against the dist/* files
import Modal from "modal/src";
import Swal from "sweetalert2";


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
	var results = [];
	var expected = [ "show", "hide", "show", "hide", "show", "hide", ];
	testResultsEl.innerHTML = "Running spinner tests... please wait.";

	try {
		Modal.configSpinner(100,100);

		var observer = new MutationObserver(mutationList => {
			results.push(
				...(
					mutationList.filter(mutation => (
						mutation.type == "attributes" &&
						mutation.attributeName == "class" &&
						mutation.target.matches(".spinner-popup.swal2-show, .spinner-popup.swal2-hide")
					))
					.map(mutation => (
						mutation.target.className.match(/\bswal2-(show|hide)\b/)[1]
					))
				)
			);
		});
		observer.observe(document.body,{ attributes: true, subtree: true, });

		Modal.startSpinner();
		await timeout(110);
		Modal.stopSpinner();
		await timeout(500);
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
		await timeout(500);

		// remove consecutive duplicates
		results = results.reduce((list,v) => (
			list.length == 0 || list[list.length - 1] != v ?
				[ ...list, v ] :
				list
		),[]);

		if (JSON.stringify(results) == JSON.stringify(expected)) {
			testResultsEl.innerHTML = "(Spinner) PASSED.";
		}
		else {
			testResultsEl.innerHTML = `(Spinner) FAILED: expected '${expected.join(",")}', found '${results.join(",")}'`;
		}
	}
	catch (err) {
		logError(err);
		testResultsEl.innerHTML = "(Spinner) FAILED (see console)";
	}
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
