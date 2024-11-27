export function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      showToast('Copied to clipboard!');
    })
    .catch(err => {
      showToast('Failed to copy text');
    });
}

export function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}