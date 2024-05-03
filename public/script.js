let notesList = document.getElementById('notes-list');

//color functions
// function openColors(){
//     console.log('Open colors');
//     document.getElementById('colorOptions').style.display="block";

// }

document.getElementById("colors").addEventListener("click", function() {
    var colorOptions = document.getElementById("colorOptions");
    if (colorOptions.style.display === "none") {
      colorOptions.style.display = "block";
    } else {
      colorOptions.style.display = "none";
    }
  });
  
  document.querySelectorAll(".color").forEach(item => {
    item.addEventListener("click", function() {
      var selectedColor = this.style.backgroundColor;
      console.log(selectedColor);
      document.getElementById("colors").style.color = selectedColor;
      document.getElementById("colorOptions").style.display = "none";
    });
  });
  

//color function end

function showNoteInputs() {
    var noteInputs = document.getElementById("noteInputs");
    noteInputs.style.display = "flex";
    body.addEventListener('click',function(e){
        if(e.target.id != "title" || e.target.id != "noteInputs" || e.target.id != "text"){
            noteInputs.style.display = "none";
        }
    })
    // document.getElementById("text").focus();
}

function hideNoteInputs() {
    var noteInputs = document.getElementById("noteInputs");
    noteInputs.style.display = "none";
    document.removeEventListener("click", hideOnOutsideClick);
    document.body.removeEventListener('click', hideNoteInputs);
}

function hideOnOutsideClick(event) {
    var noteInputs = document.getElementById("noteInputs");
    var titleInput = document.getElementById("title");
    if (!noteInputs.contains(event.target) && event.target !== titleInput) {
        hideNoteInputs();
    }
}

// Function to fetch notes from API
async function fetchNotes() {
    try {
        const response = await fetch('http://localhost:5000/api/v1/notes/');
        const data = await response.json();
        return data.notes || [];
    } catch (error) {
        console.error('Error fetching notes:', error);
        return [];
    }
}

// Function to render notes on the page
async function renderNotes(searchNotes=[]) {
    const notes = await searchNotes.length>0 ? searchNotes : await fetchNotes();
    notesList.innerHTML = '';
    notes.forEach(note => {
        const li = document.createElement('li');
        li.classList.add('notes');
        li.style.background = note.color;
        li.innerHTML = `<h1>${note.title}</h1>
             <p>${note.text}</p>
             <div class="notes-add-buttons">
            <button onclick="deleteNote('${note._id}')"><img src="img/svgexport-20.svg" alt=""/></button>
            <button onclick="editNote('${note._id}')"><img src="img/edit_icon.svg" alt="" /></button>
            <button id="editcolorbtn" onclick="editColorNote('${note._id}')"><img src="img/svgexport-16.svg" alt="" /></button>
            <div id="${note._id}" class="hidden-color" data-ns-id="${note._id}">
            <div class="editcolor" style="background-color: red;"></div>
            <div class="editcolor" style="background-color: blue;"></div>
            <div class="editcolor" style="background-color: green;"></div>
            <div class="editcolor" style="background-color: yellow;"></div>
          </div>
            <button onclick="archieveNote('${note._id}')"><img src="img/svgexport-18.svg" alt="" /></button></div>`;
        notesList.appendChild(li);
    });
} 

async function updateNoteColor(noteId, color) {
    // Assuming you have an API endpoint to update the color of a note by its ID
    await fetch(`http://localhost:5000/api/v1/notes/${noteId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ color })
    });
    renderNotes();
}

async function editColorNote(noteId) {
    
    
    // Show the color options div
    const editcolorOptions = document.getElementById(noteId);
    console.log(noteId);
    console.log(editcolorOptions.getAttribute("data-ns-id"));
    const dataIdAttr = editcolorOptions.getAttribute("data-ns-id")
    if(editcolorOptions.classList.value == "hidden-color"){
    editcolorOptions.classList.remove('hidden-color');
    editcolorOptions.classList.add('editcolorOptionsActive');
}
    else{
        editcolorOptions.classList.remove('editcolorOptionsActive');
        editcolorOptions.classList.add('hidden-color');
        console.log("in else")
    }
    

    document.querySelectorAll(".editcolor").forEach(item => {
        item.addEventListener("click", function () {
          var selectedColor = this.style.backgroundColor;
          console.log(selectedColor);
          updateNoteColor(noteId, selectedColor);
          editcolorOptions.classList.remove('editcolorOptionsActive');
        editcolorOptions.classList.add('hidden-color');
        });
      });

      

}



// Function to add a new note with validation
async function addNote() {
    const title = document.getElementById('title').value.trim();
    const text = document.getElementById('text').value.trim();
    const color = document.getElementById('colors').style.color;
    const label = document.getElementById('label').value.trim();
    const isStarred = document.getElementById('isStarred').checked;
    document.getElementById('colors').style.color = "";

    // Validate if title is provided
    if (!title) {
        alert('Please add at least a title.');
        return;
    }

    const newData = {
        title,
        text,
        color,
        label,
        isStarred
    };

    try {
        const response = await fetch('http://localhost:5000/api/v1/notes/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newData)
        });
        if (response.ok) {
            console.log('Note added successfully!');
            const responseData = await response.json();
            renderNotes(responseData); // Render the newly added note
            document.getElementById('title').value = "";
            document.getElementById('text').value = "";
            document.getElementById('color').value = "";
            document.getElementById('isStarred').checked = false;
            hideNoteInputs();

        } else {
            console.error('Failed to add note:', response.statusText);
        }
    } catch (error) {
        console.error('Error adding note:', error);
    }
}

document.getElementById("searchBtn").addEventListener("click", function () {
    const searchQuery = document.getElementById("search").value;
    console.log(searchQuery);
    fetch(`http://localhost:5000/api/v1/notes/?search=${searchQuery}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("data",data.notes);
        const notes = data.notes;
        renderNotes(notes);
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
      });
  });

