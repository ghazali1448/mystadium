const API_URL = import.meta.env.VITE_API_URL || 'https://mystadium.onrender.com/api';
const BASE_URL = API_URL.replace(/\/api\/?$/, '');

class UploadService {
  /**
   * Build a full URL from a relative upload path
   */
  getFullUrl(relativeUrl) {
    if (!relativeUrl) return null;
    if (relativeUrl.startsWith('http')) return relativeUrl;
    return `${BASE_URL}${relativeUrl}`;
  }

  /**
   * Upload a single file to the server.
   * @param {File} file - The file to upload
   * @param {string} category - Storage category: 'stadiums' | 'documents' | 'avatars' | 'general'
   * @param {function} onProgress - Optional progress callback (0-100)
   * @returns {Promise<Object>} Server response with file URL
   */
  async uploadFile(file, category = 'general', onProgress = null) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    // Use XMLHttpRequest for progress tracking
    if (onProgress) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            onProgress(percent);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            data.fullUrl = this.getFullUrl(data.url);
            resolve(data);
          } else {
            const err = JSON.parse(xhr.responseText || '{}');
            reject(new Error(err.message || 'Upload failed'));
          }
        });

        xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
        xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

        xhr.open('POST', `${API_URL}/upload`);
        xhr.send(formData);
      });
    }

    // Simple fetch for when progress isn't needed
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'File upload failed');
    }

    const data = await response.json();
    data.fullUrl = this.getFullUrl(data.url);
    return data;
  }

  /**
   * Upload multiple files at once.
   * @param {FileList|File[]} files
   * @param {string} category
   * @param {function} onProgress - Optional progress callback (0-100)
   */
  async uploadMultiple(files, category = 'general', onProgress = null) {
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));
    formData.append('category', category);

    if (onProgress) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
        });
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            data.files = data.files.map(f => ({ ...f, fullUrl: this.getFullUrl(f.url) }));
            resolve(data);
          } else {
            reject(new Error(JSON.parse(xhr.responseText || '{}').message || 'Upload failed'));
          }
        });
        xhr.addEventListener('error', () => reject(new Error('Network error')));
        xhr.open('POST', `${API_URL}/upload/multiple`);
        xhr.send(formData);
      });
    }

    const response = await fetch(`${API_URL}/upload/multiple`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Multi-file upload failed');
    }

    const data = await response.json();
    data.files = data.files.map(f => ({ ...f, fullUrl: this.getFullUrl(f.url) }));
    return data;
  }

  /**
   * Delete a file by its relative URL.
   * @param {string} fileUrl - e.g. "/uploads/stadiums/123-photo.jpg"
   */
  async deleteFile(fileUrl) {
    const response = await fetch(`${API_URL}/upload`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: fileUrl }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'File deletion failed');
    }

    return await response.json();
  }

  /**
   * List all files in a category.
   * @param {string} category
   */
  async listFiles(category = 'general') {
    const response = await fetch(`${API_URL}/upload/list/${category}`);
    if (!response.ok) throw new Error('Failed to list files');
    const data = await response.json();
    data.files = data.files.map(f => ({ ...f, fullUrl: this.getFullUrl(f.url) }));
    return data;
  }

  /**
   * Validate a file before uploading (client-side check).
   * @returns {{ valid: boolean, error?: string }}
   */
  validateFile(file, { maxSizeMB = 5, allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'] } = {}) {
    if (!file) return { valid: false, error: 'No file selected' };
    if (file.size > maxSizeMB * 1024 * 1024) {
      return { valid: false, error: `File is too large. Max ${maxSizeMB}MB.` };
    }
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'File type not allowed. Use JPG, PNG, GIF, WebP, or PDF.' };
    }
    return { valid: true };
  }

  /**
   * Format file size for display.
   */
  formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}

export default new UploadService();
