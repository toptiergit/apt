getRetieUrl = function () {
    this.getRetieUrlString = function () {
        var dateObj = new Date();
        var retieValue = dateObj.getMonth() + dateObj.getDay() + dateObj.getFullYear() + dateObj.getTime();
        return retieValue.toString();
    }
}

CallServicesWithFormData = function (url, async, PostData, callBack) {
    var RetieUrlVal = new getRetieUrl();
    var wsrvUrl = "";
    wsrvUrl = url;
    wsrvUrl += "?param=";
    wsrvUrl += "&RetieUrlVal=" + RetieUrlVal.getRetieUrlString();

    $.ajax({
        url: wsrvUrl,
        data: PostData,
        type: 'POST',
        async: async,
        processData: false,
        contentType: false,
        cache: false,
        beforeSend: function (jqXHR, settings) {

        },
        success: function (msg) {
            return callBack(msg);
        }
        , error: function (jqXHR, textStatus, errorThrown) {
            var errorMessage = jqXHR.status + ': ' + jqXHR.statusText + ': ' + errorThrown;
            console.log('Error - ' + errorMessage);
        }
        , complete: function (jqXHR, textStatus) {

        }
    });
}

swap = function (Toggle) {
    if (Toggle == 0) {
        return 1;
    } else {
        return 0;
    }
}

Left = function (str, n) {
    if (n <= 0)
        return "";
    else if (n > String(str).length)
        return str;
    else
        return String(str).substring(0, n);
}

Right = function (str, n) {
    if (n <= 0)
        return "";
    else if (n > String(str).length)
        return str;
    else {
        var iLen = String(str).length;
        return String(str).substring(iLen, iLen - n);
    }
}

goToByScroll = function(id) {
    // Reove "link" from the ID
    id = id.replace("link", "");
    // Scroll
    $('html,body').animate({ scrollTop: $("#" + id).offset().top }, 'slow');
}

//----- Cookie -----
createCookie = function (name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

readCookie = function (name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

eraseCookie = function (name) {
    createCookie(name, "", -1);
}

// -------------------------------------------------------------------------------------
// var color = $("#FillColorId").val();
// console.log(color);
// console.log(hexToRgb(color).r);
// console.log(hexToRgb(color).g);
// console.log(hexToRgb(color).b);
// console.log(rgbToHex(hexToRgb(color).r, hexToRgb(color).g, hexToRgb(color).b));

componentToHex = function(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

rgbToHex = function(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

hexToRgb = function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
// -------------------------------------------------------------------------------------

// gid
guid = function () {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

s4 = function () {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}
// end gid

// return the value of the radio button that is checked
// return an empty string if none are checked, or
// there are no radio buttons	
getCheckedValue = function (radioObj) {
    if (!radioObj)
        return "";
    var radioLength = radioObj.length;
    if (radioLength == undefined)
        if (radioObj.checked)
            return radioObj.value;
        else
            return "";
    for (var i = 0; i < radioLength; i++) {
        if (radioObj[i].checked) {
            return radioObj[i].value;
        }
    }
    return "";
}

// set the radio button with the given value as being checked
// do nothing if there are no radio buttons
// if the given value does not exist, all the radio buttons
// are reset to unchecked
setCheckedValue = function (radioObj, newValue) {
    if (!radioObj)
        return;
    var radioLength = radioObj.length;
    if (radioLength == undefined) {
        radioObj.checked = (radioObj.value == newValue.toString());
        return;
    }
    for (var i = 0; i < radioLength; i++) {
        radioObj[i].checked = false;
        if (radioObj[i].value == newValue.toString()) {
            radioObj[i].checked = true;
        }
    }
}


