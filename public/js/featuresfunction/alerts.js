/* eslint-disable */

export const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
export const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideAlert, 5000);
};
// export const showTreeType = () => {
//   hideAlert();
//   const markup = `<div class="tree_type">Choisis ton type d'arbre
//   <ul>
//     <input type="button" class="platane_type" value="Platane">
//     <input type="button" class="erable_type" value="Erable">
//     <input type="button" class="tilleul_type" value="Tilleul">
//     <input type="button" class="cerisier_type" value="Cerisier">
//     <input type="button" class="micocouliers_type" value="Micocouliers">
//     <input type="button" class="frene_type" value="Frene">
//     <input type="button" class="chene_type" value="chene_type">
//   </ul>
// </div>`;
//   document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
//   window.setTimeout(hideAlert, 5000);
// };
