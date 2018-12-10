window.onload = function () {
  // countdown
  setInterval(function() {
    var nowDate = new Date()
    var now = nowDate.getTime();
    var range = countdownDate.getTime() - now;

    var days = Math.floor(range / (1000 * 60 * 60 * 24));
    var hours = Math.floor((range % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((range % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((range % (1000 * 60)) / 1000);

    if (countdownDate < nowDate) {
      document.getElementById("ferme-countdown").innerHTML = "Terminé !";
    } else {
      document.getElementById("ferme-countdown").innerHTML = "Plus que : " + days + " jours, " + hours + " heures, " + minutes + " minutes et " + seconds + " secondes.";
    }
  }, 1000);

  var form = document.querySelector('#crowdfunding-form');
  var submitbutton = form.querySelector('button[type="submit"]');
  var message = document.querySelector('#crowdfunding-form-message');
  var messagebox = message.querySelector('.ferme-notification');
  var messagebody = messagebox.querySelector('.ferme-notification-body');
  var messagedelete = messagebox.querySelector('.delete');

  messagedelete.addEventListener('click', function(e) {
    e.preventDefault();
    message.classList.add('ferme-hidden');
    messagebody.innerHTML = "";
    // remove notification color
    messagebox.classList.remove('is-warning');
    messagebox.classList.remove('is-success');
    messagebox.classList.remove('is-danger');
  });

  form.onsubmit = function (e) {
    // stop the regular form submission
    e.preventDefault();

    // collect the form data while iterating over the inputs
    var data = {};
    for (var i = 0, ii = form.length; i < ii; ++i) {
      var input = form[i];
      if (input.name) {
        if (input.type) {
          if (input.type == "checkbox") {
            data[input.name] = input.checked;
          } else {
            data[input.name] = input.value;
          }
        } else {
          data[input.name] = input.value;
        }
      }
    }

    // construct an HTTP request
    var xhr = new XMLHttpRequest();
    xhr.open(form.method, form.action, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    // send the collected data as JSON
    xhr.send(JSON.stringify(data));

    function submissionComplete() {
      // done TODO
      console.log(JSON.stringify(data));
      submitbutton.classList.remove('is-loading');
      messagebody.innerHTML = "L'envoi du formulaire a réussi. " + this.responseText;
      messagebox.classList.add('is-success');
      message.classList.remove('ferme-hidden');
      message.scrollIntoView();
    };

    function submissionFailed() {
      // done TODO
      console.log(JSON.stringify(data));
      submitbutton.classList.remove('is-loading');
      messagebody.innerHTML = "L'envoi du formulaire a échoué. " + this.responseText;
      messagebox.classList.add('is-danger');
      message.classList.remove('ferme-hidden');
      message.scrollIntoView();
    };

    function submissionCanceled() {
      // done TODO
      submitbutton.classList.remove('is-loading');
      messagebody.innerHTML = "L'envoi du formulaire a été annulé.";
      messagebox.classList.add('is-warning');
      message.classList.remove('ferme-hidden');
      message.scrollIntoView();
    };

    function updateProgress() {
      submitbutton.classList.add('is-loading');
    };

    xhr.addEventListener("progress", updateProgress);
    xhr.addEventListener("load", submissionComplete);
    xhr.addEventListener("error", submissionFailed);
    xhr.addEventListener("abort", submissionCanceled);
  };
};
