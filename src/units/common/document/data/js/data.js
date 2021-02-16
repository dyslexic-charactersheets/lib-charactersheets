var fieldIds = ["level", "name"];
/* ### START DATA SECTION ### */
var fieldValues = {
    level: 1,
    name: "Foo Bar",
};
/* ### END DATA SECTION ### */
var calculationFields = {};

// find all the fields and their values
function initValues() {
    // var fields = document.getElementsByClassName("field");
}

// show/hide field values
var displayValues;

function showValues() {
    if (displayValues) {
        return;
    }
    displayValues = true;

    // 
}

function hideValues() {
    if (!displayValues) {
        return;
    }
    displayValues = false;

    // 
}

function calculateValues() {
    for (var calcId in calculationFields) {
        var calcExpression = calculationFields[calcId];

        // 
    }
}

function saveDocument() {
    // write current data
    var data = "/" + "* ### START DATA SECTION ### *" + "/\nvar fieldValues = ";
    data = data + JSON.stringify(fieldValues);
    data = data + ";\n/" + "* ### END DATA SECTION ### *" + "/";
    
    // replace the data section
    var dataSectionRegex = new RegExp("\\\/" + "\\\* ### START DATA SECTION ### \\\*" + "\\\/[^]*\\\/" + "\\\* ### END DATA SECTION ### \\\*" + "\\\/");
    var source = "<!DOCTYPE html>\n<html lang='en'>\n" + document.documentElement.innerHTML + "</html>";
    source = source.replace(dataSectionRegex, data);

    // generate the download
    var anchor = document.createElement("a");
    anchor.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(source));
    anchor.setAttribute('download', "Saved file.html");
    
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}

initValues();
document.getElementById('button--save-data').onclick = saveDocument;
