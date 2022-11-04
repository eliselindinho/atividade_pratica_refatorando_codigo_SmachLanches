import { notify } from "../_utils.js";

export function LoadEvents() {
    const closeButtonNotify = document.querySelector(".notify .icon-close");

    closeButtonNotify.addEventListener("click", () => {
        notify("none");
    });
}