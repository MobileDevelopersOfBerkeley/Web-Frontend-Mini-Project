// Initialize Firebase
var config = {
	apiKey: "AIzaSyBr_0nrgXtrTkfTHtsH8RTnf7HGqlXRZQ4",
	authDomain: "mdb-web-com-mini-project-1.firebaseapp.com",
	databaseURL: "https://mdb-web-com-mini-project-1.firebaseio.com",
	storageBucket: "mdb-web-com-mini-project-1.appspot.com",
	messagingSenderId: "648597318978"
};
firebase.initializeApp(config);

// returns a promise that resolve the link of the file if it was uploaded
function upload(file) {
	return new Promise(function(resolve, reject) {
		// read in file
		var reader = new FileReader();
		reader.onload = function(event) {
			var binary = event.target.result;
			// generate md5 hash
			var md5 = CryptoJS.MD5(binary).toString();
			resolve(md5);
		};
		reader.readAsBinaryString(file);
	}).then(function(hash) {
		// setup uploadTask to upload file under the generated hash
		var uploadTask = firebase.storage().ref().child(hash).put(file, {
			'contentType': file.type
		});
		return new Promise(function(resolve, reject) {
			uploadTask.on('state_changed', null, function(error) {
				reject(error);
			}, function() {
				// resolve url of uploaded file
				var url = uploadTask.snapshot.metadata.downloadURLs[0];
				resolve(url);
			});
		});
	});
}