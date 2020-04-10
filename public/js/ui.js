const medicine = document.querySelector('.medicine');

document.addEventListener('DOMContentLoaded', function () {
  // add medicine form
  const forms = document.querySelectorAll('.side-form');
  M.Sidenav.init(forms, { edge: 'left' });
});

// render medicine data
const renderMedicine = (data, id) => {
  const html = `
    <div class="card-panel medicine white row" data-id="${id}">
      <img src="./img/remedio.png" alt="medicine thumb">
      <div class="medicine-details">
        <div class="medicine-title">${data.name}</div>
        <div class="medicine-ingredients">${new Date(data.date.seconds * 1000).toLocaleDateString('pt-BR', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).replace(/ /g, ' ')}</div>
      </div >
      <div class="medicine-delete">
        <i class="material-icons" data-id="${id}" data-name="delete">delete_outline</i>
      </div>
      <div class="medicine-push" style="margin-right: 10px;">
        <i class="material-icons" data-id="${id}" data-name="push">notifications_active</i>
      </div>
    </div >
  `;
  medicine.innerHTML += html;
};

// remove medicine
const removeMedicine = (id) => {
  const medicine = document.querySelector(`.medicine[data-id=${id}]`);
  medicine.remove();
};

document.querySelector('.sidenav-trigger').onclick = () => {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes() + 6;
  var localDatetime = year + "-" +
    (month < 10 ? "0" + month.toString() : month) + "-" +
    (day < 10 ? "0" + day.toString() : day) + "T" +
    (hour < 10 ? "0" + hour.toString() : hour) + ":" +
    (minute < 10 ? "0" + minute.toString() : minute);
  var datetimeField = document.getElementById("date");
  datetimeField.value = localDatetime;
}

const schedulePushNotification = (data) => {
  var now = new Date();
  var dateSchedule = new Date(data.date.seconds * 1000);

  var millisDateSchedule = new Date(dateSchedule.getFullYear(), dateSchedule.getMonth(), dateSchedule.getDate(), dateSchedule.getHours(), (dateSchedule.getMinutes() - 5), 0, 0) - now;
  if (millisDateSchedule < 0) {
    return false;
  }

  setTimeout(function () {
    createPush(data);
  }, millisDateSchedule);
}

function createPush(data) {
  Push.create("Lembrete!", {
    body: `Você deve tomar o remédio ${data.name} hoje às ${
      new Date(data.date.seconds * 1000).toLocaleTimeString('pt-BR', {
        hour: '2-digit', minute: '2-digit'
      })
      } `,
    icon: "./img/remedio.png",
    onClick: function () {
      window.focus();
      this.close();
    }
  });
}