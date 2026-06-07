import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react';
import type { UploadedFile, UploadStatus } from '../../types/upload';

/* ============================================
   UploadPage — PDF / Document Upload Section
   ============================================ */

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/csv',
];

const ACCEPTED_EXTENSIONS = '.pdf,.doc,.docx,.txt,.csv';
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

function generateId(): string {
  return `file_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(type: string): string {
  if (type === 'application/pdf') return '📕';
  if (type.includes('word')) return '📘';
  if (type === 'text/csv') return '📊';
  return '📄';
}

function getStatusColor(status: UploadStatus): string {
  switch (status) {
    case 'uploading': return 'text-[var(--color-primary-400)]';
    case 'success': return 'text-[var(--color-success-500)]';
    case 'error': return 'text-[var(--color-danger-500)]';
    default: return 'text-[var(--color-surface-300)]';
  }
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const validFiles: UploadedFile[] = [];

    for (const file of fileArray) {
      // Check type
      if (!ACCEPTED_TYPES.includes(file.type)) {
        validFiles.push({
          id: generateId(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'error',
          progress: 0,
          error: 'Unsupported file type. Please upload PDF, DOC, DOCX, TXT, or CSV files.',
        });
        continue;
      }

      // Check size
      if (file.size > MAX_FILE_SIZE) {
        validFiles.push({
          id: generateId(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'error',
          progress: 0,
          error: `File too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`,
        });
        continue;
      }

      validFiles.push({
        id: generateId(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'idle',
        progress: 0,
      });
    }

    setFiles((prev) => [...prev, ...validFiles]);

    // Auto-start upload simulation for valid files
    validFiles
      .filter((f) => f.status === 'idle')
      .forEach((f) => simulateUpload(f.id));
  }, []);

  const simulateUpload = (fileId: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, status: 'uploading' as UploadStatus, progress: 0 } : f))
    );

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, status: 'success' as UploadStatus, progress: 100 } : f
          )
        );
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress: Math.min(progress, 99) } : f))
        );
      }
    }, 300);
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      // Reset input so the same file can be uploaded again
      e.target.value = '';
    }
  };

  const totalFiles = files.length;
  const uploadedCount = files.filter((f) => f.status === 'success').length;
  const uploadingCount = files.filter((f) => f.status === 'uploading').length;
  const errorCount = files.filter((f) => f.status === 'error').length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8 fade-in">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Upload Documents</h1>
        <p className="text-[var(--color-surface-200)] text-sm">
          Upload regulatory documents, circulars, and compliance PDFs for AI analysis
        </p>
      </div>

      {/* Upload Zone */}
      <div
        className={`drop-zone p-10 text-center fade-in fade-in-delay-1 ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        id="upload-drop-zone"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_EXTENSIONS}
          onChange={handleFileSelect}
          className="hidden"
          id="upload-file-input"
        />

        {/* Upload Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-primary-600)]/10 border border-[var(--color-primary-600)]/15 mb-5">
          <svg className="w-8 h-8 text-[var(--color-primary-400)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
        </div>

        <h3 className="text-white text-lg font-semibold mb-2">
          {isDragOver ? 'Drop files here' : 'Drag & drop files here'}
        </h3>
        <p className="text-[var(--color-surface-300)] text-sm mb-4">
          or <span className="text-[var(--color-primary-400)] font-medium cursor-pointer hover:underline">browse from your computer</span>
        </p>

        {/* Accepted formats */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {['PDF', 'DOC', 'DOCX', 'TXT', 'CSV'].map((ext) => (
            <span
              key={ext}
              className="px-3 py-1 rounded-lg bg-white/5 text-[var(--color-surface-200)] text-xs font-medium border border-white/5"
            >
              .{ext.toLowerCase()}
            </span>
          ))}
          <span className="text-[var(--color-surface-400)] text-xs">Max 25 MB</span>
        </div>
      </div>

      {/* Stats Bar */}
      {totalFiles > 0 && (
        <div className="flex items-center gap-6 mt-6 mb-4 text-sm fade-in">
          <span className="text-[var(--color-surface-200)]">
            <strong className="text-white">{totalFiles}</strong> file{totalFiles !== 1 ? 's' : ''} total
          </span>
          {uploadedCount > 0 && (
            <span className="text-[var(--color-success-500)]">
              ✓ {uploadedCount} uploaded
            </span>
          )}
          {uploadingCount > 0 && (
            <span className="text-[var(--color-primary-400)]">
              ↑ {uploadingCount} uploading
            </span>
          )}
          {errorCount > 0 && (
            <span className="text-[var(--color-danger-500)]">
              ✕ {errorCount} failed
            </span>
          )}
          <button
            onClick={() => setFiles([])}
            className="ml-auto text-[var(--color-surface-300)] hover:text-white text-xs transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3 fade-in fade-in-delay-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="glass-card p-4 flex items-center gap-4 group"
            >
              {/* Icon */}
              <span className="text-2xl">{getFileIcon(file.type)}</span>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white text-sm font-medium truncate">{file.name}</p>
                  <span className={`text-xs font-medium ${getStatusColor(file.status)}`}>
                    {file.status === 'uploading' && `${Math.round(file.progress)}%`}
                    {file.status === 'success' && '✓ Uploaded'}
                    {file.status === 'error' && '✕ Failed'}
                  </span>
                </div>
                <p className="text-[var(--color-surface-400)] text-xs">{formatFileSize(file.size)}</p>

                {/* Progress Bar */}
                {file.status === 'uploading' && (
                  <div className="progress-bar mt-2">
                    <div className="progress-bar-fill" style={{ width: `${file.progress}%` }} />
                  </div>
                )}

                {/* Error Message */}
                {file.status === 'error' && file.error && (
                  <p className="text-[var(--color-danger-500)] text-xs mt-1">{file.error}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {file.status === 'error' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Retry: reset and re-upload
                      setFiles((prev) =>
                        prev.map((f) =>
                          f.id === file.id ? { ...f, status: 'idle' as UploadStatus, progress: 0, error: undefined } : f
                        )
                      );
                      simulateUpload(file.id);
                    }}
                    className="p-2 rounded-lg hover:bg-white/5 text-[var(--color-surface-300)] hover:text-white transition-colors"
                    aria-label="Retry upload"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                  className="p-2 rounded-lg hover:bg-white/5 text-[var(--color-surface-300)] hover:text-[var(--color-danger-500)] transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Remove file"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {files.length === 0 && (
        <div className="glass-card p-8 mt-6 text-center fade-in fade-in-delay-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 mb-4">
            <svg className="w-6 h-6 text-[var(--color-surface-300)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <h3 className="text-white font-semibold mb-1">No documents yet</h3>
          <p className="text-[var(--color-surface-300)] text-sm">
            Upload regulatory circulars and compliance documents to begin AI-powered analysis.
          </p>
        </div>
      )}

      {/* Info Panel */}
      <div className="glass-card p-6 mt-6 fade-in fade-in-delay-3">
        <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-[var(--color-primary-400)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
          How it works
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: '01', title: 'Upload', desc: 'Drop your regulatory PDFs & documents' },
            { step: '02', title: 'Analyze', desc: 'AI agents extract obligations & risks' },
            { step: '03', title: 'Action', desc: 'MAPs are generated for each regulation' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <span className="text-[var(--color-primary-400)] font-bold text-xs mt-0.5">{item.step}</span>
              <div>
                <p className="text-white text-sm font-medium">{item.title}</p>
                <p className="text-[var(--color-surface-300)] text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
