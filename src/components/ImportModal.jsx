import React, { useState } from 'react'
import { X, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react'
import { importFromJSON } from '../utils/exportImport'

export default function ImportModal({
  isOpen,
  onClose,
  onImportSuccess
}) {
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError('')
    }
  }

  const handleProcessImport = async () => {
    if (!file) {
      setError('Vui lòng chọn một tệp JSON sao lưu.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const data = await importFromJSON(file)
      onImportSuccess(data)
      onClose()
    } catch (err) {
      setError(err.message || 'Không thể đọc tệp sao lưu. Vui lòng kiểm tra định dạng.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Khôi Phục Dữ Liệu</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-500">
            Tải lên tệp JSON sao lưu đã xuất trước đó. Dữ liệu này sẽ thay thế hoặc gộp vào sổ thu chi của bạn.
          </p>

          <label className="border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition bg-slate-50/50 hover:bg-indigo-50/20">
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
              <FileText className="w-6 h-6" />
            </div>
            {file ? (
              <div>
                <span className="text-xs font-bold text-slate-900 block truncate max-w-[200px]">
                  {file.name}
                </span>
                <span className="text-[11px] text-slate-400">
                  {(file.size / 1024).toFixed(1)} KB • Nhấn để đổi tệp khác
                </span>
              </div>
            ) : (
              <div>
                <span className="text-xs font-semibold text-slate-700 block">
                  Nhấn để chọn tệp .JSON
                </span>
                <span className="text-[11px] text-slate-400">
                  Chỉ chấp nhận file JSON xuất từ hệ thống
                </span>
              </div>
            )}
          </label>

          {error && (
            <div className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200 flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition"
            >
              Hủy
            </button>
            <button
              type="button"
              disabled={!file || loading}
              onClick={handleProcessImport}
              className={`px-5 py-2 text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-1.5 ${
                !file || loading
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Đang nạp...' : 'Tiến hành khôi phục'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}
