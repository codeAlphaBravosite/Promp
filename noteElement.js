import { formatDate } from './dateUtils.js';
import { copyToClipboard } from './clipboardUtils.js';
import { DialogManager } from './dialog.js';
const dialog = new DialogManager();

export function createNoteElement(note, noteManager, onNoteUpdate) {
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note';
    noteDiv.dataset.noteId = note.id;
    noteDiv.innerHTML = `
        <div class="note-header">
            <div class="note-date">${formatDate(note.createdAt)}</div>
            <div class="note-actions">
                <button class="note-btn" data-action="moveUp" title="Move up">
                    <span class="material-icons">arrow_upward</span>
                </button>
                <button class="note-btn" data-action="moveDown" title="Move down">
                    <span class="material-icons">arrow_downward</span>
                </button>
                <button class="note-btn" data-action="copy" title="Copy note content">
                    <span class="material-icons">content_copy</span>
                </button>
                <button class="note-btn ${note.isLocked ? 'locked' : ''}" data-action="lock" title="Toggle lock">
                    <span class="material-icons">${note.isLocked ? 'lock' : 'lock_open'}</span>
                </button>
                <button class="note-btn delete-btn" data-action="delete" title="Delete note">
                    <span class="material-icons">delete</span>
                </button>
            </div>
        </div>
        <input type="text" 
            class="note-title ${note.isLocked ? 'locked' : ''}"
            placeholder="Note title"
            value="${note.title || ''}"
            ${note.isLocked ? 'readonly' : ''}
        >
        <textarea
            class="note-content ${note.isLocked ? 'locked' : ''}"
            placeholder="Write your note here..." spellcheck="false" 
            ${note.isLocked ? 'readonly' : ''}
        >${note.content || ''}</textarea>
    `;

    setupNoteEventListeners(noteDiv, note, noteManager, onNoteUpdate);
    return noteDiv;
}

function setupNoteEventListeners(noteDiv, note, noteManager, onNoteUpdate) {
    const titleInput = noteDiv.querySelector('.note-title');
    const textarea = noteDiv.querySelector('.note-content');

    titleInput.addEventListener('input', () => {
        noteManager.updateNote(note.id, { title: titleInput.value });
    });

    textarea.addEventListener('input', () => {
        noteManager.updateNote(note.id, { content: textarea.value });
    });

    noteDiv.querySelectorAll('.note-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = btn.dataset.action;
            handleNoteAction(action, note, noteManager, noteDiv, titleInput, textarea, btn, onNoteUpdate);
        });
    });
}

function handleNoteAction(action, note, noteManager, noteDiv, titleInput, textarea, btn, onNoteUpdate) {
    switch(action) {
        case 'copy':
            copyToClipboard(textarea.value);
            break;
        case 'lock':
            handleLockToggle(note, noteManager, titleInput, textarea, btn);
            break;
        case 'delete':
            handleDelete(note, noteManager, noteDiv);
            break;
        case 'moveUp':
        case 'moveDown':
            noteManager.moveNote(note.id, action === 'moveUp' ? 'up' : 'down');
            onNoteUpdate();
            break;
    }
}

function handleLockToggle(note, noteManager, titleInput, textarea, btn) {
    noteManager.toggleLock(note.id);
    [titleInput, textarea].forEach(el => {
        el.classList.toggle('locked');
        el.readOnly = !el.readOnly;
    });
    btn.classList.toggle('locked');
    btn.querySelector('.material-icons').textContent = 
        textarea.readOnly ? 'lock' : 'lock_open';
}

async function handleDelete(note, noteManager, noteDiv) {
    const confirmed = await dialog.confirm({
        title: 'Delete Note',
        message: 'Are you sure?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
    });

    if (confirmed) {
        noteManager.deleteNote(note.id);
        noteDiv.remove();
    }
}
