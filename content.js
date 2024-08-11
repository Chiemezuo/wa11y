const ERROR_429 = "Your current plan has limitations on the number of API calls per minute. Consider upgrading."
const ERROR_400_OR_404 = "Some images are not supported or have invalid formats."

// Start by replacing every image occurence with "generated AI alt text"

function isAltTextGoodEnough(altText) {
  // Develop regex for sorting things out.
  return true
}

async function generateAltText(imageUrl, altText) {
  const localVariable = await chrome.storage.local.get(['geminiApiKey'])
  // console.log("Api key is", localVariable.geminiApiKey);
  // Gemini API manipulation
  // Retrieve env variable for API key.
  // const response = {}

  if (localVariable.geminiApiKey) {
    try {
      const output = await callGeminiAPI(localVariable.geminiApiKey, imageUrl, altText)
      return output
    } catch (error) {
      chrome.runtime.sendMessage({ message: error.message })
      if (error.message === ERROR_429) {
        return false
      }
    }
  }

  return altText
}

// optionally, upload all the images in bulk
async function evaluateAndReplaceAltText() {
  const images = document.querySelectorAll('img')
  for (let img of images) {
    const altText = img.alt;

    // Exclude svg images (icons)
    if (img.src.endsWith('.svg')) {
      continue
    }

    if (isAltTextGoodEnough(altText)) {
      const newAltText = await generateAltText(img.src, altText);
      if (newAltText) {
        img.alt = newAltText;
        console.log(`Alt text updated for image: ${img.src}`);
      } else {
        return
      }
    }
  }
  // Send a message back to the popup script indicating the process is complete
  chrome.runtime.sendMessage({ message: 'enhancementComplete' });
}

async function callGeminiAPI(apiKey, imageUrl, altText) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`

  const imageData = await getBase64Image(imageUrl)

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: `If the alt text "${altText}" is good enough as the alt text of this image, reply me with "${altText}" verbatim. If it is not good enough, give the picture a concise alt text that can be used for a website. Describe with passive voice.` },
            { inline_data: {
                mime_type: "image/jpeg", 
                data: imageData
              }
            },
          ]
        }
      ],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 100,
      }
    })
  })

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('Some images are not supported or have invalid formats.');
    } else if (response.status === 429) {
      throw new Error(ERROR_429);
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  }

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  return text;
}

async function getBase64Image(imageUrl) {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

evaluateAndReplaceAltText()