angular.module('app.services', [])
	.factory("Applications", function() {
		return {
			// returns a promise which resolves to a list of application objects
			getSubmited: function() {
				var promise = null; // TODO: YOUR CODE HERE
				return promise.then(function(snapshot) {
					if (!snapshot.exists()) return firebase.Promise.reject(new Error("no applications have been submited"));
					var submitedApplications = [];
					var submitedApplicationMap = snapshot.val();
					for (var key in submitedApplicationMap) {
						submitedApplications.push(submitedApplicationMap[key]);
					}
					return submitedApplications;
				});
			},
			// returns a promise which resolves to true if the application was submited
			submit: function(name, age, kewl, resume) {
				name = name || "";
				age = age || 0;
				kewl = kewl || false;
				if (name == "" || age == 0) return firebase.Promise.reject(new Error("please enter name and age"));
				var promise = firebase.Promise.resolve(null);
				if (resume) promise = upload(resume);
				return promise.then(function(link) {
					var application = {
						name: name,
						age: age,
						kewl: kewl,
						resume: link
					};
					var ref = null; // TODO: YOUR CODE HERE
					return ref.set(application);
				});
			}
		}
	});