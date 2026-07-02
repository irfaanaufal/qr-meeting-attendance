import React, { useRef, useEffect, useState, useCallback } from 'react';
import axios from 'axios';

export default function SignaturePad({ karyawanFid, existingUrl, onSaved, onDeleted }) {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasContent, setHasContent] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(existingUrl || null);

    useEffect(() => {
        setPreviewUrl(existingUrl || null);
    }, [existingUrl]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#18181b';
    }, []);

    const getPos = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: (clientX - rect.left) * (canvas.width / rect.width),
            y: (clientY - rect.top) * (canvas.height / rect.height),
        };
    };

    const startDraw = useCallback((e) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        setIsDrawing(true);
        setHasContent(true);
        setPreviewUrl(null);
    }, []);

    const draw = useCallback((e) => {
        e.preventDefault();
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    }, [isDrawing]);

    const endDraw = useCallback(() => {
        setIsDrawing(false);
    }, []);

    const clear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasContent(false);
    };

    const save = async () => {
        if (!hasContent) return;
        setIsSaving(true);
        try {
            const dataUrl = canvasRef.current.toDataURL('image/png');
            await axios.post(route('signatures.store'), {
                karyawan_fid: karyawanFid,
                signature: dataUrl,
            });
            setPreviewUrl(dataUrl);
            setHasContent(false);
            if (onSaved) onSaved();
        } catch (err) {
            console.error('Save signature failed:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const remove = async () => {
        if (!confirm('Hapus tanda tangan ini?')) return;
        try {
            await axios.delete(route('signatures.destroy', karyawanFid));
            setPreviewUrl(null);
            clear();
            if (onDeleted) onDeleted();
        } catch (err) {
            console.error('Delete signature failed:', err);
        }
    };

    return (
        <div className="space-y-3">
            {previewUrl ? (
                <div className="space-y-3">
                    <div className="border border-zinc-300 dark:border-zinc-700 rounded-xl bg-white p-4 flex items-center justify-center">
                        <img src={previewUrl} alt="Tanda Tangan" className="max-h-24 object-contain" />
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => { setPreviewUrl(null); clear(); }}
                            className="text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                        >
                            Tanda Tangan Ulang
                        </button>
                        <button
                            type="button"
                            onClick={remove}
                            className="text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30 transition"
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden bg-white">
                        <canvas
                            ref={canvasRef}
                            width={500}
                            height={150}
                            className="w-full touch-none cursor-crosshair"
                            style={{ height: '150px' }}
                            onMouseDown={startDraw}
                            onMouseMove={draw}
                            onMouseUp={endDraw}
                            onMouseLeave={endDraw}
                            onTouchStart={startDraw}
                            onTouchMove={draw}
                            onTouchEnd={endDraw}
                        />
                    </div>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium text-center">
                        Tanda tangan digital &mdash; gambar dengan mouse atau sentuhan
                    </p>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={clear}
                            disabled={!hasContent}
                            className="text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition disabled:opacity-40"
                        >
                            Hapus Canvas
                        </button>
                        <button
                            type="button"
                            onClick={save}
                            disabled={!hasContent || isSaving}
                            className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition disabled:opacity-40 flex items-center gap-1.5"
                        >
                            {isSaving ? 'Menyimpan...' : 'Simpan Tanda Tangan'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
