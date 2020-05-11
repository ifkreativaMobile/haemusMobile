
function onPushwooshInitialized(pushNotification) {

    //if you need push token at a later time you can always get it from Pushwoosh plugin
    pushNotification.getPushToken(
        function (token) {
            console.info('push token: ' + token);
        }
    );

    //and HWID if you want to communicate with Pushwoosh API
    pushNotification.getPushwooshHWID(
        function (token) {
            console.info('Pushwoosh HWID: ' + token);
        }
    );

    //settings tags
    pushNotification.setTags({
        tagName: "tagValue",
        intTagName: 10
    },
        function (status) {
            console.info('setTags success: ' + JSON.stringify(status));
        },
        function (status) {
            console.warn('setTags failed');
        }
    );

    pushNotification.getTags(
        function (status) {
            console.info('getTags success: ' + JSON.stringify(status));
        },
        function (status) {
            console.warn('getTags failed');
        }
    );

    //start geo tracking.
    //pushNotification.startLocationTracking();
}

function getNotificationTitle(message)
{
    if (message.includes("[0]") || message.includes("[1]") || message.includes("[2]") || message.includes("[3]"))
        return "Судски Совет под лупа";
    else if (message.includes("[4]") || message.includes("[5]") || message.includes("[6]") || message.includes("[7]"))
        return "Анти-корупциска под лупа";
    else if (message.includes("[8]") || message.includes("[9]") || message.includes("[10]") || message.includes("[11]"))
        return "Анти-дискриминаторска под лупа";
    else return "Институции под лупа";
}

function RedirectToSection(message)
{
    if (message.includes("[0]"))
        return "index-sudski.html?link=0";
    else if (message.includes("[1]"))
        return "events.html?link=1";
    else if (message.includes("[2]"))
        return "kvartalni.html?link=2";
    else if (message.includes("[3]"))
        return "dokumenti.html?link=3";
    if (message.includes("[4]"))
        return "index-antikorupciska.html?link=4";
    else if (message.includes("[5]"))
        return "events-antikorupciska.html?link=5";
    else if (message.includes("[6]"))
        return "kvartalni-antikorupciska.html?link=6";
    else if (message.includes("[7]"))
        return "dokumenti-antikorupciska.html?link=7";
    if (message.includes("[8]"))
        return "index-antidiskriminatorska.html?link=8";
    else if (message.includes("[9]"))
        return "events-antidiskriminatorska.html?link=9";
    else if (message.includes("[10]"))
        return "kvartalni-antidiskriminatorska.html?link=10";
    else if (message.includes("[11]"))
        return "dokumenti-antidiskriminatorska.html?link=11";
    else return "index.html";
}

function initPushwoosh() {
    var pushNotification = cordova.require("pushwoosh-cordova-plugin.PushNotification");

    //set push notifications handler
    document.addEventListener('push-notification',
        function (event) {
            var message = event.notification.message;
            var pomoshna = message;
            var filteredMessage = pomoshna.replace("[1]", "").replace("[2]", "").replace("[3]", "").replace("[4]", "").replace("[5]", "").replace("[6]", "").replace("[7]", "").replace("[8]", "").replace("[9]", "").replace("[10]", "").replace("[11]", "").replace("[0]", "");
            var userData = event.notification.userdata;

            navigator.notification.alert(filteredMessage, function () {
                lokacija = RedirectToSection(message);
                window.location.href = RedirectToSection(message);
            }, getNotificationTitle(message), 'ОК');

            //navigator.notification.alert(JSON.stringify(event.notification), function () {
            //}, 'Судски совет под лупа', 'ОК');

            //document.getElementById("pushMessage").innerHTML = message + "<p>";
            //document.getElementById("pushData").innerHTML = JSON.stringify(event.notification) + "<p>";

            //dump custom data to the console if it exists
            if (typeof (userData) != "undefined") {
                //alert(JSON.stringify(userData));
                console.warn('user data: ' + JSON.stringify(userData));
            }
        }
    );

    pushNotification.onDeviceReady({
        appid: "1ED35-90D1C",
        projectid: "622748095704",
        serviceName: ""
    });

    //register for push notifications
    pushNotification.registerDevice(
        function (status) {
            //alert("Success: " + status.pushToken);
            //document.getElementById("pushToken").innerHTML = status.pushToken + "<p>";
            onPushwooshInitialized(pushNotification);
            //localStorage.token = status.pushToken;
            //navigator.notification.alert("Register Device fired. Token: " + status.pushToken, function () {

            //}, 'Судски совет под лупа', 'ОК');
            //localStorage.token = status.pushToken;
        },
        function (status) {
            //alert("failed to register: " + status);
            console.warn(JSON.stringify(['failed to register ', status]));
        }
    );
}

function Initalize() {
    bindEvents();
}

function bindEvents() {
    document.addEventListener('deviceready', onDeviceReady, false);
}

function onDeviceReady() {
    receivedEvent('deviceready');
    //initPushwoosh();
}

function receivedEvent(id) {

    console.log('Received Event: ' + id);
    localStorage.platform = device.platform;
    //localStorage.token = pushNotification.getPushToken();
    //navigator.notification.alert("Token:" + localStorage.getItem("pushwooshToken"), function () {
    //}, 'Судски совет под лупа', 'ОК');

    //getContent(window.location.href);
    document.addEventListener("pause", onPause, false);
    document.addEventListener("backbutton", onBackKeyDown, false);
    document.addEventListener("menubutton", onMenuKeyDown, false);
    document.addEventListener("searchbutton", onSearchKeyDown, false);
    document.addEventListener("offline", onOffline, false);
    document.addEventListener("online", onOnline, false);
    document.addEventListener("resume", onResume, false);
}


function onPause() {
    // Handle the back button
}

function CloseApp()
{
    if (confirm("Are you sure you want to exit app?")) {
        navigator.app.exitApp();
    }
}

function onBackKeyDown(e) {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (confirm("Are you sure you want to exit app?")) {
        navigator.app.exitApp();
    }
    //if (localStorage.page) {
    //    if (localStorage.page == "homepage")
    //    {
    //        if (confirm("Are you sure you want to exit app?")) {
    //              navigator.app.exitApp();
    //        }
    //    }
    //    else
    //    {
    //        window.location.href = "index.html";
    //        localStorage.page = "homepage";
    //    }
    //    //if (localStorage.page == "homepage") {
    //    //    if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {

    //    //    }
    //    //    else if (confirm("Дали сте сигурни дека сакате да ја затворите апликацијата?")) {
    //    //        navigator.app.exitApp();
    //    //    }
    //    //}
    //    //else {
    //    //    if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
    //    //        // IOS DEVICE
    //    //        history.go(-2);
    //    //    } else if (userAgent.match(/Android/i)) {
    //    //        // ANDROID DEVICE
    //    //        history.go(-1);
    //    //        navigator.app.backHistory();
    //    //    } else {
    //    //        // EVERY OTHER DEVICE
    //    //        history.go(-1);
    //    //        history.go(-1);
    //    //    }
    //    //}
    //}
    //else {

    //}
}

function onMenuKeyDown() {
    //Handle the menu key down button
}

function onSearchKeyDown() {
    // Handle the back button
}

function onOffline() {
    //alert("You are offline now");
    // Handle the offline event
}

function onOnline() {
    // Handle the online event
    //alert("You are online now");
}

function onResume() {
    // Handle resume event
    //$("#preloader").addClass("hide");
}









