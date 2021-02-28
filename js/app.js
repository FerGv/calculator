// DOM elements
const display = document.querySelector('.calculator__display');
const keys = document.querySelectorAll('.calculator__key');

const REGEX_NUMBERS = /\d/;
const REGEX_SYMBOLS = /[\+\-\*\/]/;
const REGEX_INVALID_CONTENT = /[^\.\+\-\*\/\d]/;

// Flag to validate if a point can be written.
let allowPoint = true;

// Functions
function validateKey(key, content) {
  // If there is no content, first character must be
  // a number or a plus/minus symbol.
  if (!content) {
    return REGEX_NUMBERS.test(key) || /[\.+-]/.test(key);
  }

  const lastCharacter = content[content.length - 1];

  if (key === '.') return allowPoint;

  // If key is a symbol, next character must be a number.
  if (REGEX_SYMBOLS.test(lastCharacter)) {
    return REGEX_NUMBERS.test(key);
  }

  return true;
}

function handleEqual() {
  // Avoid XSS attacks due to 'eval' use.
  if (REGEX_INVALID_CONTENT.test(display.textContent)) return;

  const result = eval(display.textContent);
  display.textContent = result;
}

function handleClear() {
  display.textContent = '';
}

function handleClickedKey(key) {
  switch (key) {
    case '=':
      handleEqual();
      break;

    case 'C':
      handleClear();
      break;

    default:
      if (!validateKey(key, display.textContent)) break;

      if (key === '.') {
        allowPoint = false;

        const lastCharacter = display.textContent
          ? display.textContent[display.textContent.length - 1]
          : null;

        if (!REGEX_NUMBERS.test(lastCharacter)) {
          display.textContent += '0';
        }
      }

      if (REGEX_SYMBOLS.test(key)) {
        allowPoint = true;
      }

      display.textContent += key;
      // Scroll display to the very right.
      display.scrollLeft = display.getBoundingClientRect().width;
  }
}

// Events
keys.forEach((key) => {
  key.addEventListener('click', () => handleClickedKey(key.textContent));
});
