var domain = "https://ihr.ifkreativa.com";

function DownloadAndUpdateHit(guid, link)
{
    window.open(link, '_system');
    var uuid = device.uuid;
    $.ajax({
        //url: domain + "/api/updateHits",
        //data: JSON.stringify({ guid: guid, uuid: device.uuid}),
        url: domain + "/api/updateHits?guid=" + guid + "&uuid=" + uuid,
        type: "POST",
        dataType: "jsonp",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data == "success")
                UpdateNumber(guid);
            //if (data["status"] == "fail")
            //    alert("Превземањето не е евидентирано.");
            //else if (data["status"] == "success")
            //    alert("Презвемањето е евидентирано.");
        },
        error: function (e) {
            alert(e.responseText);
        }
    })
}

function getBrief(part) {
    $(".loading-wrap").removeClass("hidden");
    var take = 5;
    var skipCount = getSkipCount();
    var apiAction = "";
    if (part == "sudski")
        apiAction = "getBrief";
    else if (part == "antikorupciska")
        apiAction = "getBriefAntikorupciska";
    else apiAction = "getBriefAntidiskriminatorska";

    $.ajax({
        url: domain + "/api/" + apiAction + "?lang=mk&skip=" + skipCount + "&take=" + take,
        type: "GET",
        dataType: "jsonp",
        success: function (data) {
            if (data["status"] == "OK") {
                var html = "";
                $.each(data["messages"], function (index, el) {
                    html += "<div class='page-blog-list' onclick='OpenCloseItem(this)'>"
                        //+ "<div class='page-blog-tags'><i class='ion-calendar date-icon'></i> Објавено на: " + el.publishDate + "</div><h4 class='page-blog-title'>" + el.title + "</h4>"
                        + "<div class='page-blog-tags'>" + el.publishDate + "</div><h4 class='page-blog-title'>" + el.title + "</h4>"
                        + "<div class='page-blog-content hidden'><p>" + el.description + "</p>"
                        + "</div><div class='clear'></div>"
                            + "</div><div class='decoration'></div>";
                });
                //html += "<div>Token: " + localStorage.token + "</div>"
                $(".blog-posts").append(html);
                $(".loading-wrap").addClass("hidden");
                if (!data["hasMore"])
                    $(".btn-get-events").hide();
            }
            else
            {
                var html = "";
                $(".loading-wrap").addClass("hidden");
                html += "Во моментов нема бриф информации за приказ";
                $(".blog-posts").append(html);
                $(".btn-get-events").hide();
            }
        },
        error: function (error) {
            //navigator.notification.alert(
            //    error,  
            //    onNoNetworkConfirm,
            //    'Порака',
            //    'ОК' 
            //);
            showNoNetwork();
        }
    
    })
}

function getEvents(part) {
    $(".loading-wrap").removeClass("hidden");
    var take = 5;
    var skipCount = getSkipCount();

    var apiAction = "";
    if (part == "sudski")
        apiAction = "getMessages";
    else if (part == "antikorupciska")
        apiAction = "getMessagesAntikorupciska";
    else apiAction = "getMessagesAntidiskriminatorska";

    $.ajax({
        url: domain + "/api/" + apiAction + "?lang=mk&skip=" + skipCount + "&take=" + take,
        type: "GET",
        dataType: "jsonp",
        success: function (data) {
            if (data["status"] == "OK") {
                var html = "";
                $.each(data["messages"], function (index, el) {
                    html += "<div class='page-blog-list' onclick='OpenCloseItem(this)'>"
                        + "<div class='page-blog-tags'>" + el.publishDate + "</div><h4 class='page-blog-title'>" + el.title + "</h4>"
                        + "<div class='page-blog-content hidden'><p>" + el.description + "</p>"
                        + "</div><div class='clear'></div>"
                            + "</div><div class='decoration'></div>";

                });
                $(".blog-posts").append(html);
                $(".loading-wrap").addClass("hidden");
                if (!data["hasMore"])
                    $(".btn-get-events").hide();
            }
            else {
                var html = "";
                $(".loading-wrap").addClass("hidden");
                html += "Во моментов нема информации за приказ";
                $(".blog-posts").append(html);
                $(".btn-get-events").hide();
            }

        },
        error: function (error)
        {
            showNoNetwork();
        }

    })
}

