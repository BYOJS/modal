import Swal from "sweetalert2";
import Toggler from "@byojs/toggler";


// ***********************

var modalType = null;
var modalStatus = "closed";
var toggleStartDelay = 300;
var toggleStopDelay = 500;
var toggleSpinner = null;
configSpinner(toggleStartDelay,toggleStopDelay).catch(()=>{});


// ***********************

export {
	Swal,
	showToast,
	showNotice,
	showError,
	promptSimple,
	configSpinner,
	startSpinner,
	stopSpinner,
	close,
};
var publicAPI = {
	Swal,
	showToast,
	showNotice,
	showError,
	promptSimple,
	configSpinner,
	startSpinner,
	stopSpinner,
	close,
};
export default publicAPI;


// ***********************

async function showToast(toastMsg,hideDelay = 5000) {
	var check = checkCloseSpinner();
	if (isPromise(check)) await check;

	modalType = "toast";
	modalStatus = "opening";

	return Swal.fire({
		text: toastMsg,
		showConfirmButton: false,
		showCloseButton: true,
		timer: Math.max(Number(hideDelay) || 0,250),
		toast: true,
		position: "top-end",
		customClass: {
			popup: "toast-popup",
		},
		didOpen: onModalOpen,
		didDestroy: onModalClose,
	});
}

async function showNotice(noticeMsg) {
	var check = checkCloseSpinner();
	if (isPromise(check)) await check;

	modalType = "notice";
	modalStatus = "opening";

	return Swal.fire({
		text: noticeMsg,
		icon: "info",
		confirmButtonText: "OK",
		didOpen: onModalOpen,
		didDestroy: onModalClose,
	});
}

async function showError(errMsg) {
	var check = checkCloseSpinner();
	if (isPromise(check)) await check;

	modalType = "error";
	modalStatus = "opening";

	return Swal.fire({
		title: "Error!",
		text: errMsg,
		icon: "error",
		confirmButtonText: "OK",
		didOpen: onModalOpen,
		didDestroy: onModalClose,
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
	didOpen = onModalOpen,
	didDestroy = onModalClose,
	...swalOptions
} = {}) {
	var check = checkCloseSpinner();
	if (isPromise(check)) await check;

	modalType = "simple-prompt";
	modalStatus = "opening";

	var result = await Swal.fire({
		title,
		showConfirmButton,
		confirmButtonText,
		confirmButtonColor,
		showCancelButton,
		cancelButtonColor,
		allowOutsideClick,
		allowEscapeKey,
		icon,
		didOpen: (
			didOpen != onModalOpen ?
				(...args) => (onModalOpen(...args), didOpen(...args)) :
				didOpen
		),
		didDestroy: (
			didDestroy != onModalClose ?
				(...args) => (onModalClose(...args), didDestroy(...args)) :
				didDestroy
		),
		...swalOptions
	});

	if (result.isConfirmed) {
		return result.value;
	}
	return result;
}

async function configSpinner(
	startDelay = toggleStartDelay,
	stopDelay = toggleStopDelay
) {
	var check = checkCloseSpinner();
	if (isPromise(check)) await check;

	toggleStartDelay = startDelay;
	toggleStopDelay = stopDelay;
	toggleSpinner = Toggler(startDelay,stopDelay);
}

function startSpinner() {
	if (![ "opening", "open", ].includes(modalStatus)) {
		modalType = "spinner";
		modalStatus = "opening";
		toggleSpinner(showSpinner,hideSpinner);
	}
}

function stopSpinner() {
	if (
		modalType == "spinner" &&
		![ "closing", "closed", ].includes(modalStatus)
	) {
		modalStatus = "closing";
		toggleSpinner(showSpinner,hideSpinner);
	}
}

function showSpinner() {
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
			didOpen: onModalOpen,
			didDestroy: onModalClose,
		});
		Swal.showLoading();
	}
}

function hideSpinner() {
	// ensure we only close an actually-open spinner
	// modal (and not some other valid modal)
	if (
		Swal.isVisible() &&
		Swal.getPopup().matches(".spinner-popup")
	) {
		Swal.close();
	}
}

function checkCloseSpinner(){
	if (modalType == "spinner" && modalStatus != "closed") {
		return new Promise(res => {
			if ([ "opening", "open", ].includes(modalStatus)) {
				stopSpinner();
			}
			modalStatus = "closing";

			// make sure we wait for the spinner to fully close
			setTimeout(res,toggleStopDelay);
		});
	}
}

async function close() {
	if (modalType == "spinner") {
		await checkCloseSpinner();
	}
	// modal still visible?
	if (Swal.isVisible()) {
		modalStatus = "closing";
		Swal.close();
	}
	else {
		modalType = null;
		modalStatus = "closed";
	}
}

function onModalOpen() {
	modalStatus = "open";
}

function onModalClose() {
	modalType = null;
	modalStatus = "closed";
}

function isPromise(v) {
	return v && typeof v == "object" && typeof v.then == "function";
}
