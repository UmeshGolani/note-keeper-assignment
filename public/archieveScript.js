let notesList = document.getElementById('notes-list');

function showNoteInputs() {
    var noteInputs = document.getElementById("noteInputs");
    noteInputs.style.display = "flex";
    body.addEventListener('click',function(e){
        if(e.target.id !== "title" || e.target.id !== "noteInputs" || e.target.id !== "text"){
            // noteInputs.style.display = "none";
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
        const response = await fetch('https://note-keeper-assingment.onrender.com/api/v1/archieve/');
        const data = await response.json();
        return data.archieveNotes || [];
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
             ${note.text??`<p>${note.text}</p>`}
             <div class="notes-add-buttons">
            <button onclick="deleteNote('${note._id}')"><img src="img/svgexport-20.svg" alt=""/></button>
            <button onclick="restoreNote('${note._id}')"><img src="img/svgexport-21.svg" alt="" /></button>
            </div>`;
            
        notesList.appendChild(li);
    });
} 


// Function to add a new note with validation
async function addNote() {
    const title = document.getElementById('title').value.trim();
    const text = document.getElementById('text').value.trim();
    const color = document.getElementById('color').value.trim();
    const isStarred = document.getElementById('isStarred').checked;

    // Validate if title is provided
    if (!title) {
        alert('Please add at least a title.');
        return;
    }

    const newData = {
        title,
        text,
        color,
        isStarred
    };

    try {
        const response = await fetch('https://note-keeper-assingment.onrender.com/api/v1/archieve/', {
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
    fetch(`https://note-keeper-assingment.onrender.com/api/v1/archieve/?search=${searchQuery}`)
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


// Function to delete a note and send to bin
async function deleteNote(noteId) {
    
    try {
        const response = await fetch(`https://note-keeper-assingment.onrender.com/api/v1/archieve/${noteId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            console.log('Note deleted successfully!');
            renderNotes();
        } else {
            console.error('Failed to delete note:', response.statusText);
        }
    } catch (error) {
        console.error('Error deleting note:', error);
    }
}

//function to restore from archieve to notes
async function restoreNote(noteId) {
    console.log("Restore Function called");
    try {
        // Fetch the complete data of the note
        const archieveResponse = await fetch(`https://note-keeper-assingment.onrender.com/api/v1/archieve/${noteId}`)
        const noteData = await archieveResponse.json();
        console.log("Note response in Delete method:", noteData.archieveNote);

        // Post the complete note data to the bin API
        const noteResponse = await fetch(`https://note-keeper-assingment.onrender.com/api/v1/notes/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteData.archieveNote)
        });

        if (!noteResponse.ok) {
            throw new Error('Failed to move note to Note:', noteResponse.statusText);
        }

        // If moving to bin is successful, then proceed to delete
        const deleteResponse = await fetch(`https://note-keeper-assingment.onrender.com/api/v1/archieve/${noteId}`, {
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
