// DOM elements
const display = document.querySelector('.calculator__display');
const keys = document.querySelectorAll('.calculator__key');

const REGEX_NUMBERS = /\d/;
const REGEX_SYMBOLS = /[\+\-\*\/]/;
const REGEX_INVALID_CONTENT = /[^\.\+\-\*\/\d]/;
const REGEX_INVALID_CONTENT_KEYBOARD = /[^=\.\+\-\*\/\dBackspace]/;

// Flag to validate if a point can be written.
let allowPoint = true;

// Functions
function validateKey(key) {
  // If there is no content, first character must be
  // a number or a plus/minus symbol.
  if (!display.textContent) {
    return REGEX_NUMBERS.test(key) || /[\.+-]/.test(key);
  }

  if (key === '.') return allowPoint;

  const [lastCharacter] = getLastCharacter();

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

function handleClearAll() {
  display.textContent = '';
}

function handleClearOne() {
  const [lastCharacter, index] = getLastCharacter();
  if (lastCharacter === '.') allowPoint = true;
  display.textContent = display.textContent.slice(0, index);
}

function getLastCharacter() {
  const lastCharacterIndex = display.textContent.length - 1;
  const lastCharacter = display.textContent[lastCharacterIndex];

  return [lastCharacter, lastCharacterIndex];
}

function handleClickedKey(key) {
  switch (key) {
    case '=':
      handleEqual();
      break;

    case 'C':
      handleClearAll();
      break;

    case '⇤':
    case 'Backspace':
      handleClearOne();
      break;

    default:
      if (!validateKey(key)) break;

      if (key === '.') {
        allowPoint = false;

        const [lastCharacter] = display.textContent ? getLastCharacter() : [null];

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
document.addEventListener('keyup', (event) => {
  if (REGEX_INVALID_CONTENT_KEYBOARD.test(event.key)) return;
  handleClickedKey(event.key);
});
