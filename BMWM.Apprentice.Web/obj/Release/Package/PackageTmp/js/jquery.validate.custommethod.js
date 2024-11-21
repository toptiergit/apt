//! jQuery Validation Plugin - v1.12.0 - 4/1/2014
//custom validation method
$.validator.addMethod("dateFormat", function (value, element) {
    if (value != "") {
        return (Date.parseExact(value, validatorInputDateFormat) != null);
    } else {
        return true;
    }
}, "Please enter a valid date.");

$.validator.addMethod("datetimeFormat", function (value, element) {
    if (value != "") {
        var arr = value.split(" "); //alert(validatorInputDateFormat);
        if (arr.length != 2) {
            return false;
        }
        else {
            if (!Date.parseExact(arr[0], validatorInputDateFormat)) {
                return false;
            }
            else {
                var timeArr = arr[1].split(":");
                if (timeArr.length != 2) {
                    return false;
                }
                else {
                    var hh = timeArr[0]; //alert(hh);
                    var mm = timeArr[1]; //alert(mm);
                    if (Number(hh) >= 0 && Number(hh) < 24) {
                        if (Number(mm) >= 0 && Number(mm) < 60) {
                            //alert("success");
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        return false;
                    }
                }
            }
        }
    }
    else {
        return true;
    }
}, "Please enter a valid datetime.");

$.validator.addMethod('minStrict', function (value, element, param) {
    if (!isNaN(value)) {
        return Number(value) > Number(param);
    } else {
        return true;
    }
}, "Must be greater than {0}.");

$.validator.addMethod("checkYear", function (value, element) {    
    var dte = Date.parse(value); //console.log("dte: " + dte.getFullYear());
    var now = new Date(); //console.log("now: " + now.getFullYear());
        
    if (dte != null) {
        if ((dte.getFullYear() - now.getFullYear()) < 100)
            return true;
    } else {
        return true;
    }

}, "Invalid year.");