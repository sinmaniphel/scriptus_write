export function formatDate(sDate:string) {
    var date:Date = new Date(sDate);
    var locale = window.navigator.language;
    if (!isFinite(date.getUTCMilliseconds())) {
            throw new TypeError('errMsg');
        }if (!isFinite(date.getUTCMilliseconds())) {
            throw new TypeError('errMsg');
        }
    var options = {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
	hour: 'numeric',
	minutes: 'numeric'
    };



    return date.toLocaleDateString(
	locale,
	options
    )
	;
};