function getDocuments(_type, part) {
    $(".loading-wrap").removeClass("hidden");
    var take = 5;
    var skipCount = getSkipCount();

    var apiAction = "";
    if (part == "sudski")
        apiAction = _type == "povrzani-dokumenti" ? "getDocuments" : "getReports";
    else if (part == "antikorupciska")
        apiAction = _type == "povrzani-dokumenti" ? "getDocumentsAntikorupciska" : "getReportsAntikorupciska";
    else apiAction = _type == "povrzani-dokumenti" ? "getDocumentsAntidiskriminatorska" : "getReportsAntidiskriminatorska";
   
    $.ajax({
        url: domain + "/api/" + apiAction + "?skip=" + skipCount + "&take=" + take,
        type: "GET",
        dataType: "jsonp",
        success: function (data) {
            if (data["status"] == "OK") {
                var html = "";
                $.each(data["documents"], function (index, el) {
                    html += '<div class="page-blog-list">' +
                                '<div class="page-blog-tags">' + el.publishDate + '</div>' +
                                '<h4 class="page-blog-title">' + el.name + '</h4>' +
                                '<div class="page-blog-list-by">' +
                                    '<a class="button btn-download" onClick="DownloadAndUpdateHit(\'' + el.guid + '\',\'' + domain + el.link + '\')"><i class="ion-ios-download date-icon"></i> Превземи</a>' +
                                '</div>' +
                                '<div class="clear"></div>' +
                                //'<div class="">вкупно превземања: <span class="doc-' + el.guid + '">' + el.hits + '</span></div>' +
                            '</div>' +
                            '<div class="decoration"></div>';

                });
                $(".loading-wrap").addClass("hidden");
                $(".blog-posts").append(html);

                if (!data["HasMore"])
                    $(".btn-get-events").hide();
            }
            else {
                var html = "";
                $(".loading-wrap").addClass("hidden");
                html += "Во моментов нема информации за приказ";
                $(".blog-posts").append(html);
                $(".btn-get-events").hide();
            }
        },
        error: function (error) {
            showNoNetwork();
        }
    });
    
}

function getSkipCount() {
    return $(".page-blog-list").length > 0 ? $(".page-blog-list").length : 0;
}

function getContent(location) {
    if (location.includes("kvartalni.html")) {
        localStorage.page = "kvartalni-sudski";
        getDocuments('kvartalni-izvestai','sudski');
    }
    else if (location.includes("kvartalni-antidiskriminatorska.html")) {
        localStorage.page = "kvartalni-antisdiskriminatorska";
        getDocuments('kvartalni-izvestai','antidiskriminatorska');
    }
    else if (location.includes("kvartalni-antikorupciska.html")) {
        localStorage.page = "kvartalni-antikorupciska";
        getDocuments('kvartalni-izvestai', 'antikorupciska');
    }
    else if (location.includes("dokumenti.html")) {
        localStorage.page = "povrzani-dokumenti-sudski";
        getDocuments('povrzani-dokumenti','sudski');
    }
    else if (location.includes("dokumenti-antikorupciska.html")) {
        localStorage.page = "povrzani-dokumenti-antikorupciska";
        getDocuments('povrzani-dokumenti', "antikorupciska");
    }
    else if (location.includes("dokumenti-antidiskriminatorska.html")) {
        localStorage.page = "povrzani-dokumenti-antidsikriminatorska";
        getDocuments('povrzani-dokumenti', "antidsikriminatorska");
    }
    else if (location.includes("events.html")) {
        //localStorage.page = "homepage";
        localStorage.page = "events-sudski";
        getEvents("sudski");
    }
    else if (location.includes("events-antikorupciska.html")) {
        //localStorage.page = "homepage";
        localStorage.page = "events-antikorupciska";
        getEvents("antikorupciska");
    }
    else if (location.includes("events-antidiskriminatorska.html")) {
        //localStorage.page = "homepage";
        localStorage.page = "events-antidiskriminatorska";
        getEvents("antidiskriminatorska");
    }
    else if (location.includes("index-sudski.html"))
    {
        getBrief("sudski");
        localStorage.page = "brief-sudski";
    }
    else if (location.includes("index-antidiskriminatorska.html")) {
        getBrief("antidiskriminatorska");
        localStorage.page = "brief-antidiskriminatorska";
    }
    else{
        getBrief("antikorupciska");
        localStorage.page = "brief-antikorupciska";
    }
}

function showNoNetwork() {
    navigator.notification.alert(
        'Во моментов немате активна интернет конекција. Вклучете интернет и стиснете ок.',  // message
        onNoNetworkConfirm,              // callback to invoke with index of button pressed
        'Порака',            // title
        'ОК'          // buttonLabels
    );
}

function onNoNetworkConfirm() {
    getContent(window.location.href);
}

function UpdateNumber(guid)
{
    var number = parseInt($(".doc-" + guid).text());
    number = number + 1;
    $(".doc-" + guid).text(number);
}

function OpenCloseItem(el)
{
    if ($(el).find(".page-blog-content").hasClass("hidden"))
        $(el).find(".page-blog-content").removeClass("hidden");
    else $(el).find(".page-blog-content").addClass("hidden")
}