var config = {
    apiKey: "AIzaSyBr_0nrgXtrTkfTHtsH8RTnf7HGqlXRZQ4",
    authDomain: "mdb-web-com-mini-project-1.firebaseapp.com",
    databaseURL: "https://mdb-web-com-mini-project-1.firebaseio.com",
    storageBucket: "mdb-web-com-mini-project-1.appspot.com",
    messagingSenderId: "648597318978"
};
firebase.initializeApp(config);

var idsTaken = [];

function makeid() {
    var id = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        id += possible.charAt(Math.floor(Math.random() * possible.length));

    if (idsTaken.indexOf(id) >= 0) return makeId();
    idsTaken.push(id);
    return id;
}

function wrapProgressBarOnFunction(id, func, successCallback, errorCallback) {
    function f() {
        showProgressBar(id);
        console.log("shown");
        var p = func();
        if (!p || !p.then) {
            p = new Promise(function(resolve, reject) {
                resolve(true);
            });
        }
        return p.then(function() {
            if (successCallback) return successCallback();
        }).catch(function(error) {
            if (errorCallback) return errorCallback();
        }).then(function() {
            hideProgressBar(id);
            console.log("hidden");
        });
    }
    return f;
}

function showProgressBar(id) {
    document.querySelector("#progressBar-" + id).style.visibility = "visible";
}

function hideProgressBar(id) {
    document.querySelector("#progressBar-" + id).style.visibility = "hidden";
}

function upload(file) {
    return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        reader.onload = function(event) {
            var binary = event.target.result;
            var md5 = CryptoJS.MD5(binary).toString();
            resolve(md5);
        };
        reader.readAsBinaryString(file);
    }).then(function(hash) {
        var uploadTask = firebase.storage().ref().child('Files/' + hash).put(file, {
            'contentType': file.type
        });
        return new Promise(function(resolve, reject) {
            uploadTask.on('state_changed', null, function(error) {
                reject(error);
            }, function() {
                var url = uploadTask.snapshot.metadata.downloadURLs[0];
                resolve(url);
            });
        });
    });
}

function submitApplication(params) {
    params.name = params.name || "";
    params.age = params.age || 0;
    params.wanaBeInMDB = params.wanaBeInMDB || false;
    params.resume = params.resume || null;

    if (params.name == "" || params.age == 0 || params.resume == null) {
        alert("All fields must be filled in!");
        return;
    }

    var ref = firebase.database().ref().child("Applications").push();
    return ref.set(params).then(function() {
        return upload(params.resume);
    }).then(function(url) {
        return ref.update({
            resume: url
        });
    }).then(function() {
        window.location.href = "/";
    });
}

function promisifyTimeout(callback, timeout) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            var result = callback();
            if (result !== null) resolve(result);
            else resolve();
        }, timeout);
    });
}

function getSubmitedApplications() {
    return firebase.database().ref().child("Applications").once("value").then(function(snapshot) {
        var applicationMap = snapshot.val() || {};
        var applications = [];
        for (var key in applicationMap) {
            applications.push(applicationMap[key]);
        }
        return applications;
    }).catch(function(error) {
        console.error(error);
        return [];
    });
}

function isAuthenicated() {
    return promisifyTimeout(function() {
        return firebase.auth().currentUser != null;
    }, 750);
}

function login() {
    return firebase.auth().signInAnonymously().then(function() {
        window.location.href = "/";
    });
}

function logout() {
    return firebase.auth().signOut().then(function() {
        window.location.href = "/";
    });
}
