window.onload = function () {
    setInterval(function() {
      var now = new Date().getTime();
      var range = countdownDate.getTime() - now;

      var days = Math.floor(range / (1000 * 60 * 60 * 24));
      var hours = Math.floor((range % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((range % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((range % (1000 * 60)) / 1000);

      if (range < 0) {
        clearInterval(x);
        document.getElementById("ferme-countdown").innerHTML = "Terminé !";
      } else {
        document.getElementById("ferme-countdown").innerHTML = days + " jours, " + hours + " heures, " + minutes + " minutes et " + seconds + " secondes ";
      }
  }, 1000);
}
