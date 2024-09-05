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
	var runAllTestsBtn = document.getElementById("run-all-tests-btn");
	var runSpinnerModalTestsBtn = document.getElementById("run-spinner-tests-btn");
	var runToastModalTestsBtn = document.getElementById("run-toast-modal-tests-btn");
	var runNoticeModalTestsBtn = document.getElementById("run-notice-modal-tests-btn");
	var runErrorModalTestsBtn = document.getElementById("run-error-modal-tests-btn");
	var runSimplePromptModalTestsBtn = document.getElementById("run-simple-prompt-modal-tests-btn");
	testResultsEl = document.getElementById("test-results");

	runAllTestsBtn.addEventListener("click",runAllTests,false);
	runSpinnerModalTestsBtn.addEventListener("click",runSpinnerModalTests,false);
	runToastModalTestsBtn.addEventListener("click",runToastModalTests,false);
	runNoticeModalTestsBtn.addEventListener("click",runNoticeModalTests,false);
	runErrorModalTestsBtn.addEventListener("click",runErrorModalTests,false);
	runSimplePromptModalTestsBtn.addEventListener("click",runSimplePromptModalTests,false);
}

async function runAllTests() {
	testResultsEl.innerHTML = "";

	for (let testFn of [
		runSpinnerModalTests, runToastModalTests, runNoticeModalTests,
		runErrorModalTests, runSimplePromptModalTests,
	]) {
		let result = await testFn();
		if (result === false) {
			break;
		}
		await timeout(500);
	}
}

async function runSpinnerModalTests() {
	var results = [];
	var expected = [ "show", "hide", "show", "hide", "show", "hide", ];
	testResultsEl.innerHTML += "Running spinner-modal tests... please wait.<br>";

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
			testResultsEl.innerHTML += "(Spinner Modal) PASSED.<br>";
			return true;
		}
		else {
			testResultsEl.innerHTML += `(Spinner Modal) FAILED: expected '${expected.join(",")}', found '${results.join(",")}'<br>`;
		}
	}
	catch (err) {
		logError(err);
		testResultsEl.innerHTML += "(Spinner Modal) FAILED -- see console<br>";
	}
	return false;
}

async function runToastModalTests() {
	var results = [];
	var expected = [
		/*visible*/true,
		/*correct toast*/true,
		/*visible*/false,
		/*visible*/true,
		/*correct spinner*/true,
		/*visible*/true,
		/*correct toast*/true,
		/*visible*/false,
	];
	testResultsEl.innerHTML += "Running toast-modal tests... please wait.<br>";

	try {
		let toastMsg = "Testing toasts...";
		Modal.showToast(toastMsg,500);
		await timeout(250);
		let popup = Swal.getPopup();
		results.push(
			Swal.isVisible(),
			(
				popup.querySelector(".swal2-html-container").innerText == toastMsg
			)
		);
		await timeout(500);
		results.push(
			Swal.isVisible() || Swal.getContainer() != null
		);

		// now popup spinner and make sure toast-dialog
		// then closes spinner before opening itself
		Modal.configSpinner(100,100);
		Modal.startSpinner();
		await timeout(250);
		popup = Swal.getPopup();
		results.push(
			Swal.isVisible(),
			popup.matches(".spinner-popup.swal2-show")
		);
		Modal.showToast(toastMsg,500);
		await timeout(350);
		popup = Swal.getPopup();
		results.push(
			Swal.isVisible(),
			(
				popup.querySelector(".swal2-html-container").innerText == toastMsg
			)
		);
		await timeout(500);
		results.push(
			Swal.isVisible() || Swal.getContainer() != null
		);

		if (JSON.stringify(results) == JSON.stringify(expected)) {
			testResultsEl.innerHTML += "(Toast Modal) PASSED.<br>";
			return true;
		}
		else {
			testResultsEl.innerHTML += `(Toast Modal) FAILED: expected '${expected.join(",")}', found '${results.join(",")}'<br>`;
		}
	}
	catch (err) {
		logError(err);
		testResultsEl.innerHTML = "(Toast Modal) FAILED -- see console"
	}
	return false;
}

