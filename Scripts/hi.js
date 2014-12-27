/// <reference path="jquery-2.1.1.min.js" />
/// <reference path="bootstrap.min.js" />
/// <reference path="jsplumb/jsPlumb.min.js" />

$.getJSON("data.json", function (episodeData) {

    jsPlumb.ready(function () {

        var color = "gray";

        var instance = jsPlumb.getInstance({
            // notice the 'curviness' argument to this Bezier curve.  the curves on this page are far smoother
            // than the curves on the first demo, which use the default curviness value.			
            Connector: ["Bezier", { curviness: 50 }],
            DragOptions: { cursor: "pointer", zIndex: 2000 },
            PaintStyle: { strokeStyle: color, lineWidth: 2 },
            EndpointStyle: { radius: 9, fillStyle: color },
            HoverPaintStyle: { strokeStyle: "#ec9f2e" },
            EndpointHoverStyle: { fillStyle: "#ec9f2e" },
            Container: "chart-demo"
        });

        // suspend drawing and initialize.
        instance.doWhileSuspended(function () {
            // declare some common values:
            var arrowCommon = { foldback: 0.7, fillStyle: color, width: 14 },
                // use three-arg spec to create two different arrows with the common values:
                overlays = [
                    ["Arrow", { location: 0.7 }, arrowCommon]
                ];

            var episodeTitle = episodeData.podcast + " #" + episodeData.episode.number + ": " + episodeData.episode.title;

            // Set episode info
            $("#episodeTitle").html(episodeTitle);
            document.title = episodeTitle;
            $("#showNotesLink").attr("href", episodeData.episode.showNotesUrl);
            $("#discussLink").attr("href", episodeData.episode.discussionUrl);
            $("#chartMaker").html(episodeData.episode.chartMaker.name);
            $("#chartMaker").attr("href", episodeData.episode.chartMaker.url);

            // Set audio source
            var audioPlayer = document.getElementById("audioPlayer");
            audioPlayer.src = episodeData.episode.url;
            audioPlayer.load();

            // Load stops
            episodeData.stops.forEach(function (stop) {
                $("#chart-demo").append("<div class='windowContainer'><span class='window' id='stop"
                    + stop.id
                    + "' data-playerseek='"
                    + ((stop.seek.min * 60) + stop.seek.sec)
                    + "' data-toggle='tooltip' data-placement='top' data-original-title='"
                    + (stop.description || "")
                    + "'>"
                    //+ stop.id + " - "
                    + stop.title
                    + "</span></div>");
                $("#stop" + stop.id).css("left", (stop.position.left * 150));
                $("#stop" + stop.id).css("top", (stop.position.top * 150));
            });

            $(".window").click(function (e) {
                if (e.target.tagName == 'A') {
                    e.stopPropagation();
                }
                else {
                    console.log(this.dataset.playerseek);
                    //console.log(audioPlayer.seekable);
                    //console.log(audioPlayer);
                    if (this.dataset.playerseek != "0") {
                        audioPlayer.currentTime = this.dataset.playerseek;
                    }
                }
            });

            // add endpoints, giving them a UUID.
            // you DO NOT NEED to use this method. You can use your library's selector method.
            // the jsPlumb demos use it so that the code can be shared between all three libraries.
            var windows = jsPlumb.getSelector(".chart-demo .window");
            for (var i = 0; i < windows.length; i++) {
                instance.addEndpoint(windows[i], {
                    uuid: windows[i].getAttribute("id") + "-bottom",
                    anchor: "Bottom",
                    maxConnections: -1
                });
                instance.addEndpoint(windows[i], {
                    uuid: windows[i].getAttribute("id") + "-left",
                    anchor: "Left",
                    maxConnections: -1
                });
                instance.addEndpoint(windows[i], {
                    uuid: windows[i].getAttribute("id") + "-top",
                    anchor: "Top",
                    maxConnections: -1
                });
                instance.addEndpoint(windows[i], {
                    uuid: windows[i].getAttribute("id") + "-right",
                    anchor: "Right",
                    maxConnections: -1
                });
            }

            // Load connections
            episodeData.connections.forEach(function (connection) {
                instance.connect({
                    uuids: ["stop" + connection.from + "-" + connection.fromNode,
                        "stop" + connection.to + "-" + connection.toNode],
                    overlays: overlays
                });
            });

            // Initialize tooltips
            $(function () {
                $('[data-toggle="tooltip"]').tooltip({ html: true });
            })

            instance.draggable(windows);
        });
    });
});