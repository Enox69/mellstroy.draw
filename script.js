const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('color');
const clearButton = document.getElementById('clear');

let drawing = false;
let currentColor = colorPicker.value;

ctx.font = 'bold 48px Arial';
ctx.fillStyle = 'white';
ctx.textAlign = 'center';
ctx.fillText('Mellstroy.game', canvas.width / 2, canvas.height / 2);

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseleave', stopDrawing);

function startDrawing(e) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
    draw(e);
}

function stopDrawing() {
    drawing = false;
}

function draw(e) {
    if (!drawing) return;
    ctx.lineWidth = document.getElementById('brushSize').value;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColor;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
}

colorPicker.addEventListener('input', () => {
    currentColor = colorPicker.value;
});

clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText('Mellstroy.game', canvas.width / 2, canvas.height / 2);
});