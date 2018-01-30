
$(document).ready(function() {
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', 'assets/music/spaghetti_guitar_in_space.mp3');

    audioElement.autoplay = true;

    audioElement.addEventListener('ended', function() {
        this.play();
    }, false);

    $('#play').click(function() {
        audioElement.play();
        $("#status").text("Status: Playing");
    });

    $('#pause').click(function() {
        audioElement.pause();
        $("#status").text("Status: Paused");
    });

    $('#restart').click(function() {
        audioElement.currentTime = 0;
    });
    SetVolume = function(val)
    {
    var audio = document.getElementById('music');
    audioElement.volume = val / 100;
    }


});
