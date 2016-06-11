export class SweetAlertManager {

    prettyPrompt(title,
		 text,
		 inputValue,
		 event_type,
		 data,
		 callback) {
	swal(
	    {
		title: title,
		text: text,
		type: 'input',
		showCancelButton: true,
		inputValue: inputValue
	    },
	    
	    function(isConfirm) {
		if (isConfirm) {
		    callback(event_type, data);
		}
	    }
	)
    }

    prettyConfirm(title, text, event_type, data, callback) {
	swal(
	    {
		title: title,
		text: text,
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#DD6B55'
	    },
	    function(isConfirm)
	    {
		if (isConfirm) {
		    callback(event_type, data);
		}
	    }
	);
    }


}



