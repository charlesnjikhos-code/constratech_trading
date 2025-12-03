// Admin Panel - Cloud Upload System
// Uses ImgBB free API for automatic cloud image hosting

const IMGBB_API_KEY = 'eec9f9a3d31419c929f415f81a2a9f5e'; // Free API key
const GALLERY_DATA_FILE = 'gallery-data.json';

let selectedImages = [];
let uploadedUrls = [];

// Check Password
function checkPassword() {
    const password = document.getElementById('adminPassword').value;
    
    if (password === 'admin123') {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('uploadSection').style.display = 'block';
        initializeUpload();
        loadGallery();
    } else {
        alert('❌ Incorrect password! Try again.');
    }
}

// Initialize Upload
function initializeUpload() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    
    // Click to select files
    dropZone.addEventListener('click', () => fileInput.click());
    
    // File selection
    fileInput.addEventListener('change', handleFiles);
    
    // Drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--clr-accent)';
        dropZone.style.background = 'rgba(0, 168, 204, 0.05)';
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = '#ddd';
        dropZone.style.background = '#f8f9fa';
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#ddd';
        dropZone.style.background = '#f8f9fa';
        handleFiles({ target: { files: e.dataTransfer.files } });
    });
}

// Handle Files
function handleFiles(e) {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
        if (!file.type.match('image/(jpeg|jpg|png)')) {
            alert(`❌ ${file.name} - Only JPG/PNG allowed`);
            return false;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert(`❌ ${file.name} - Too large! Max 5MB`);
            return false;
        }
        return true;
    });
    
    if (validFiles.length > 0) {
        selectedImages = [...selectedImages, ...validFiles];
        displayPreview();
    }
}

// Display Preview
function displayPreview() {
    const previewArea = document.getElementById('previewArea');
    const imagePreview = document.getElementById('imagePreview');
    
    imagePreview.innerHTML = '';
    
    selectedImages.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.innerHTML = `
                <img src="${e.target.result}" alt="${file.name}">
                <div class="preview-info">
                    <p>${file.name}</p>
                    <small>${(file.size / 1024).toFixed(1)} KB</small>
                </div>
                <button class="remove-btn" onclick="removeImage(${index})">
                    <i class="fa fa-times"></i>
                </button>
            `;
            imagePreview.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
    });
    
    previewArea.style.display = 'block';
}

// Remove Image
function removeImage(index) {
    selectedImages.splice(index, 1);
    if (selectedImages.length === 0) {
        document.getElementById('previewArea').style.display = 'none';
    } else {
        displayPreview();
    }
}

// Clear All
function clearImages() {
    selectedImages = [];
    document.getElementById('previewArea').style.display = 'none';
    document.getElementById('fileInput').value = '';
}

// Upload to Cloud (ImgBB)
async function uploadToCloud() {
    if (selectedImages.length === 0) {
        alert('⚠️ Please select photos first!');
        return;
    }
    
    // Show progress
    document.getElementById('previewArea').style.display = 'none';
    document.getElementById('uploadProgress').style.display = 'block';
    
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    uploadedUrls = [];
    let completed = 0;
    
    try {
        for (let i = 0; i < selectedImages.length; i++) {
            const file = selectedImages[i];
            
            progressText.textContent = `Uploading ${i + 1} of ${selectedImages.length}...`;
            progressFill.style.width = `${(i / selectedImages.length) * 100}%`;
            
            const formData = new FormData();
            formData.append('image', file);
            
            const response = await axios.post(
                `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
                formData
            );
            
            if (response.data && response.data.data) {
                uploadedUrls.push({
                    url: response.data.data.url,
                    thumb: response.data.data.thumb.url,
                    title: file.name.replace(/\.[^/.]+$/, ''),
                    uploadDate: new Date().toISOString()
                });
                completed++;
            }
        }
        
        // Save to gallery data
        await saveGalleryData(uploadedUrls);
        
        // Complete progress
        progressFill.style.width = '100%';
        progressText.textContent = '✓ Upload complete!';
        
        setTimeout(() => {
            document.getElementById('uploadProgress').style.display = 'none';
            showSuccess(completed);
            loadGallery();
        }, 1000);
        
    } catch (error) {
        console.error('Upload error:', error);
        alert('❌ Upload failed! Check your internet connection and try again.');
        document.getElementById('uploadProgress').style.display = 'none';
        document.getElementById('previewArea').style.display = 'block';
    }
}

// Save Gallery Data to localStorage
async function saveGalleryData(newImages) {
    let galleryData = JSON.parse(localStorage.getItem(GALLERY_DATA_FILE) || '[]');
    galleryData = [...newImages, ...galleryData];
    localStorage.setItem(GALLERY_DATA_FILE, JSON.stringify(galleryData));
}

// Load Gallery
async function loadGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    const deleteAllBtn = document.getElementById('deleteAllBtn');
    const galleryData = JSON.parse(localStorage.getItem(GALLERY_DATA_FILE) || '[]');
    
    if (galleryData.length === 0) {
        galleryGrid.innerHTML = '<p class="no-images">No photos uploaded yet. Upload your first photos above!</p>';
        deleteAllBtn.style.display = 'none';
        return;
    }
    
    // Show delete all button
    deleteAllBtn.style.display = 'flex';
    
    galleryGrid.innerHTML = '';
    galleryData.forEach((img, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <img src="${img.thumb}" alt="${img.title}">
            <div class="gallery-item-overlay">
                <p>${img.title}</p>
                <button onclick="deleteImage(${index})" class="delete-btn" title="Delete this photo">
                    <i class="fa fa-trash"></i>
                </button>
            </div>
        `;
        galleryGrid.appendChild(item);
    });
}

// Delete Image
function deleteImage(index) {
    if (confirm('🗑️ Delete this photo from gallery?\n\nThis will remove it from your website immediately.')) {
        let galleryData = JSON.parse(localStorage.getItem(GALLERY_DATA_FILE) || '[]');
        const deletedPhoto = galleryData[index];
        galleryData.splice(index, 1);
        localStorage.setItem(GALLERY_DATA_FILE, JSON.stringify(galleryData));
        loadGallery();
        
        // Show success message
        alert(`✓ Photo "${deletedPhoto.title}" deleted successfully!`);
    }
}

// Show Success
function showSuccess(count) {
    const successMessage = document.getElementById('successMessage');
    document.getElementById('uploadCount').textContent = `${count} photo${count > 1 ? 's' : ''} uploaded successfully!`;
    successMessage.style.display = 'block';
    clearImages();
}

// Reset Upload
function resetUpload() {
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('previewArea').style.display = 'none';
    clearImages();
}

// Delete All Photos
function deleteAllPhotos() {
    const galleryData = JSON.parse(localStorage.getItem(GALLERY_DATA_FILE) || '[]');
    const photoCount = galleryData.length;
    
    if (photoCount === 0) {
        alert('⚠️ No photos to delete!');
        return;
    }
    
    if (confirm(`🗑️ Delete ALL ${photoCount} photos from gallery?\n\n⚠️ WARNING: This cannot be undone!\n\nAll photos will be removed from your website immediately.`)) {
        if (confirm(`Are you absolutely sure?\n\nThis will delete ${photoCount} photo${photoCount > 1 ? 's' : ''} permanently!`)) {
            localStorage.removeItem(GALLERY_DATA_FILE);
            loadGallery();
            alert(`✓ All ${photoCount} photos deleted successfully!`);
        }
    }
}
