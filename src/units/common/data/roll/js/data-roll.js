// Mutating dice icon

for (var icon of document.getElementsByClassName("icon_damage")) {
  for (var dieControl of icon.closest('.field__frame').getElementsByClassName('field__control--damage-die')) {
    for (var dieInput of dieControl.getElementsByTagName('input')) {
      ((icon, dieInput) => {
        dieInput.addEventListener('change', function (event) {
          var cls = "";
          switch (dieInput.value) {
            case 4:
            case "4":
              cls = "icon_d4";
              break;
            case 6:
            case "6":
              cls = "icon_d6";
              break;
            case 8:
            case "8":
              cls = "icon_d8";
              break;
            case 10:
            case "10":
              cls = "icon_d10";
              break;
            case 12:
            case "12":
              cls = "icon_d12";
              break;
            case 20:
            case "20":
              cls = "icon_d20";
              break;
            default:
              return;
          }
          icon.classList.remove("icon_d4");
          icon.classList.remove("icon_d6");
          icon.classList.remove("icon_d8");
          icon.classList.remove("icon_d10");
          icon.classList.remove("icon_d12");
          icon.classList.remove("icon_d20");
          icon.classList.add(cls);
        });
      })(icon, dieInput);
    }
  }
}


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
