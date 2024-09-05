import Swal from "sweetalert2";
import Toggler from "@byojs/toggler";


// ***********************

var modalStatus = "closed";
var toggleSpinner = configSpinner(300,500);


// ***********************

export {
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

function showToast(toastMsg,hideDelay = 5000) {
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

function showNotice(noticeMsg) {
	modalStatus = "opening";

	return Swal.fire({
		text: noticeMsg,
		icon: "info",
		confirmButtonText: "OK",
		didOpen: onModalOpen,
		didDestroy: onModalClose,
	});
}

function showError(errMsg) {
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
	return false;
}

function configSpinner(startDelay = 300,stopDelay = 500) {
	toggleSpinner = Toggler(startDelay,stopDelay);
}

function startSpinner() {
	if (![ "opening", "open", ].includes(modalStatus)) {
		modalStatus = "opening";
		toggleSpinner(showSpinner,hideSpinner);
	}
}

function stopSpinner() {
	if (![ "closing", "closed", ].includes(modalStatus)) {
		modalStatus = "closing";
		toggleSpinner(showSpinner,hideSpinner);
	}
}

function showSpinner() {
	modalStatus = "open";

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
	modalStatus = "closed";

	// ensure we only close an actually-open spinner
	// modal (and not some other valid modal)
	if (
		Swal.isVisible() &&
		Swal.getPopup().matches(".spinner-popup")
	) {
		close();
	}
}

function close() {
	Swal.close();
}

function onModalOpen() {
	modalStatus = "open";
}

function onModalClose() {
	modalStatus = "closed";
}
