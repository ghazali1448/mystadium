import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, CheckCircle, Loader2, FileText, Trash2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UploadService from '../../services/UploadService';

const GREEN = '#10B981';
const DARK = '#111827';
const GREY = '#6B7280';

/**
 * ImageUpload — A premium, drag-and-drop file upload component.
 *
 * Props:
 *   label        — Field label
 *   initialUrl   — Pre-existing file URL (e.g. from DB)
 *   category     — Storage subdirectory: 'stadiums' | 'documents' | 'avatars' | 'general'
 *   accept       — Accepted file types string (default: 'image/*,.pdf')
 *   onUploadComplete(url) — Callback with the full uploaded URL (or null on remove)
 *   maxSizeMB    — Max file size in MB (default: 5)
 *   isRtl        — Right-to-left layout
 */
const ImageUpload = ({
  label,
  initialUrl,
  onUploadComplete,
  category = 'general',
  accept = 'image/*,.pdf',
  maxSizeMB = 5,
  isRtl = false,
}) => {
  const [preview, setPreview] = useState(initialUrl || null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(initialUrl || null); // relative URL for deletion
  const fileInputRef = useRef(null);

  const isPdf = (url) => {
    if (!url) return false;
    return url.toLowerCase().endsWith('.pdf') || url.includes('application/pdf');
  };

  const processFile = useCallback(async (file) => {
    if (!file) return;

    // Client-side validation
    const validation = UploadService.validateFile(file, { maxSizeMB });
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setFileInfo({ name: file.name, size: UploadService.formatSize(file.size), type: file.type });

    // Create preview for images (not PDFs)
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview('pdf');
    }

    // Upload
    setUploading(true);
    setError(null);
    setSuccess(false);
    setProgress(0);

    try {
      const result = await UploadService.uploadFile(file, category, (pct) => setProgress(pct));
      setUploadedUrl(result.url);
      onUploadComplete(result.url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Upload failed');
      setPreview(initialUrl || null);
      setFileInfo(null);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [category, maxSizeMB, initialUrl, onUploadComplete]);

  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  }, [processFile]);

  const handleRemove = async (e) => {
    e.stopPropagation();
    
    // Try to delete from server if we have a relative URL
    if (uploadedUrl && uploadedUrl.startsWith('/uploads/')) {
      try {
        await UploadService.deleteFile(uploadedUrl);
      } catch (err) {
        // File may already be gone — continue
      }
    }
    
    setPreview(null);
    setFileInfo(null);
    setUploadedUrl(null);
    onUploadComplete(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Styles ──
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  };

  const labelStyle = {
    fontSize: 13,
    fontWeight: 700,
    color: DARK,
    textAlign: isRtl ? 'right' : 'left',
  };

  const dropzoneStyle = {
    position: 'relative',
    cursor: uploading ? 'default' : 'pointer',
    overflow: 'hidden',
    borderRadius: 16,
    border: preview
      ? '2px solid transparent'
      : `2px dashed ${isDragOver ? GREEN : error ? '#EF4444' : '#D1D5DB'}`,
    backgroundColor: isDragOver ? '#ECFDF5' : preview ? 'transparent' : '#F9FAFB',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
    boxShadow: isDragOver ? `0 0 0 4px rgba(16,185,129,0.15)` : '0 2px 8px rgba(0,0,0,0.04)',
  };

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}

      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={dropzoneStyle}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept={accept}
        />

        <AnimatePresence mode="wait">
          {/* ── Image preview ── */}
          {preview && preview !== 'pdf' ? (
            <motion.div
              key="img-preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            >
              <img
                src={preview}
                alt="Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={() => setPreview(null)}
              />
              {/* Hover overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.45)',
                opacity: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                transition: 'opacity 0.3s',
              }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
              >
                <button
                  onClick={handleRemove}
                  style={{
                    width: 44, height: 44, borderRadius: '50%',
                    backgroundColor: '#EF4444', color: 'white',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  }}
                >
                  <Trash2 size={18} />
                </button>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  backgroundColor: GREEN, color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}>
                  <RefreshCw size={18} />
                </div>
              </div>
            </motion.div>
          ) : preview === 'pdf' ? (
            /* ── PDF preview ── */
            <motion.div
              key="pdf-preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                padding: 24, width: '100%',
              }}
            >
              <div style={{
                width: 64, height: 64, borderRadius: 16,
                backgroundColor: '#FEE2E2',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FileText size={32} color="#EF4444" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: DARK }}>
                  {fileInfo?.name || 'Document.pdf'}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: 11, color: GREY }}>
                  {fileInfo?.size || 'PDF'}
                </p>
              </div>
              {/* Remove button for PDF */}
              <button
                onClick={handleRemove}
                style={{
                  marginTop: 4, padding: '6px 16px',
                  borderRadius: 8, border: '1px solid #FCA5A5',
                  backgroundColor: '#FEF2F2', color: '#EF4444',
                  fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <Trash2 size={14} /> {isRtl ? 'حذف' : 'Remove'}
              </button>
            </motion.div>
          ) : (
            /* ── Empty state / drop zone ── */
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                padding: 28, textAlign: 'center',
              }}
            >
              <motion.div
                animate={isDragOver ? { scale: 1.15, rotate: 5 } : { scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: isDragOver
                    ? `linear-gradient(135deg, ${GREEN}, #059669)`
                    : 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isDragOver ? '0 8px 24px rgba(16,185,129,0.3)' : 'none',
                }}
              >
                <Upload size={24} color={isDragOver ? 'white' : GREEN} />
              </motion.div>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: DARK }}>
                  {isDragOver
                    ? (isRtl ? 'أفلت الملف هنا!' : 'Drop it here!')
                    : (isRtl ? 'اسحب وأفلت أو اضغط للرفع' : 'Drag & drop or click to upload')}
                </p>
                <p style={{ margin: '6px 0 0', fontSize: 11, color: GREY }}>
                  {isRtl ? `الحد الأقصى ${maxSizeMB}MB — JPG, PNG, PDF` : `Max ${maxSizeMB}MB — JPG, PNG, PDF`}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Upload progress overlay ── */}
        <AnimatePresence>
          {uploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute', inset: 0,
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(4px)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 12,
                zIndex: 10,
              }}
            >
              <Loader2 size={28} color={GREEN} style={{ animation: 'spin 1s linear infinite' }} />
              {/* Progress bar */}
              <div style={{ width: '70%', height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                  style={{ height: '100%', backgroundColor: GREEN, borderRadius: 3 }}
                />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: GREEN }}>{progress}%</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Success badge ── */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              style={{
                position: 'absolute', top: 10, right: isRtl ? 'auto' : 10, left: isRtl ? 10 : 'auto',
                backgroundColor: GREEN, color: 'white',
                width: 32, height: 32, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(16,185,129,0.4)',
                zIndex: 20,
              }}
            >
              <CheckCircle size={18} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── File info bar ── */}
      {fileInfo && !uploading && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 12px', borderRadius: 10,
            backgroundColor: success ? '#ECFDF5' : '#F3F4F6',
            transition: 'background 0.3s',
          }}
        >
          <span style={{ fontSize: 11, color: GREY, fontWeight: 600, maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {fileInfo.name}
          </span>
          <span style={{ fontSize: 11, color: success ? GREEN : GREY, fontWeight: 700 }}>
            {fileInfo.size}
          </span>
        </motion.div>
      )}

      {/* ── Error message ── */}
      {error && (
        <motion.div
          initial={{ opacity: 0, x: isRtl ? 10 : -10 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 12px', borderRadius: 10,
            backgroundColor: '#FEF2F2',
          }}
        >
          <X size={14} color="#EF4444" />
          <span style={{ fontSize: 11, color: '#EF4444', fontWeight: 600 }}>
            {error}
          </span>
        </motion.div>
      )}

      {/* CSS animation for the spinner */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ImageUpload;
