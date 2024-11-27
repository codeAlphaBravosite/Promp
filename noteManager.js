export class NoteManager {
  constructor() {
    this.notes = JSON.parse(localStorage.getItem('notes')) || [];
  }

  addNote() {
    const note = {
      id: Date.now(),
      title: '',
      content: '',
      isLocked: false,
      createdAt: new Date().toISOString(),
      order: this.notes.length
    };
    this.notes.push(note);
    this.saveToLocalStorage();
    return note;
  }

  updateNote(id, updates) {
    const note = this.notes.find(note => note.id === id);
    if (note && !note.isLocked) {
      Object.assign(note, updates);
      this.saveToLocalStorage();
    }
  }

  deleteNote(id) {
    const index = this.notes.findIndex(note => note.id === id);
    if (index !== -1) {
      this.notes.splice(index, 1);
      this.saveToLocalStorage();
    }
  }

  moveNote(id, direction) {
    const index = this.notes.findIndex(note => note.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < this.notes.length) {
      const note = this.notes[index];
      this.notes.splice(index, 1);
      this.notes.splice(newIndex, 0, note);
      this.saveToLocalStorage();
    }
  }

  toggleLock(id) {
    const note = this.notes.find(note => note.id === id);
    if (note) {
      note.isLocked = !note.isLocked;
      this.saveToLocalStorage();
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }
}