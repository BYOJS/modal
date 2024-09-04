import Swal from "sweetalert2";
import Toggler from "@byojs/toggler";


// ***********************

var spinnerStatus = "closed";
var toggleSpinner = configSpinner(300,500);


// ***********************

export {
	showError,
	showToast,
	promptSimple,
	configSpinner,
	startSpinner,
	stopSpinner,
};
var publicAPI = {
	showError,
	showToast,
	promptSimple,
	configSpinner,
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

function configSpinner(startDelay = 300,stopDelay = 500) {
	toggleSpinner = Toggler(startDelay,stopDelay);
}

function startSpinner() {
	if (![ "opening", "open", ].includes(spinnerStatus)) {
		spinnerStatus = "opening";
		toggleSpinner(showSpinner,hideSpinner);
	}
}

function stopSpinner() {
	if (![ "closing", "closed", ].includes(spinnerStatus)) {
		spinnerStatus = "closing";
		toggleSpinner(showSpinner,hideSpinner);
	}
}

function showSpinner() {
	spinnerStatus = "open";

	// ensure we don't "re-open" an already-open spinner modal,
	// as this causes a flicker that is UX undesirable.
	if (!(
		Swal.isVisible() &&
		Swal.getPopup().matches(".spinner-popup"))
	) {
		Swal.fire({
			position: "top",
			showConfirmButton: false,
			allowOutsideClick: false,
			allowEscapeKey: false,
			customClass: {
				// used purely for .matches(), not for CSS,
				// although you *can* add your own CSS
				// `.spinner-popup` class, to customize its
				// styling
				popup: "spinner-popup",
			},
		});
		Swal.showLoading();
	}
}

function hideSpinner() {
	spinnerStatus = "closed";

	// ensure we only close an actually-open spinner
	// modal (and not some other valid modal)
	if (
		Swal.isVisible() &&
		Swal.getPopup().matches(".spinner-popup")
	) {
		Swal.close();
	}
}
