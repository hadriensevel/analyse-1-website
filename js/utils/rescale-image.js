function rescaleImg(img, scale) {
    const images = document.querySelectorAll('.image-rescale');
    for (const img of images) {
        const scale = img.getAttribute('data-scale') || 1;
        img.width = img.naturalWidth * scale;
    }
}

export {rescaleImg};