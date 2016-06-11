export function formatDate(s_date) {
    var date = new Date(s_date);
    var locale = window.navigator.language;
    if (!isFinite(date)) {
            throw new TypeError(errMsg);
        }if (!isFinite(date)) {
            throw new TypeError(errMsg);
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
