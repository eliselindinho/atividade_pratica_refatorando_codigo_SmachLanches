import { searchProductAndFillFormOrder } from "../modules/order.mjs";
import { addProductToOrderAndTableRender } from "../renders/orderRender.mjs"; 

export function LoadEvents() {
    const buttonSearchProduct = document.querySelector(
        ".form-new-order__search .btn"
    );

    const buttonAddProductToOrder = document.querySelector(
        ".form-new-order .btn-primary"
    );
    
    buttonSearchProduct.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        searchProductAndFillFormOrder();
    });

    
    buttonAddProductToOrder.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        addProductToOrderAndTableRender();
    });
}
