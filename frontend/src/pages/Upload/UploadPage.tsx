import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react';
import type { UploadedFile, UploadStatus } from '../../types/upload';

/* ============================================
   UploadPage — Clean white card design
   Matches reference: dashed zone + file list
   ============================================ */

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/csv',
];

const ACCEPTED_EXTENSIONS = '.pdf,.doc,.docx,.txt,.csv';
const MAX_FILE_SIZE = 25 * 1024 * 1024;

function generateId(): string {
  return `file_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const validFiles: UploadedFile[] = [];

    for (const file of fileArray) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        validFiles.push({
          id: generateId(), file, name: file.name, size: file.size, type: file.type,
          status: 'error', progress: 0, error: 'Unsupported file type.',
        });
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        validFiles.push({
          id: generateId(), file, name: file.name, size: file.size, type: file.type,
          status: 'error', progress: 0, error: `File too large (max ${formatFileSize(MAX_FILE_SIZE)}).`,
        });
        continue;
      }
      validFiles.push({
        id: generateId(), file, name: file.name, size: file.size, type: file.type,
        status: 'idle', progress: 0,
      });
    }

    setFiles((prev) => [...prev, ...validFiles]);
    validFiles.filter((f) => f.status === 'idle').forEach((f) => simulateUpload(f.id));
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
          prev.map((f) => f.id === fileId ? { ...f, status: 'success' as UploadStatus, progress: 100 } : f)
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

  const handleDragOver = (e: DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e: DragEvent) => { e.preventDefault(); setIsDragOver(false); };
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
  };
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Card */}
      <div className="upload-card fade-in">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="file-icon-box" style={{ width: '42px', height: '42px' }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>Upload files</h1>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>Select and upload regulatory documents for AI analysis</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="tag tag-purple">PDF Analysis</span>
          <span className="tag tag-blue">Auto Extract</span>
          <span className="tag tag-green">AI Powered</span>
          <span className="tag tag-amber">RBI / SEBI</span>
        </div>

        {/* Drop Zone */}
        <div
          className={`drop-zone mb-6 ${isDragOver ? 'drag-over' : ''}`}
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

          {/* Upload button inside zone */}
          <button type="button" className="upload-btn-inside" onClick={(e) => e.stopPropagation()}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            Upload
          </button>

          <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '4px' }}>
            Choose a file or drag & drop it here
          </p>
          <p style={{ fontSize: '13px', color: '#9ca3af' }}>
            PDF, DOC, DOCX, TXT, CSV · Maximum 25 MB file size
          </p>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-3 fade-in">
            {files.map((file) => (
              <div key={file.id} className="file-item">
                {/* PDF icon */}
                <div className="file-icon-box">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }} className="truncate">
                    {file.name}
                  </p>
                  <div className="flex items-center gap-2" style={{ fontSize: '12px', color: '#6b7280' }}>
                    {file.status === 'uploading' && (
                      <span>{formatFileSize(Math.round(file.size * file.progress / 100))} / {formatFileSize(file.size)}</span>
                    )}
                    {file.status === 'success' && (
                      <span>{formatFileSize(file.size)} / {formatFileSize(file.size)}</span>
                    )}
                    {file.status === 'error' && (
                      <span>{formatFileSize(file.size)}</span>
                    )}
                    <span>·</span>
                    {file.status === 'uploading' && (
                      <span style={{ color: '#8b5cf6', fontWeight: 500 }}>
                        ✦ Uploading… {Math.round(file.progress)}%
                      </span>
                    )}
                    {file.status === 'success' && (
                      <span style={{ color: '#22c55e', fontWeight: 500 }}>✓ Completed</span>
                    )}
                    {file.status === 'error' && (
                      <span style={{ color: '#ef4444', fontWeight: 500 }}>✕ {file.error}</span>
                    )}
                  </div>

                  {/* Progress bar */}
                  {file.status === 'uploading' && (
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${file.progress}%` }} />
                    </div>
                  )}
                </div>

                {/* Action button */}
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-2 rounded-lg transition-colors flex-shrink-0"
                  style={{ color: '#9ca3af' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}
                  aria-label="Remove file"
                >
                  {file.status === 'success' ? (
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info cards below */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {[
          { step: '01', title: 'Upload', desc: 'Drop regulatory PDFs & circulars', color: '#8b5cf6' },
          { step: '02', title: 'Analyze', desc: 'AI extracts obligations & risks', color: '#6366f1' },
          { step: '03', title: 'Action', desc: 'MAPs generated automatically', color: '#22c55e' },
        ].map((item) => (
          <div key={item.step} className="upload-card p-5 fade-in fade-in-delay-2">
            <span className="tag tag-purple mb-3" style={{ display: 'inline-block' }}>Step {item.step}</span>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>{item.title}</h3>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
