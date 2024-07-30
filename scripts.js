document.getElementById('imageUpload').addEventListener('change', handleImageUpload);

function handleImageUpload(event) {
    const files = event.target.files;
    const container = document.getElementById('placeholderContainer');
    container.innerHTML = '';

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                createPlaceholder(img, file.name);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

function createPlaceholder(img, fileName) {
    const width = img.width;
    const height = img.height;
    const aspectRatio = (width / height).toFixed(2);
    
    // Set a background color (can be customized)
    const backgroundColor = '#ddd'; // Change this to set a different background color

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = backgroundColor; // Set the background color
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#000';
    ctx.font = 'bold 30px Arial'; // Increase font size to 30px

    // Calculate text width and position to center it
    const text = `${width}x${height}`;
    const textWidth = ctx.measureText(text).width;
    const textX = (canvas.width - textWidth) / 2;
    const textY = (canvas.height / 2) + 10; // Slightly lower for better centering

    ctx.fillText(text, textX, textY);

    const placeholder = document.createElement('div');
    placeholder.className = 'placeholder';
    placeholder.style.width = `${width}px`;
    placeholder.style.height = `${height}px`;

    // Append canvas to placeholder
    placeholder.appendChild(canvas);

    // Create and append download link
    const downloadLink = document.createElement('a');
    downloadLink.href = canvas.toDataURL('image/png');
    downloadLink.download = fileName.replace(/\.[^/.]+$/, "") + '.png'; // Remove the original extension and add .png
    downloadLink.innerText = 'Download';
    downloadLink.style.display = 'block';
    downloadLink.style.marginTop = '10px';
    placeholder.appendChild(downloadLink);

    // Append placeholder to container
    document.getElementById('placeholderContainer').appendChild(placeholder);

    placeholder.dataset.fileName = fileName;
}

function downloadPlaceholders() {
    const zip = new JSZip();
    const placeholders = document.querySelectorAll('.placeholder canvas');

    placeholders.forEach((canvas, index) => {
        const fileName = canvas.parentElement.dataset.fileName.replace(/\.[^/.]+$/, "") + ".png"; // Removing the original extension and adding .png
        canvas.toBlob(function(blob) {
            zip.file(fileName, blob);
            if (index === placeholders.length - 1) {
                zip.generateAsync({ type: 'blob' }).then(function(content) {
                    saveAs(content, 'placeholders.zip');
                });
            }
        });
    });
}
