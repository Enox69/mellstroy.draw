const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('color');
const clearButton = document.getElementById('clear');
const zoomInButton = document.getElementById('zoomIn');
const zoomOutButton = document.getElementById('zoomOut');

let currentColor = colorPicker.value;
let zoom = 1;
const maxZoom = 4;
const minZoom = 0.5;
const pixelSize = 5; // Квадратик 5x5, как в Not Pixel

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

// Функция для рисования сетки (при зуме >1, как в Not Pixel)
function drawGrid() {
    if (zoom <= 1) return; // Сетка только при приближении
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'; // Полупрозрачная белая сетка
    ctx.lineWidth = 0.5;
    const step = pixelSize / zoom; // Размер квадратика с зумом
    for (let x = 0; x < canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// Инициализация
drawText();

// Рисование по клику (снап к ближайшему квадратику)
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    let rawX = e.clientX - rect.left;
    let rawY = e.clientY - rect.top;
    let x = Math.floor(rawX / zoom / pixelSize) * pixelSize; // Снап к квадратику
    let y = Math.floor(rawY / zoom / pixelSize) * pixelSize;

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
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    zoom *= delta;
    zoom = Math.max(minZoom, Math.min(maxZoom, zoom));
    canvas.style.transform = `scale(${zoom})`;
    drawGrid(); // Перерисовка сетки при зуме
    console.log('Zoom:', zoom);
});

// Кнопки зума
zoomInButton.addEventListener('click', () => {
    zoom = Math.min(maxZoom, zoom * 1.2);
    canvas.style.transform = `scale(${zoom})`;
    drawGrid();
    console.log('Zoom in:', zoom);
});

zoomOutButton.addEventListener('click', () => {
    zoom = Math.max(minZoom, zoom / 1.2);
    canvas.style.transform = `scale(${zoom})`;
    drawGrid();
    console.log('Zoom out:', zoom);
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