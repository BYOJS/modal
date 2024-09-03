import Swal from "./external/esm.swal.mjs";
import Scheduler from "@byojs/scheduler";


// ***********************

var spinnerStart = Scheduler(300,400);
var spinnerCancel;


// ***********************

export {
	showError,
	showToast,
	promptSimple,
	startSpinner,
	stopSpinner,
};
var publicAPI = {
	showError,
	showToast,
	promptSimple,
	startSpinner,
	stopSpinner,
};
export default publicAPI;


// ***********************

function showError(errMsg) {
	return Swal.fire({
		title: "Error!",
		text: errMsg,
		icon: "error",
		confirmButtonText: "OK",
	});
}

function showToast(toastMsg) {
	return Swal.fire({
		text: toastMsg,
		showConfirmButton: false,
		showCloseButton: true,
		timer: 5000,
		toast: true,
		position: "top-end",
		customClass: {
			popup: "toast-popup",
		},
	});
}

async function promptSimple({
	title = "Enter Info",
	showConfirmButton = true,
	confirmButtonText = "Submit",
	confirmButtonColor = "darkslateblue",
	showCancelButton = true,
	cancelButtonColor = "darkslategray",
	allowOutsideClick = true,
	allowEscapeKey = true,
	icon = "question",
	...swalOptions
} = {}) {
	var result = await Swal.fire({
		title,
		showConfirmButton,
		confirmButtonText,
		confirmButtonColor,
		showCancelButton,
		cancelButtonColor,
		allowOutsideClick,
		allowEscapeKey,
		...swalOptions
	});

	if (result.isConfirmed) {
		return result.value;
	}
	return false;
}

function startSpinner() {
	if (!spinnerCancel) {
		spinnerCancel = spinnerStart(showSpinner);
	}
}

function showSpinner() {
	Swal.fire({
		position: "top",
		showConfirmButton: false,
		allowOutsideClick: false,
		allowEscapeKey: false,
	});
	Swal.showLoading();
}

function stopSpinner() {
	if (spinnerCancel) {
		spinnerCancel();
		spinnerCancel = null;
		if (Swal.isVisible() && Swal.getPopup().matches(".spinner-popup")) {
			return Swal.close();
		}
	}
}
