$(document).ready(function() {
	reset_ui();
	$('form').on('submit', send_image_to_server);
});

function reset_ui() 
{  
	$("#prediction_container").html("");
	$("#progressbar_group").hide();
	$("#error_alert").hide();
}

function send_image_to_server(event) {
	event.preventDefault();
	var formData = new FormData($('form')[0]);

	$.ajax({
		xhr : start_tracking_upload_progress,
		type : 'POST',
		url : '/',
		data : formData,
		processData : false,
		contentType : false,
		success : on_recieve_prediction
	});
}

function start_tracking_upload_progress() {
	$("#progressbar_group").show();
	set_progress_bar_value(0);
	$("#progress_bar_label").text("Uploading...");
	var xhr = new window.XMLHttpRequest();
	xhr.upload.addEventListener('progress', on_upload_progress_update);
	return xhr;
}

function on_upload_progress_update(e) {
	if (e.lengthComputable) {
		var percent = Math.round((e.loaded / e.total) * 100);
		set_progress_bar_value(percent);
	}
}

function set_progress_bar_value(percent) {  
	$('#progressBar').attr('aria-valuenow', percent).css('width', percent + '%').text(percent + '%');
}

function on_recieve_prediction(data) { 
	$("#progress_bar_label").text("Image Uploaded!");

    if(data.error) {
        $("#error_alert").text(data.error).show();
        $("#prediction_container").html("");
    }
    else {
        $("#error_alert").hide();
        $("#prediction_container").html(data.prediction_display_html);
    }   
}