async function runNoticeModalTests() {
	var results = [];
	var expected = [
		/*visible*/true,
		/*correct notice*/true,
		/*visible*/false,
		/*visible*/true,
		/*correct spinner*/true,
		/*visible*/true,
		/*correct notice*/true,
		/*visible*/false,
	];
	testResultsEl.innerHTML += "Running notice-modal tests... please wait.<br>";

	try {
		let noticeMsg = "Testing notice modal.";
		Modal.showNotice(noticeMsg);
		await timeout(250);
		let popup = Swal.getPopup();
		results.push(
			Swal.isVisible(),
			(
				popup.querySelector(".swal2-icon.swal2-info.swal2-icon-show") != null &&
				popup.querySelector(".swal2-html-container").innerText == noticeMsg
			)
		);
		Modal.close();
		await timeout(250);
		results.push(
			Swal.isVisible() || Swal.getContainer() != null
		);

		// now popup spinner and make sure notice-dialog
		// then closes spinner before opening itself
		Modal.configSpinner(100,100);
		Modal.startSpinner();
		await timeout(250);
		popup = Swal.getPopup();
		results.push(
			Swal.isVisible(),
			popup.matches(".spinner-popup.swal2-show")
		);
		Modal.showNotice(noticeMsg);
		await timeout(350);
		popup = Swal.getPopup();
		results.push(
			Swal.isVisible(),
			(
				popup.querySelector(".swal2-icon.swal2-info.swal2-icon-show") != null &&
				popup.querySelector(".swal2-html-container").innerText == noticeMsg
			)
		);
		Modal.close();
		await timeout(250);
		results.push(
			Swal.isVisible() || Swal.getContainer() != null
		);

		if (JSON.stringify(results) == JSON.stringify(expected)) {
			testResultsEl.innerHTML += "(Notice Modal) PASSED.<br>";
			return true;
		}
		else {
			testResultsEl.innerHTML += `(Notice Modal) FAILED: expected '${expected.join(",")}', found '${results.join(",")}'<br>`;
		}
	}
	catch (err) {
		logError(err);
		testResultsEl.innerHTML = "(Notice Modal) FAILED -- see console"
	}
	return false;
}

async function runErrorModalTests() {
	var results = [];
	var expected = [
		/*visible*/true,
		/*correct error*/true,
		/*visible*/false,
		/*visible*/true,
		/*correct spinner*/true,
		/*visible*/true,
		/*correct error*/true,
		/*visible*/false,
	];
	testResultsEl.innerHTML += "Running error-modal tests... please wait.<br>";

	try {
		let errMsg = "Testing error modal.";
		Modal.showError(errMsg);
		await timeout(250);
		let popup = Swal.getPopup();
		results.push(
			Swal.isVisible(),
			(
				popup.querySelector(".swal2-icon.swal2-error.swal2-icon-show") != null &&
				popup.querySelector(".swal2-html-container").innerText == errMsg
			)
		);
		Modal.close();
		await timeout(250);
		results.push(
			Swal.isVisible() || Swal.getContainer() != null
		);

		// now popup spinner and make sure error-dialog
		// then closes spinner before opening itself
		Modal.configSpinner(100,100);
		Modal.startSpinner();
		await timeout(250);
		popup = Swal.getPopup();
		results.push(
			Swal.isVisible(),
			popup.matches(".spinner-popup.swal2-show")
		);
		Modal.showError(errMsg);
		await timeout(350);
		popup = Swal.getPopup();
		results.push(
			Swal.isVisible(),
			(
				popup.querySelector(".swal2-icon.swal2-error.swal2-icon-show") != null &&
				popup.querySelector(".swal2-html-container").innerText == errMsg
			)
		);
		Modal.close();
		await timeout(250);
		results.push(
			Swal.isVisible() || Swal.getContainer() != null
		);

		if (JSON.stringify(results) == JSON.stringify(expected)) {
			testResultsEl.innerHTML += "(Error Modal) PASSED.<br>";
			return true;
		}
		else {
			testResultsEl.innerHTML += `(Error Modal) FAILED: expected '${expected.join(",")}', found '${results.join(",")}'<br>`;
		}
	}
	catch (err) {
		logError(err);
		testResultsEl.innerHTML = "(Error Modal) FAILED -- see console"
	}
	return false;
}

