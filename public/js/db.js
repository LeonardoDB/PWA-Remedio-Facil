// enable offline data
db.enablePersistence()
  .catch(function (err) {
    if (err.code == 'failed-precondition') {
      // probably multible tabs open at once
      console.log('persistance failed');
    } else if (err.code == 'unimplemented') {
      // lack of browser support for the feature
      console.log('persistance not available');
    }
  });

// real-time listener
db.collection('medicine').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if (change.type === 'added') {
      renderMedicine(change.doc.data(), change.doc.id);
      schedulePushNotification(change.doc.data());
    }
    if (change.type === 'removed') {
      removeMedicine(change.doc.id);
    }
  });
});

// add new medicine
const form = document.querySelector('form');
form.addEventListener('submit', evt => {
  evt.preventDefault();

  const medicine = {
    name: form.name.value,
    date: new Date(form.date.value)
  };


  db.collection('medicine').add(medicine).catch(err => console.log(err));

  form.name.value = '';
  form.date.value = '';
});

// remove a medicine
const medicineContainer = document.querySelector('.medicine');
medicineContainer.addEventListener('click', evt => {
  if (evt.target.getAttribute('data-name') === 'delete') {

    const id = evt.target.getAttribute('data-id');
    db.collection('medicine').doc(id).delete();

  } else if (evt.target.getAttribute('data-name') === 'push') {

    const id = evt.target.getAttribute('data-id');
    db.collection('medicine').doc(id).get().then((docRef) => {
      createPush(docRef.data());
    });
  }
})
