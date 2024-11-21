function addCommas(nStr)
{
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }

    return x1 + x2;
}

function displayNumber(str, digits)
{
    return addCommas(str.toFixed(digits));
}

function formatNumber(num)
{
    if (num == null) { return "0"; }
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

function currencyFormat(num) {
    return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

$('.jq-currency').click(function () { this.select(); });
$('.jq-number').click(function () { this.select(); });
$('.jq-number0').click(function () { this.select(); });
$('.jq-number4').click(function () { this.select(); });