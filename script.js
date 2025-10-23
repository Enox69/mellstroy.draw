const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('color');
const clearButton = document.getElementById('clear');

let currentColor = colorPicker.value;
// Размер пикселя фиксированный 1x1
const pixelSize = 1;

// Функция для рисования текста
function drawText() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('MELLSTROY', canvas.width / 2, canvas.height / 2 - 30);
    ctx.fillText('GAME', canvas.width / 2, canvas.height / 2 + 30);
}

// Маска для проверки области текста (адаптирована под pixelSize)
function createTextMask() {
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    const maskCtx = maskCanvas.getContext('2d');
    maskCtx.font = 'bold 48px Arial';
    maskCtx.fillStyle = 'white';
    maskCtx.textAlign = 'center';
    maskCtx.fillText('MELLSTROY', canvas.width / 2, canvas.height / 2 - 30);
    maskCtx.fillText('GAME', canvas.width / 2, canvas.height / 2 + 30);
    return maskCtx.getImageData(0, 0, canvas.width, canvas.height);
}

const textMask = createTextMask();

// Проверка, является ли пиксель частью текста (с учётом pixelSize)
function isPixelInText(x, y) {
    // Проверяем центр квадратика
    const centerX = x + Math.floor(pixelSize / 2);
    const centerY = y + Math.floor(pixelSize / 2);
    if (centerX < 0 || centerY < 0 || centerX >= canvas.width || centerY >= canvas.height) return false;
    const index = (Math.floor(centerY) * textMask.width + Math.floor(centerX)) * 4;
    const alpha = textMask.data[index + 3];
    return alpha > 128;
}



// Инициализация
drawText();

// Рисование по клику (снап к ближайшему квадратику)
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    let x = Math.floor(e.clientX - rect.left);
    let y = Math.floor(e.clientY - rect.top);

    if (isPixelInText(x, y)) {
        ctx.fillStyle = currentColor;
        ctx.fillRect(x, y, pixelSize, pixelSize); // Заполняем квадратик
        console.log('Drawn square at', x, y);
    } else {
        console.log('Click outside text');
    }
});

// Зум колёсиком мыши
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
});

// Изменение цвета
colorPicker.addEventListener('input', () => {
    currentColor = colorPicker.value;
    console.log('Color:', currentColor);
});

// Очистка
clearButton.addEventListener('click', () => {
    drawText();
    console.log('Cleared');
});