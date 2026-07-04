import React, { useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Print({ briefing }) {
    const { storage_url } = usePage().props;

    useEffect(() => {
        let cancelled = false;

        const printWhenReady = () => {
            if (cancelled) return;
            const imgs = document.querySelectorAll('img');
            const allLoaded = Array.from(imgs).every(img => img.complete);
            if (allLoaded) {
                window.print();
            } else {
                setTimeout(printWhenReady, 200);
            }
        };

        setTimeout(printWhenReady, 100);

        return () => { cancelled = true; };
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
        return `${pad(date.getHours())}.${pad(date.getMinutes())}`;
    };

    const formatDateTimeFull = (dateStr) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        const pad = (num) => String(num).padStart(2, '0');
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} ${pad(date.getHours())}.${pad(date.getMinutes())} WIB`;
    };

    const attendees = briefing.absensi || [];
    const baseUrl = window.location.origin;
    const transcriptText = briefing.transcript || '';
    const hasTranscript = transcriptText && transcriptText.replace(/<[^>]*>/g, '').trim();

    return (
        <div className="print-wrapper">
            <Head title={`Laporan Briefing - ${briefing.judul_briefing}`} />
            <style dangerouslySetInnerHTML={{
                __html: `
                @page {
                    size: A4;
                    margin: 20mm 25mm 35mm;
                }
                @media print {
                    html, body {
                        background: white;
                        color: black;
                        font-family: 'Times New Roman', Times, serif;
                        font-size: 12pt;
                        line-height: 1.6;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        margin: 0;
                        padding: 0;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .page-break {
                        page-break-before: always;
                    }
                    .avoid-break {
                        page-break-inside: avoid;
                    }
                    #debugbar,
                    .laravel-debugbar {
                        display: none !important;
                    }
                `}} />

            <div className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-3">
                <button
                    onClick={() => window.print()}
                    className="bg-zinc-900 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-zinc-800 transition text-sm tracking-wider uppercase"
                >
                    Cetak Laporan
                </button>
            </div>

            <div className="print-content">
                {/* Kop Surat */}
                <div className="header">
                    <div className="header-left">
                        <h1 className="company-name">PT. SINDANG ASIH MAKMUR</h1>
                        <p className="company-address">
                            Jl. KH. Saleh No.168 Desa Sindang Asih, Kec. Karang Tengah, Kab. Cianjur 43281
                        </p>
                        <div className="header-line"></div>
                    </div>
                    <div className="header-right">
                        <ApplicationLogo className="logo" />
                    </div>
                </div>

                {/* Metadata */}
                <table className="meta-table">
                    <tbody>
                        <tr>
                            <td className="meta-label">PEMATERI</td>
                            <td className="meta-sep">:</td>
                            <td className="meta-value">{briefing.pemateri?.nama_karyawan || briefing.user?.name || '-'}</td>
                        </tr>
                        <tr>
                            <td className="meta-label">HARI / TANGGAL</td>
                            <td className="meta-sep">:</td>
                            <td className="meta-value">{formatDateIndonesian(briefing.tanggal_jam)}</td>
                        </tr>
                        <tr>
                            <td className="meta-label">WAKTU</td>
                            <td className="meta-sep">:</td>
                            <td className="meta-value">{formatTime(briefing.tanggal_jam)} WIB</td>
                        </tr>
                        <tr>
                            <td className="meta-label">JUDUL BRIEFING</td>
                            <td className="meta-sep">:</td>
                            <td className="meta-value">{briefing.judul_briefing}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Isi Briefing */}
                {hasTranscript && (
                    <div className="section avoid-break">
                        <h3 className="section-title">ISI BRIEFING</h3>
                        <div className="transcript-content" dangerouslySetInnerHTML={{ __html: transcriptText }} />
                    </div>
                )}

                {/* Daftar Hadir */}
                <div className="section">
                    <h3 className="section-title">DAFTAR HADIR</h3>
                    <table className="attendance-table">
                        <thead>
                            <tr>
                                <th className="col-no">No</th>
                                <th className="col-name">Nama</th>
                                <th className="col-divisi">Divisi</th>
                                <th className="col-jam">Jam Absen</th>
                                <th className="col-ttd">Tanda Tangan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendees.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="empty-row">
                                        Belum ada peserta yang hadir
                                    </td>
                                </tr>
                            ) : (
                                attendees.map((item, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                                        <td className="cell-no">{index + 1}</td>
                                        <td className="cell-name">{item.karyawan?.nama_karyawan || '-'}</td>
                                        <td className="cell-divisi">{item.karyawan?.divisi || '-'}</td>
                                        <td className="cell-jam">{formatTime(item.jam_absen)}</td>
                                        <td className="cell-ttd">
                                            {item.karyawan?.signature ? (
                                                <img
                                                    src={`${storage_url}/${item.karyawan.signature.signature_path}`}
                                                    alt="Tanda Tangan"
                                                    className="ttd-img"
                                                />
                                            ) : '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Tanda Tangan Pemateri */}
                <div className="signature-section avoid-break">
                    <div className="signature-block">
                        <p className="signature-label">Mengetahui,</p>
                        <p className="signature-date">{formatDateTimeFull(briefing.approved_at || briefing.tanggal_jam)}</p>
                        <p className="signature-role">Pemateri</p>
                        <div className="signature-space">
                            {briefing.user?.karyawan?.signature ? (
                                <img
                                    src={`${storage_url}/${briefing.user.karyawan.signature.signature_path}`}
                                    alt="Tanda Tangan Pemateri"
                                    className="signature-img"
                                />
                            ) : null}
                        </div>
                        <div className="signature-name-wrapper">
                            <p className="signature-name">({briefing.user?.name || '-'})</p>
                        </div>
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    .print-wrapper {
                        min-height: 100vh;
                        background: white;
                        color: black;
                        font-family: 'Times New Roman', Times, serif;
                        font-size: 12pt;
                        line-height: 1.6;
                    }
                    @media print {
                        .print-wrapper {
                            min-height: auto;
                        }
                            .print-content {
                            padding: 0 !important;
                        }
                    }

                    /* -- Kop Surat -- */
                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        gap: 20px;
                        padding-bottom: 8px;
                    }
                    .header-left {
                        flex: 1;
                    }
                    .company-name {
                        font-size: 18pt;
                        font-weight: bold;
                        color: #b91c1c;
                        letter-spacing: 1px;
                        margin: 0 0 4px 0;
                    }
                    .company-address {
                        font-size: 10pt;
                        color: #333;
                        margin: 0;
                        line-height: 1.5;
                    }
                    .header-line {
                        width: 320px;
                        height: 2px;
                        background: #fbbf24;
                        margin-top: 10px;
                    }
                    .logo {
                        height: 65px;
                        width: auto;
                    }

                    /* -- Metadata -- */
                    .meta-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                        font-size: 12pt;
                    }
                    .meta-table td {
                        padding: 2px 0;
                        vertical-align: top;
                    }
                    .meta-label {
                        width: 170px;
                        font-weight: bold;
                        padding-right: 0;
                    }
                    .meta-sep {
                        width: 16px;
                        text-align: center;
                        font-weight: bold;
                        padding: 0;
                    }
                    .meta-value {
                        font-weight: normal;
                    }

                    /* -- Section -- */
                    .section {
                        margin-bottom: 20px;
                    }
                    .section-title {
                        font-size: 12pt;
                        font-weight: bold;
                        text-decoration: underline;
                        margin: 0 0 8px 0;
                    }

                    /* -- Transcript -- */
                    .transcript-content {
                        padding: 0 2px;
                    }
                    .transcript-content p {
                        text-indent: 30px;
                        text-align: justify;
                        margin: 0 0 6px 0;
                        font-size: 12pt;
                        line-height: 1.7;
                    }
                    .transcript-content ul, .transcript-content ol {
                        margin: 6px 0 6px 30px;
                        padding-left: 20px;
                    }
                    .transcript-content li {
                        text-align: justify;
                        margin: 0 0 4px 0;
                        font-size: 12pt;
                        line-height: 1.7;
                    }

                    /* -- Tabel Kehadiran -- */
                    .attendance-table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 11.5pt;
                        border: 1px solid #666;
                    }
                    .attendance-table th {
                        border: 1px solid #666;
                        padding: 6px 4px;
                        font-weight: bold;
                        text-align: center;
                        background: #f5f5f5;
                    }
                    .attendance-table td {
                        border: 1px solid #666;
                        padding: 7px 4px;
                    }
                    .row-even {
                        background: #f9f9f9;
                    }
                    .row-odd {
                        background: white;
                    }
                    .empty-row {
                        padding: 12px 4px;
                        text-align: center;
                        font-style: italic;
                        color: #888;
                    }
                    .attendance-table thead {
                        display: table-header-group;
                    }
                    .attendance-table tbody tr {
                        page-break-inside: avoid;
                    }
                    .col-no { width: 6%; }
                    .col-name { width: 34%; }
                    .col-divisi { width: 20%; }
                    .col-jam { width: 16%; }
                    .col-ttd { width: 24%; }
                    .cell-no {
                        text-align: center;
                    }
                    .cell-name {
                        text-align: left;
                    }
                    .cell-divisi {
                        text-align: center;
                    }
                    .cell-jam {
                        text-align: center;
                        font-family: 'Courier New', monospace;
                        font-size: 11pt;
                    }
                    .cell-ttd {
                        text-align: center;
                    }
                    .ttd-img {
                        height: 30px;
                        width: auto;
                        display: inline-block;
                    }
                    .table-footer {
                        text-align: right;
                        font-size: 11pt;
                        font-weight: bold;
                        margin-top: 6px;
                        font-style: italic;
                    }

                    /* -- Signature -- */
                    .signature-section {
                        display: flex;
                        justify-content: flex-end;
                        margin-top: 30px;
                    }
                    .signature-block {
                        text-align: center;
                        width: 240px;
                    }
                    .signature-label {
                        font-size: 12pt;
                        font-weight: bold;
                        margin: 0 0 4px 0;
                    }
                    .signature-date {
                        font-size: 11pt;
                        margin: 0 0 16px 0;
                        color: #555;
                    }
                    .signature-role {
                        font-size: 12pt;
                        font-weight: bold;
                        margin: 0 0 4px 0;
                    }
                    .signature-space {
                        min-height: 60px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .signature-img {
                        height: 50px;
                        width: auto;
                    }
                    .signature-name-wrapper {
                        border-top: 1px solid #333;
                        padding-top: 6px;
                        margin-top: 8px;
                    }
                    .signature-name {
                        font-size: 12pt;
                        font-weight: bold;
                        margin: 0;
                    }

                `}} />
            </div>
        </div>
    );
}
