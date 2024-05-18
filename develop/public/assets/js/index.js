// Define variables to access DOM elements
let noteForm;
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let clearBtn;
let noteList;

// Check if the current page is the notes page
if (window.location.pathname === '/notes') {
  // Assign DOM elements to variables
  noteForm = document.querySelector('.note-form');
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  clearBtn = document.querySelector('.clear-btn');
  noteList = document.querySelector('#list-group');

  // Function to show an element
  const show = (elem) => {
    elem.style.display = 'block';
  };

  // Function to hide an element
  const hide = (elem) => {
    elem.style.display = 'none';
  };

  // Function to render the active note
  const renderActiveNote = () => {
    hide(saveNoteBtn);
    hide(newNoteBtn);

    if (activeNote.id) {
      show(newNoteBtn);
      noteTitle.setAttribute('readonly', true);
      noteText.setAttribute('readonly', true);
      noteTitle.value = activeNote.title;
      noteText.value = activeNote.text;
    } else {
      noteTitle.removeAttribute('readonly');
      noteText.removeAttribute('readonly');
      noteTitle.value = '';
      noteText.value = '';
    }
  };

  // Function to handle saving a note
  const handleNoteSave = () => {
    const newNote = {
      title: noteTitle.value,
      text: noteText.value
    };

    saveNote(newNote).then(() => {
      getAndRenderNotes();
      renderActiveNote();
    });
  };

  // Function to handle deleting a note
  const handleNoteDelete = (id) => {
    deleteNote(id).then(() => {
      getAndRenderNotes();
      renderActiveNote();
    });
  };

  // Function to handle viewing a note
  const handleNoteView = (e) => {
    e.preventDefault();
    const note = JSON.parse(e.target.parentElement.getAttribute('data-note'));
    activeNote = note;
    renderActiveNote();
  };

  // Function to handle viewing a new note form
  const handleNewNoteView = () => {
    activeNote = {};
    renderActiveNote();
  };

  // Event listener for saving a note
  saveNoteBtn.addEventListener('click', handleNoteSave);

  // Event listener for viewing a new note
  newNoteBtn.addEventListener('click', handleNewNoteView);

  // Event listener for clearing the form
  clearBtn.addEventListener('click', renderActiveNote);

  // Event listener for input in the note form
  noteForm.addEventListener('input', () => {
    handleRenderBtns();
  });

  // Function to render the note list
  const renderNoteList = (notes) => {
    noteList.innerHTML = '';

    notes.forEach((note) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      li.setAttribute('data-note', JSON.stringify(note));

      const span = document.createElement('span');
      span.textContent = note.title;
      span.addEventListener('click', handleNoteView);

      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('btn', 'btn-sm', 'btn-outline-danger', 'float-right');
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => handleNoteDelete(note.id));

      li.appendChild(span);
      li.appendChild(deleteBtn);
      noteList.appendChild(li);
    });
  };

  // Function to render buttons based on input fields
  const handleRenderBtns = () => {
    if (!noteTitle.value.trim() || !noteText.value.trim()) {
      hide(saveNoteBtn);
    } else {
      show(saveNoteBtn);
    }
  };

  // Function to initialize the note list and form
  const init = async () => {
    try {
      const notes = await getNotes();
      renderNoteList(notes);
      renderActiveNote();
    } catch (error) {
      console.error('Error initializing application:', error);
    }
  };

  // Call the initialization function
  init();
}