function renderNoteInHTML(note) {
    const notesList = document.getElementById('notes-list');
    const noteElement = document.createElement('li');
    li.style.background = note.color;
    noteElement.innerHTML = `
        <h1 style="background-color: ${note.color};">${note.title}</h1>
        <p>${note.text}</p>
    `;
    notesList.appendChild(noteElement);
}


// Function to delete a note
// async function deleteNote(noteId) {
//     try {
//         const response = await fetch(`http://localhost:5000/api/v1/notes/${noteId}`, {
//             method: 'DELETE'
//         });
//         if (response.ok) {
//             console.log('Note deleted successfully!');
//             renderNotes();
//         } else {
//             console.error('Failed to delete note:', response.statusText);
//         }
//     } catch (error) {
//         console.error('Error deleting note:', error);
//     }
// }

async function deleteNote(noteId) {
    console.log("Delete Function called");
    try {
        // Fetch the complete data of the note
        const noteResponse = await fetch(`http://localhost:5000/api/v1/notes/${noteId}`)
        const noteData = await noteResponse.json();
        console.log("Note response in Delete method:", noteData.note);

        // Post the complete note data to the bin API
        const binResponse = await fetch(`http://localhost:5000/api/v1/bin/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteData.note)
        });

        if (!binResponse.ok) {
            throw new Error('Failed to move note to bin:', binResponse.statusText);
        }

        // If moving to bin is successful, then proceed to delete
        const deleteResponse = await fetch(`http://localhost:5000/api/v1/notes/${noteId}`, {
            method: 'DELETE'
        });

        if (deleteResponse.ok) {
            console.log('Note moved to bin and deleted successfully!');
            renderNotes();
        } else {
            console.error('Failed to delete note:', deleteResponse.statusText);
        }
    } catch (error) {
        console.error('Error moving note to bin and deleting:', error);
    }
}

// archieve note
async function archieveNote(noteId) {
    console.log("Delete Function called");
    try {
        // Fetch the complete data of the note
        const noteResponse = await fetch(`http://localhost:5000/api/v1/notes/${noteId}`)
        const noteData = await noteResponse.json();
        console.log("Note response in Delete method:", noteData.note);

        // Post the complete note data to the bin API
        const binResponse = await fetch(`http://localhost:5000/api/v1/archieve/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteData.note)
        });

        if (!binResponse.ok) {
            throw new Error('Failed to move note to bin:', binResponse.statusText);
        }

        // If moving to bin is successful, then proceed to delete
        const deleteResponse = await fetch(`http://localhost:5000/api/v1/notes/${noteId}`, {
            method: 'DELETE'
        });

        if (deleteResponse.ok) {
            console.log('Note moved to bin and deleted successfully!');
            renderNotes();
        } else {
            console.error('Failed to delete note:', deleteResponse.statusText);
        }
    } catch (error) {
        console.error('Error moving note to bin and deleting:', error);
    }
}


// drawer functions
const menuTrigger = document.querySelector('.menu-trigger');
const menu = document.querySelector('.menu');

let menuOpen = 1;
menuTrigger.addEventListener('click', () => {
	if (menuOpen == 1) {
		menu.classList.add('menuOpen');
		menuTrigger.classList.add('triggerOpened');
		menuOpen = 0;
	} else {
		menu.classList.remove('menuOpen');
		menuTrigger.classList.remove('triggerOpened');
		menuOpen = 1;
	}
});


// Initial rendering of notes
renderNotes();
