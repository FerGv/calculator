// DOM elements
const display = document.querySelector('.calculator__display');
const keys = document.querySelectorAll('.calculator__key');

const REGEX_NUMBERS = /\d/;
const REGEX_SYMBOLS = /[\+\-\*\/]/;
const REGEX_INVALID_CONTENT = /[^\+\-\*\/\d]/;

// Functions
function validateKey(key, content) {
  // If there is no content, first character must be
  // a number or a plus/minus symbol.
  if (!content) {
    return REGEX_NUMBERS.test(key) || /[+-]/.test(key);
  }

  const lastCharacter = content[content.length - 1];

  // If key is a symbol, next character must be a number.
  if (REGEX_SYMBOLS.test(lastCharacter)) {
    return REGEX_NUMBERS.test(key);
  }

  return true;
}

function handleClickedKey(key) {
  if (key === '=') {
    // Avoid XSS attacks due to 'eval' use.
    if (REGEX_INVALID_CONTENT.test(display.textContent)) return;

    const result = eval(display.textContent);
    display.textContent = result;
    return;
  }

  if (!validateKey(key, display.textContent)) return;

  display.textContent += key;
  // Scroll display to the very right.
  display.scrollLeft = display.getBoundingClientRect().width;
}

// Events
keys.forEach((key) => {
  key.addEventListener('click', () => handleClickedKey(key.textContent));
});
