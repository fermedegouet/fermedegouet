// ferme-crowdfunding-form.js
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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
      document.getElementById("ferme-countdown").innerHTML = "Terminé <a href=\"#ferme-formulaire-pret\">(mais vous pouvez toujours participer)</a> !";
    } else {
      document.getElementById("ferme-countdown").innerHTML = "Plus que : " + days + " jours, " + hours + " heures, " + minutes + " minutes et " + seconds + " secondes. <a href=\"#ferme-formulaire-pret\">N'hésitez pas à participer !</a>";
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

    // add class is-loading to button
    submitbutton.classList.add('is-loading');

    // collect the form data while iterating over the inputs
    var data = {};
    for (var i = 0, ii = form.length; i < ii; ++i) {
      var input = form[i];
      if (input.name) {
        if (input.type) {
          if (input.type == "checkbox") {
            data[input.name] = input.checked;
          } else if (input.type == "number") {
            data[input.name] = input.valueAsNumber;
          } else {
            data[input.name] = input.value;
          }
        } else {
          data[input.name] = input.value;
        }
      }
    }

    console.debug(data);

    // construct an HTTP request
    var xhr = new XMLHttpRequest();
    xhr.open(form.method, form.action, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    // send the collected data as JSON
    xhr.send(JSON.stringify(data));

    function submissionComplete() {
      submitbutton.classList.remove('is-loading');
      if (this.readyState==4 && this.status==200) {
        messagebody.innerHTML = "Le formulaire a bien été envoyé. Vous allez recevoir un email de confirmation. Merci beaucoup pour votre soutien ! N° de référence : " + JSON.parse(this.responseText);
        messagebox.classList.remove('is-danger');
        messagebox.classList.add('is-success');
      } else {
        messagebody.innerHTML = "L'envoi du formulaire a échoué. Merci de me contacter directement à l'adresse <a href=\"mailto:contact@fermedegouet.fr?subject=Erreur dans le formulaire sur fermedegouet.fr&body=" + escapeHtml(this.responseText) + "\">contact@fermedegouet.fr</a> avec ce message d'erreur : " + escapeHtml(this.responseText);
        messagebox.classList.remove('is-success');
        messagebox.classList.add('is-danger');
      }
      message.classList.remove('ferme-hidden');
      message.scrollIntoView();
    };

    function submissionFailed() {
      submitbutton.classList.remove('is-loading');
      messagebody.innerHTML = "L'envoi du formulaire a échoué. Merci de me contacter directement à l'adresse <a href=\"mailto:contact@fermedegouet.fr\">contact@fermedegouet.fr</a>" + escapeHtml(this.responseText);
      messagebox.classList.add('is-danger');
      message.classList.remove('ferme-hidden');
      message.scrollIntoView();
    };

    function submissionCanceled() {
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
