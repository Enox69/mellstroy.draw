const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('color');
const clearButton = document.getElementById('clear');

let currentColor = colorPicker.value;
let db = window.db;

// Функция для рисования текста
function drawText() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('MELLSTROY', canvas.width / 2, canvas.height / 2 - 30);
    ctx.fillText('GAME', canvas.width / 2, canvas.height / 2 + 30);
    console.log('Text drawn: MELLSTROY GAME');
}

// Маска для проверки области текста
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
console.log('Mask ready');

// Проверка пикселя в тексте
function isPixelInText(x, y) {
    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return false;
    const index = (Math.floor(y) * textMask.width + Math.floor(x)) * 4;
    const alpha = textMask.data[index + 3];
    return alpha > 128;
}

// Инициализация
drawText();

// Загрузка пикселей из Firebase
function loadPixels(snapshot) {
    drawText(); // Текст сверху
    if (snapshot) {
        snapshot.forEach((child) => {
            const data = child.val();
            ctx.fillStyle = data.color;
            ctx.fillRect(data.x, data.y, 1, 1);
        });
    }
    console.log('Loaded from DB');
}

if (db) {
    try {
        const pixelsRef = window.firebase.ref(db, 'pixels');
        window.firebase.onValue(pixelsRef, loadPixels);
        console.log('Firebase listener started');
    } catch (error) {
        console.log('Error starting listener:', error.message);
    }
} else {
    console.log('No Firebase - local mode');
}

// Рисование по клику
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    console.log(`Click at (${x}, ${y}) - in text? ${isPixelInText(x, y)}`);

    if (isPixelInText(x, y)) {
        ctx.fillStyle = currentColor;
        ctx.fillRect(x, y, 1, 1); // Пиксель

        if (db) {
            try {
                const pixelRef = window.firebase.ref(db, `pixels/${x}_${y}`);
                window.firebase.set(pixelRef, { x, y, color: currentColor });
                console.log('Saved to Firebase');
            } catch (error) {
                console.log('Error saving to Firebase:', error.message);
            }
        } else {
            console.log('Saved locally');
        }
    } else {
        console.log('Outside text');
    }
});

// Цвет
colorPicker.addEventListener('input', () => {
    currentColor = colorPicker.value;
    console.log('Color:', currentColor);
});

// Очистка
clearButton.addEventListener('click', () => {
    drawText();
    if (db) {
        try {
            const pixelsRef = window.firebase.ref(db, 'pixels');
            window.firebase.remove(pixelsRef);
            console.log('DB cleared');
        } catch (error) {
            console.log('Error clearing DB:', error.message);
        }
    }
    console.log('Cleared locally');
});