async function runSimplePromptModalTests() {
	var results = [];
	var expected = [
		/*visible*/true,
		/*correct prompt*/true,
		/*visible*/false,
		/*visible*/true,
		/*correct spinner*/true,
		/*visible*/true,
		/*correct prompt*/true,
		/*visible*/false,
	];
	testResultsEl.innerHTML += "Running prompt-modal tests... please wait.<br>";

	try {
		let promptTitle = "Testing Prompt Modal";
		let promptText = "Testing prompt modal.";
		let promptInputLabel = "good label";
		let promptConfirmButtonText = "Yep";
		let promptCancelButtonText = "Nope";
		let now = new Date();
		let currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
		Modal.promptSimple({
			title: promptTitle,
			text: promptText,
			input: "date",
			inputLabel: promptInputLabel,
			inputValue: currentDate,
			confirmButtonText: promptConfirmButtonText,
			cancelButtonText: promptCancelButtonText,
		});
		await timeout(250);

		let popup = Swal.getPopup();
		results.push(
			Swal.isVisible(),
			(
				popup.querySelector(".swal2-title").innerText == promptTitle &&
				popup.querySelector(".swal2-icon.swal2-question.swal2-icon-show") != null &&
				popup.querySelector(".swal2-html-container").innerText == promptText &&
				popup.querySelector(".swal2-input-label").innerText == promptInputLabel &&
				popup.querySelector(".swal2-input[type=date]").value == currentDate &&
				popup.querySelector(".swal2-confirm").innerText == promptConfirmButtonText &&
				popup.querySelector(".swal2-cancel").innerText == promptCancelButtonText
			)
		);
		Modal.close();
		await timeout(250);
		results.push(
			Swal.isVisible() || Swal.getContainer() != null
		);

		// now popup spinner and make sure prompt-dialog
		// then closes spinner before opening itself
		Modal.configSpinner(100,100);
		Modal.startSpinner();
		await timeout(250);
		popup = Swal.getPopup();
		results.push(
			Swal.isVisible(),
			popup.matches(".spinner-popup.swal2-show")
		);
		Modal.promptSimple({
			title: promptTitle,
			text: promptText,
			input: "date",
			inputLabel: promptInputLabel,
			inputValue: currentDate,
			confirmButtonText: promptConfirmButtonText,
			cancelButtonText: promptCancelButtonText,
		});
		await timeout(350);
		popup = Swal.getPopup();
		results.push(
			Swal.isVisible(),
			(
				popup.querySelector(".swal2-title").innerText == promptTitle &&
				popup.querySelector(".swal2-icon.swal2-question.swal2-icon-show") != null &&
				popup.querySelector(".swal2-html-container").innerText == promptText &&
				popup.querySelector(".swal2-input-label").innerText == promptInputLabel &&
				popup.querySelector(".swal2-input[type=date]").value == currentDate &&
				popup.querySelector(".swal2-confirm").innerText == promptConfirmButtonText &&
				popup.querySelector(".swal2-cancel").innerText == promptCancelButtonText
			)
		);
		Modal.close();
		await timeout(250);
		results.push(
			Swal.isVisible() || Swal.getContainer() != null
		);

		if (JSON.stringify(results) == JSON.stringify(expected)) {
			testResultsEl.innerHTML += "(Error Modal) PASSED.<br>";
			return true;
		}
		else {
			testResultsEl.innerHTML += `(Error Modal) FAILED: expected '${expected.join(",")}', found '${results.join(",")}'<br>`;
		}
	}
	catch (err) {
		logError(err);
		testResultsEl.innerHTML = "(Error Modal) FAILED -- see console"
	}
	return false;
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
