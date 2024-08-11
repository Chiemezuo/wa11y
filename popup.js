// document.getElementById('improveAltText').addEventListener('click', () => {
//   chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
//     chrome.scripting.executeScript({
//       target: { tabId: tabs[0].id },
//       files: ['content.js']
//     });
//   });
// });

// import {ERROR_429} from "./constants.js";
// import {ERROR_400_OR_404} from "./constants.js";

const ERROR_400_OR_404 = "Some images are not supported or have invalid formats."
const ERROR_429 = "Your current plan has limitations on the number of API calls per minute. Consider upgrading."

document.addEventListener('DOMContentLoaded', function() {
  const apiKeySection = document.getElementById('apiKeySection');
  const apiKeyInput = document.getElementById('apiKeyInput');
  const saveApiKeyButton = document.getElementById('saveApiKey')
  const improveAltTextButton = document.getElementById('improveAltText');
  const loadingIndicator = document.getElementById('loading');
  const invalidateApiKeyButton = document.getElementById('invalidateApiKey');
  const doneMessage = document.getElementById('doneMessage');
  const multipleImagesMessage = document.getElementById('multipleImagesMessage');

  // check if API key exists or has been stored
  chrome.storage.local.get(['geminiApiKey'], function(result) {
    if (result.geminiApiKey) {
      apiKeySection.style.display = 'none'
      improveAltTextButton.disabled = false;
      invalidateApiKeyButton.style.display = 'block';
    } else {
      improveAltTextButton.disabled = true;
    }
  })

  // save the API key
  saveApiKeyButton.addEventListener('click', function() {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
      chrome.storage.local.set({geminiApiKey: apiKey}, function() {
        apiKeySection.style.display = 'none';
        improveAltTextButton.disabled = false;
      })
    }
  })

  // improve alt text
  improveAltTextButton.addEventListener('click', () => {
    loadingIndicator.style.display = 'block'; // Show loading indicator
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js']
      });
    });

    // Show multiple images message after 15 seconds
    setTimeout(() => {
      multipleImagesMessage.style.display = 'block';
    }, 25000);
  });

  // Invalidate API key
  invalidateApiKeyButton.addEventListener('click', () => {
    chrome.storage.local.remove('geminiApiKey', function() {
      apiKeySection.style.display = 'block';
      improveAltTextButton.disabled = true;
      invalidateApiKeyButton.style.display = 'none';
    });
  });

  // Listen for the message from the content script indicating completion
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'enhancementComplete') {
      multipleImagesMessage.style.display = 'none'; // Hide multiple images message if visible
      loadingIndicator.style.display = 'none'; // Hide loading indicator
      doneMessage.style.display = 'block'; // Show "All done!" message

      // Close the popup after 3 seconds
      setTimeout(() => {
        window.close();
      }, 3000);
    } else if (request.message === ERROR_429) {
      multipleImagesMessage.style.display = 'none'; // Hide multiple images message if visible
      loadingIndicator.style.display = 'none'; // Hide loading indicator
      doneMessage.textContent = "Not all images could be changed due to rate limitations on your plan. Consider Upgrading"
      doneMessage.style.fontSize = '14px'
      doneMessage.style.color = "black"
      doneMessage.style.display = 'block';

      // Close the popup after 10 seconds
      setTimeout(() => {
        window.close();
      }, 10000);
    } else if (request.message === ERROR_400_OR_404) {
      doneMessage.textContent = "Some image formats are invalid and will be skipped"
      doneMessage.style.fontSize = '14px'
      doneMessage.style.display = 'block';
    }
  });
})