'use strict';

const form = document.querySelector('.brief-form');
const statusBox = document.querySelector('#form-status');
const submitButton = form?.querySelector('.submit-button');
const submitLabel = submitButton?.querySelector('span:first-child');
const fileInput = document.querySelector('#file');
const fileName = document.querySelector('#file-name');
const messageInput = document.querySelector('#message');
const messageCount = document.querySelector('#message-count');
const year = document.querySelector('#year');
const MAX_FILE_SIZE = 10 * 1024 * 1024;

if (year) year.textContent = String(new Date().getFullYear());

function showStatus(message, type) {
  if (!statusBox) return;
  statusBox.textContent = message;
  statusBox.className = `form-status is-visible is-${type}`;
}

function clearStatus() {
  if (!statusBox) return;
  statusBox.textContent = '';
  statusBox.className = 'form-status';
}

if (fileInput && fileName) {
  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    fileName.textContent = file ? file.name : 'Choose a file to attach';
    clearStatus();
    if (file && file.size > MAX_FILE_SIZE) {
      fileInput.value = '';
      fileName.textContent = 'Choose a file to attach';
      showStatus('That file is larger than 10 MB. Please choose a smaller file.', 'error');
    }
  });
}

if (messageInput && messageCount) {
  const updateCount = () => { messageCount.textContent = `${messageInput.value.length} / 3000`; };
  messageInput.addEventListener('input', updateCount);
  updateCount();
}

if (form && submitButton && submitLabel) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearStatus();

    if (!form.reportValidity()) return;

    const attachment = fileInput?.files?.[0];
    if (attachment && attachment.size > MAX_FILE_SIZE) {
      showStatus('That file is larger than 10 MB. Please choose a smaller file.', 'error');
      return;
    }

    const originalLabel = 'Send project brief';
    submitButton.disabled = true;
    submitLabel.textContent = 'Sending brief…';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error('The server returned an unexpected response. Please try again later.');
      }

      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Your brief could not be sent. Please try again.');
      }

      form.reset();
      if (fileName) fileName.textContent = 'Choose a file to attach';
      if (messageCount) messageCount.textContent = '0 / 3000';
      showStatus(result.warning || 'Thanks — your project brief has been sent. We’ll be in touch soon.', result.warning ? 'error' : 'success');
    } catch (error) {
      showStatus(error instanceof Error ? error.message : 'Something went wrong. Please try again.', 'error');
    } finally {
      submitButton.disabled = false;
      submitLabel.textContent = originalLabel;
    }
  });
}
