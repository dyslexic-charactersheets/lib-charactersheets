


// Roll dice

function rollDice(number, die, bonus) {
  console.log("Roll "+number+"d"+die+"+"+bonus);
}

for (var field of document.getElementsByClassName("field")) {
  for (var icon of field.getElementsByClassName("icon_bonus")) {
    icon.addEventListener('click', function (event) {

      if (icon.classList.includes("icon_bonus")) {
        var input = event.target.closest('.field').getElementsByTagName('input')[0];
        var bonus = input.value;
      
        if (bonus !== null && bonus !== "") {
          bonus = parseInt(bonus);
      
          if (!isNaN(bonus)) {
            rollDice(1, 20, bonus);
          }
        }
      } else if (icon.classList.includes("icon_damage")) {
        // ... damage dice ...
      }

    });
  }


}
