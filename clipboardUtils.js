import { showToast } from './toastUtils.js';

export function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            showToast('Copied to clipboard!');
        })
        .catch(err => {
            showToast('Failed to copy text');
        });
}