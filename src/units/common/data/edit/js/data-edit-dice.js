// Mutating dice icon

for (let icon of document.getElementsByClassName("icon_damage")) {
  let frame = icon.closest('.field__frame');
  if (frame === null || frame === undefined) {
    continue;
  }
  for (var dieControl of frame.getElementsByClassName('field__control--damage-die')) {
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
