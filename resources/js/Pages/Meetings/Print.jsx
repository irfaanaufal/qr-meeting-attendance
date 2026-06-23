import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Print({ meeting }) {
    useEffect(() => {
        // Automatically trigger print dialog when the page loads
        window.print();
    }, []);

    const formatDateIndonesian = (dateStr) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        const date = new Date(timeStr);
        const pad = (num) => String(num).padStart(2, '0');
        return `${pad(date.getHours())}.${pad(date.getMinutes())}.${pad(date.getSeconds())}`;
    };

    const attendees = meeting.absensi || [];

    // Split ringkasan into lines
    const ringkasanText = meeting.ringkasan || '';
    const textLines = ringkasanText ? ringkasanText.split('\n') : [];

    return (
        <div className="min-h-screen bg-white text-black p-6 sm:p-12 print:p-0 print:m-0" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
            <Head title={`Laporan Rapat - ${meeting.judul_rapat}`} />
            
            <style dangerouslySetInnerHTML={{ __html: `
                @page {
                    size: A4;
                    margin: 0; /* Hides default browser header and footer */
                }
                @media print {
                    body {
                        background-color: white;
                        color: black;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        margin: 15mm 20mm; /* Re-applies standard margins to page content */
                    }
                    .no-print {
                        display: none;
                    }
                }
            `}} />

            {/* Main Wrapper */}
            <div className="max-w-4xl mx-auto">
                
                {/* Kop Surat / Header */}
                <div className="flex items-center justify-between gap-4 pb-2">
                    <div className="space-y-1">
                        <h1 className="text-xl sm:text-2xl font-bold text-[#b91c1c] tracking-wide" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                            PT. SINDANG ASIH MAKMUR
                        </h1>
                        <p className="text-[11px] sm:text-xs text-zinc-900 leading-tight font-medium" style={{ fontFamily: "Arial, sans-serif" }}>
                            Jl. KH. Saleh No.168 Desa Sindang Asih, Kec. karang Tengah, Kab. Cianjur 43281
                        </p>
                        {/* Yellow divider line - only spans partial width as in mockup */}
                        <div className="w-[280px] sm:w-[380px] h-[2px] bg-[#fbbf24] mt-2.5"></div>
                    </div>
                    <div className="flex-shrink-0">
                        <ApplicationLogo className="h-16 w-auto sm:h-20 object-contain" />
                    </div>
                </div>

                {/* Meeting Info Block */}
                <div className="space-y-2 mb-6 mt-6 text-[14px]">
                    <div className="flex">
                        <span className="w-32 font-bold text-zinc-950 tracking-wide">JUDUL RAPAT</span>
                        <span className="mr-4 font-bold text-zinc-950">:</span>
                        <span className="text-zinc-950 font-normal">{meeting.judul_rapat}</span>
                    </div>
                    <div className="flex">
                        <span className="w-32 font-bold text-zinc-950 tracking-wide">PEMATERI</span>
                        <span className="mr-4 font-bold text-zinc-950">:</span>
                        <span className="text-zinc-950 font-normal">{meeting.user?.name}</span>
                    </div>
                    <div className="flex">
                        <span className="w-32 font-bold text-zinc-950 tracking-wide">TANGGAL</span>
                        <span className="mr-4 font-bold text-zinc-950">:</span>
                        <span className="text-zinc-950 font-normal">{formatDateIndonesian(meeting.tanggal_jam)}</span>
                    </div>
                </div>

                {/* Attendance Table */}
                <div className="mb-6">
                    <table className="w-full text-left text-[14px] border-collapse border border-zinc-400">
                        <thead>
                            <tr className="bg-white">
                                <th className="border border-zinc-400 px-3 py-2 font-bold text-center w-12 text-zinc-950">No</th>
                                <th className="border border-zinc-400 px-3 py-2 font-bold text-center w-16 text-zinc-950">FID</th>
                                <th className="border border-zinc-400 px-4 py-2 font-bold text-center text-zinc-950">Nama</th>
                                <th className="border border-zinc-400 px-4 py-2 font-bold text-center w-28 text-zinc-950">Divisi</th>
                                <th className="border border-zinc-400 px-4 py-2 font-bold text-center w-36 text-zinc-950">Jam Absen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendees.length === 0 ? (
                                <tr className="h-9">
                                    <td colSpan="5" className="border border-zinc-400 px-4 py-2 text-center text-zinc-500 italic">
                                        Belum ada peserta yang hadir
                                    </td>
                                </tr>
                            ) : (
                                attendees.map((item, index) => (
                                    <tr key={index} className="h-9">
                                        <td className="border border-zinc-400 px-3 py-1 text-center text-zinc-950">
                                            {index + 1}
                                        </td>
                                        <td className="border border-zinc-400 px-3 py-1 text-center text-zinc-950">
                                            {item.karyawan_fid}
                                        </td>
                                        <td className="border border-zinc-400 px-4 py-1 text-zinc-950 text-left">
                                            {item.karyawan?.nama_karyawan || '-'}
                                        </td>
                                        <td className="border border-zinc-400 px-4 py-1 text-center text-zinc-950">
                                            {item.karyawan?.divisi || '-'}
                                        </td>
                                        <td className="border border-zinc-400 px-4 py-1 text-center text-zinc-950">
                                            {formatTime(item.jam_absen)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Ringkasan Materi */}
                <div className="mb-6">
                    <h3 className="font-bold text-[14px] uppercase tracking-wide text-zinc-950 mb-2">
                        <u>RINGKASAN MATERI</u>
                    </h3>
                    <div className="space-y-0">
                        {textLines.length === 0 || (textLines.length === 1 && !textLines[0]) ? (
                            <div className="min-h-[2.25rem] flex items-end pb-1 text-[14px] text-zinc-400 italic px-1">
                                Belum ada ringkasan materi.
                            </div>
                        ) : (
                            textLines.map((line, index) => (
                                <div 
                                    key={index} 
                                    className="min-h-[2.25rem] flex items-end pb-1 text-[14px] leading-relaxed px-1 text-zinc-950"
                                >
                                    {line || '\u00A0'}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Print Button (Floating & Hidden on print) */}
                <div className="mt-8 flex justify-center no-print">
                    <button 
                        onClick={() => window.print()} 
                        className="bg-zinc-900 text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-zinc-800 transition text-xs tracking-wider uppercase"
                        style={{ fontFamily: 'Arial, sans-serif' }}
                    >
                        Cetak Laporan
                    </button>
                </div>

            </div>
        </div>
    );
}
