import { NoteManager } from './src/js/noteManager.js';
import { createNoteElement } from './src/js/noteElement.js';

const noteManager = new NoteManager();
const notesContainer = document.getElementById('notesContainer');

function renderNotes() {
    notesContainer.innerHTML = '';
    const sortedNotes = [...noteManager.notes];
    sortedNotes.forEach(note => {
        notesContainer.appendChild(createNoteElement(note, noteManager, renderNotes));
    });
}

document.getElementById('addNote').addEventListener('click', () => {
    const note = noteManager.addNote();
    notesContainer.insertBefore(
        createNoteElement(note, noteManager, renderNotes),
        notesContainer.firstChild
    );
});

// Initial render
renderNotes();