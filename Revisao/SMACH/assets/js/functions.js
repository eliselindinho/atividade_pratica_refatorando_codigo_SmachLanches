// SMACH LANCHES SYSTEM METHODS

function getCheckedItemsOnTable(tableSelector) {
  const itensChecked = document.querySelectorAll(
    `${tableSelector} input[type=checkbox]:checked`
  );
  return itensChecked;
}



