# WebA11y - Accessibility Made Easy

**WebA11y** is a Chromium-based browser extension designed to enhance web accessibility by improving alt text for images. With a simple click of the "Improve Alt Text" button, WebA11y leverages the power of Google Gemini API to automatically update poor or missing alt texts, making the web more accessible to everyone.

## Features

- **Google Gemini API Integration**: Easily input your API key to harness the capabilities of Google's Gemini AI for alt text generation.
- **One-Click Improvement**: Enhance the alt texts of all images on a webpage with a single click.
- **Accessibility Focused**: Improve web accessibility by ensuring that all images have meaningful alt texts.
- **Graceful Handling of API Limits**: The extension respects API call limits and stops processing when the limit is reached, leaving existing alt texts unchanged.
- **Invalid Image Handling**: WebA11y skips any invalid images and continues processing valid ones without interruption.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/chiemezuo/wa11y.git
    ```
2. Navigate to the extension directory:
    ```bash
    cd wa11y
    ```
3. Load the extension in your Chromium-based browser:
    - Open `chrome://extensions/`
    - Enable "Developer mode" in the top-right corner.
    - Click "Load unpacked" and select the `wa11y` directory.

## Usage

1. After installing the extension, open it.
2. Enter your Google Gemini API key in the designated field.
3. Browse to any webpage with images.
4. Click the "Improve Alt Text" button in the extension popup.
5. The extension will automatically update poor or missing alt texts on the page, but will stop if the API call limit is reached. The existing alt texts for those images will remain unchanged.
6. Invalid images will be skipped during processing, allowing the extension to continue working on valid images.

### API Call Limitations

- If the number of images exceeds the allowed API calls, not all images may receive updated alt texts.
- The extension will cease processing once the API call limit is reached.
- To attempt improving alt texts on the remaining images, refresh the page and click the "Improve Alt Text" button again.

## API Key Setup

To use WebA11y, you need to provide your Google Gemini API key:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or use an existing one.
3. Enable the Google Gemini API.
4. Generate an API key.
5. Enter this key into the WebA11y extension.

## Contributing

We welcome contributions! If you find a bug or have an idea for an improvement, please feel free to submit an issue or pull request.

---

**WebA11y** - Making the web more accessible, one alt text at a time.
