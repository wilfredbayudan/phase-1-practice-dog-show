document.addEventListener('DOMContentLoaded', () => {

  const dbUrl = 'http://localhost:3000/dogs';
  const tableBody = document.querySelector('#table-body');
  const inputName = document.querySelector('input[name="name"]');
  const inputBreed = document.querySelector('input[name="breed"]');
  const inputSex = document.querySelector('input[name="sex"]');
  const form = document.querySelector('#dog-form');
  let editId = false;

  // Initial render
  renderDogs();


  // Listen for edits
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (editId) {
      submitEdit(inputName.value, inputBreed.value, inputSex.value);
    } else {
      console.log('No dog to edit');
    }
    form.reset();
  })




  // Fetch dogs and call render to each dog
  function renderDogs() {
    // Reset table body
    tableBody.textContent = '';
    fetch(dbUrl)
      .then(res => res.json())
      .then(data => {
        data.forEach(dog => {
          const { id, name, breed, sex } = dog;
          appendDog(id, name, breed, sex);
        })
      })
      .catch(err => console.log(err))
  }

  function appendDog(id, name, breed, sex) {
    // Create a table row with data
    const tr = document.createElement('tr');
    tableBody.appendChild(tr);
    const tdName = document.createElement('td');
    tdName.textContent = name;
    const tdBreed = document.createElement('td');
    tdBreed.textContent = breed;
    const tdSex = document.createElement('td');
    tdSex.textContent = sex;
    const tdEdit = document.createElement('td');
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit Dog';
    editBtn.addEventListener('click', () => {
      populateEdit(id, name, breed, sex)
    })
    tdEdit.appendChild(editBtn);

    // Append created row
    tr.appendChild(tdName);
    tr.appendChild(tdBreed);
    tr.appendChild(tdSex);
    tr.appendChild(tdEdit);
    tableBody.appendChild(tr);
  }

  // Populate form and update editId
  function populateEdit(id, name, breed, sex) {
    editId = id;
    inputName.value = name;
    inputBreed.value = breed;
    inputSex.value = sex;
  }
  
  // Submit edit
  function submitEdit(name, breed, sex) {
    console.log(`Editing Dog ID ${editId}`);

    const editConfig = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        name, breed, sex
      })
    }

    fetch(`${dbUrl}/${editId}`, editConfig)
      .then(res => res.json())
      .then(() => renderDogs())
      .catch(err => console.log(err));

    editId = false;

  }

})