import swal from 'sweetalert2'

export class SweetAlertManager {

  prettyPrompt(title,
		 text,
		 inputValue,
		 event_type,
		 data,
		 callback) {
	      swal({
    		title: title,
    		text: text,
    		//type: 'input',
        input: 'email',
        showCancelButton: true,
    		inputValue: inputValue
        }).
        then(
          callback(event_type, data)
        )
    }

    prettyConfirm(title, text, event_type, data, callback) {
  	swal(
  	    {
  		title: title,
  		text: text,
  		type: 'warning',
  		showCancelButton: true,
//  		confirmButtonColor: '#DD6B55'
      }
    ).then(
		    callback(event_type, data)
      )
	   }
}
