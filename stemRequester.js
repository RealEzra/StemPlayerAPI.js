var songRequest = new XMLHttpRequest();

function getStems(promptMessage="Please enter a URL") {
  let url = prompt(promptMessage);
  songRequest.open('POST', 'https://cors-anywhere.herokuapp.com/https://api.stemplayer.com/tracks', false);
  songRequest.setRequestHeader('authority', 'https://api.stemplayer.com');
  songRequest.setRequestHeader('content-type', 'application/json;charset=UTF-8');
  songRequest.setRequestHeader('accept', '*/*');
  songRequest.send(JSON.stringify({'link': `${url}`, 'stem_codec': 'mp3'}));
  var r = JSON.parse(songRequest.response);
  if ((songRequest.status >= 200 && songRequest.status <= 202)
  && (r.data.status = 'ready')) {
    var stems = r.data.stems;// shortens variables defined below
    //var metadata = r.data.metadata;

    //var album = metadata.album;
    //var artist = metadata.artist;
    //var bpm = metadata.bpm;//Returned as number
    //var duration = metadata.duration;// Returned as float in seconds
    //var songTitle = metadata.title;
    var vocals = stems.vocals;
    var other = stems.other;
    var drums = stems.drums;
    var bass = stems.bass;
    return console.log(`
    Vocals: ${vocals}
    Other: ${other}
    Drums: ${drums}
    Bass: ${bass}`);
  } else if (r.data.status != 'ready' ) { // If files are not ready recheck status
    console.log("Files not ready. Trying again.");
    (function recheckStatus(i) {
      setTimeout(function() {
        var songId = r.data.id
        songRequest.open('GET', `https://cors-anywhere.herokuapp.com/https://api.stemplayer.com/tracks/${songId}`, false);
        songRequest.setRequestHeader('authority', 'https://api.stemplayer.com');
        songRequest.setRequestHeader('content-type', 'application/json;charset=UTF-8');
        songRequest.setRequestHeader('accept', '*/*');
        songRequest.send();
        var newr = JSON.parse(songRequest.response);
        if (newr.data.status = 'ready') {
          var stems = newr.data.stems;
          var vocals = stems.vocals;
          var other = stems.other;
          var drums = stems.drums;
          var bass = stems.bass;
          return console.log(`
          Vocals: ${vocals}
          Other: ${other}
          Drums: ${drums}
          Bass: ${bass}`);
        } else { console.warn("Something went wrong trying again in 5 seconds!") }
        if (--i) recheckStatus(i);
      }, 5000)
})(5);

} else { console.warn("Program failed to run properly!") }

}
