<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KaryawanSeeder extends Seeder
{
    public function run(): void
    {
        $dataKaryawan = [
            //HRD
            ['fid' => '81',  'nama_karyawan' => 'Hadi', 'divisi' => 'HRD', 'jabatan' => 'Human Resource'],
            //QA
            ['fid' => '12',  'nama_karyawan' => 'Lia', 'divisi' => 'QC', 'jabatan' => 'Quality Assurance'],
            ['fid' => '239', 'nama_karyawan' => 'Desyifa', 'divisi' => 'QC', 'jabatan' => 'Staff'],
            ['fid' => '304', 'nama_karyawan' => 'Safana', 'divisi' => 'QC', 'jabatan' => 'Staff'],
            ['fid' => '261', 'nama_karyawan' => 'Riskia', 'divisi' => 'QC', 'jabatan' => 'Staff'],
            ['fid' => '294', 'nama_karyawan' => 'Tedi', 'divisi' => 'QC', 'jabatan' => 'Staff'],
            ['fid' => '295', 'nama_karyawan' => 'Fachri', 'divisi' => 'QC', 'jabatan' => 'Staff'],
            ['fid' => '254', 'nama_karyawan' => 'Annisa', 'divisi' => 'QC', 'jabatan' => 'Staff'],
            ['fid' => '246', 'nama_karyawan' => 'Malik', 'divisi' => 'QC', 'jabatan' => 'Staff'],
            //Admin
            ['fid' => '97',  'nama_karyawan' => 'Noviyanti', 'divisi' => 'Admin', 'jabatan' => 'Staff'],
            ['fid' => '299', 'nama_karyawan' => 'Salsabila', 'divisi' => 'Admin', 'jabatan' => 'Staff'],
            ['fid' => '245', 'nama_karyawan' => 'Hida', 'divisi' => 'Admin', 'jabatan' => 'Staff'],
            ['fid' => '298', 'nama_karyawan' => 'Yesha', 'divisi' => 'Admin', 'jabatan' => 'Staff'],
            ['fid' => '281', 'nama_karyawan' => 'Novia', 'divisi' => 'Admin', 'jabatan' => 'Staff'],
            //IT
            ['fid' => '170', 'nama_karyawan' => 'Hendi', 'divisi' => 'IT', 'jabatan' => 'Staff'],
            ['fid' => '309', 'nama_karyawan' => 'Irfan', 'divisi' => 'IT', 'jabatan' => 'Staff'],
            //Kelistrikan
            ['fid' => '220', 'nama_karyawan' => 'Gani', 'divisi' => 'Kelistrikan', 'jabatan' => 'Staff'],
            //Ekspedisi
            ['fid' => '307', 'nama_karyawan' => 'Walid', 'divisi' => 'Ekspedisi', 'jabatan' => 'Staff'],


            // Staff Laki-Laki (Admin & HRD)
            ['fid' => '30',  'nama_karyawan' => 'Hamid', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '121', 'nama_karyawan' => 'Ahmad Aeli', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '168', 'nama_karyawan' => 'Sandi', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],

            // Staff Laki-Laki (IT)
            ['fid' => '26',  'nama_karyawan' => 'Doni', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '193', 'nama_karyawan' => 'Irpan', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '265', 'nama_karyawan' => 'Acep', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],

            // Staff Laki-Laki (QC)
            ['fid' => '71',  'nama_karyawan' => 'Ali', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '89',  'nama_karyawan' => 'Anggi', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '112', 'nama_karyawan' => 'Baihaki', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],     

            // Staff Laki-Laki (Produksi)
            ['fid' => '23',  'nama_karyawan' => 'Ajat', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '66',  'nama_karyawan' => 'Burhan', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '111', 'nama_karyawan' => 'Budiman', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '196', 'nama_karyawan' => 'Kosim', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '224', 'nama_karyawan' => 'Mulyadi', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '231', 'nama_karyawan' => 'Dede M. Ramdan', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '257', 'nama_karyawan' => 'Kuswandi', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '269', 'nama_karyawan' => 'Jajang Permana', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '273', 'nama_karyawan' => 'Wandi', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],

            // Staff Laki-Laki (Satpam)
            ['fid' => '31',  'nama_karyawan' => 'Rahmat', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '32',  'nama_karyawan' => 'Lukman', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '35',  'nama_karyawan' => 'Ujang', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '43',  'nama_karyawan' => 'Wawan', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '46',  'nama_karyawan' => 'Marda', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '70',  'nama_karyawan' => 'Bahtiar', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '191', 'nama_karyawan' => 'Nanang', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '192', 'nama_karyawan' => 'Unang', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '222', 'nama_karyawan' => 'Apipudin', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '266', 'nama_karyawan' => 'Doni Suheri', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '274', 'nama_karyawan' => 'Nur Ilham', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '94',  'nama_karyawan' => 'Wahyudin', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],



            ['fid' => '49',  'nama_karyawan' => 'Erna', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '50',  'nama_karyawan' => 'Halimah', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '130', 'nama_karyawan' => 'Elsa', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],

            // Staff Perempuan (IT)
            ['fid' => '61',  'nama_karyawan' => 'Nia', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '131', 'nama_karyawan' => 'Rika', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],

            // Staff Perempuan (QC)
            ['fid' => '52',  'nama_karyawan' => 'Yati', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '53',  'nama_karyawan' => 'Yuyun', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '262', 'nama_karyawan' => 'Reni', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],

            // Staff Perempuan (Produksi)
            ['fid' => '54',  'nama_karyawan' => 'Neni', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '55',  'nama_karyawan' => 'Tini', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '58',  'nama_karyawan' => 'Yayah', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '64',  'nama_karyawan' => 'Rina', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '67',  'nama_karyawan' => 'Ai', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '186', 'nama_karyawan' => 'Pipin', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '228', 'nama_karyawan' => 'Mulyati', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '264', 'nama_karyawan' => 'Eni', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],
            ['fid' => '267', 'nama_karyawan' => 'Wida', 'divisi' => 'Produksi', 'jabatan' => 'Karyawan'],

            // ... (Data staff sebelumnya) ...

            // Staff Supir & Kenek (Divisi Logistik / Umum)
            ['fid' => '17',  'nama_karyawan' => 'Onet', 'divisi' => 'Supir', 'jabatan' => 'Karyawan'],
            ['fid' => '140', 'nama_karyawan' => 'Untung', 'divisi' => 'Supir', 'jabatan' => 'Karyawan'],
            ['fid' => '142', 'nama_karyawan' => 'Taufik', 'divisi' => 'Supir', 'jabatan' => 'Karyawan'],
            ['fid' => '144', 'nama_karyawan' => 'Hilman', 'divisi' => 'Supir', 'jabatan' => 'Karyawan'],
            ['fid' => '145', 'nama_karyawan' => 'Oting', 'divisi' => 'Supir', 'jabatan' => 'Karyawan'],
            ['fid' => '150', 'nama_karyawan' => 'Uti', 'divisi' => 'Supir', 'jabatan' => 'Karyawan'],
            ['fid' => '152', 'nama_karyawan' => 'Uju', 'divisi' => 'Supir', 'jabatan' => 'Karyawan'],
            ['fid' => '155', 'nama_karyawan' => 'Ridwan', 'divisi' => 'Supir', 'jabatan' => 'Karyawan'],
            ['fid' => '156', 'nama_karyawan' => 'Luki', 'divisi' => 'Supir', 'jabatan' => 'Karyawan'],
            ['fid' => '201', 'nama_karyawan' => 'Rendi', 'divisi' => 'Supir', 'jabatan' => 'Karyawan'],
            ['fid' => '207', 'nama_karyawan' => 'Dede', 'divisi' => 'Supir', 'jabatan' => 'Karyawan'],
            ['fid' => '208', 'nama_karyawan' => 'Rahmat', 'divisi' => 'Supir', 'jabatan' => 'Karyawan'],
            ['fid' => '209', 'nama_karyawan' => 'Hendi Kenek', 'divisi' => 'Supir', 'jabatan' => 'Karyawan'],
            ['fid' => '232', 'nama_karyawan' => 'Lili', 'divisi' => 'Supir', 'jabatan' => 'Karyawan'],
            ['fid' => '234', 'nama_karyawan' => 'Ramlan', 'divisi' => 'Supir', 'jabatan' => 'Karyawan'],
            ['fid' => '236', 'nama_karyawan' => 'Usup', 'divisi' => 'Supir', 'jabatan' => 'Karyawan'],
            ['fid' => '237', 'nama_karyawan' => 'Enjang', 'divisi' => 'Supir', 'jabatan' => 'Karyawan'],
            ['fid' => '278', 'nama_karyawan' => 'Epan (Supir)', 'divisi' => 'Supir', 'jabatan' => 'Karyawan'],

            // ... (Data staff sebelumnya) ...

            // Staff Satpam Tambahan
            ['fid' => '21',  'nama_karyawan' => 'Ace Abdul Al Hamid', 'divisi' => 'Keamanan', 'jabatan' => 'Karyawan'],
            ['fid' => '20',  'nama_karyawan' => 'Enang', 'divisi' => 'Keamanan', 'jabatan' => 'Karyawan'],
            ['fid' => '285', 'nama_karyawan' => 'Irsan', 'divisi' => 'Keamanan', 'jabatan' => 'Karyawan'],
            ['fid' => '213', 'nama_karyawan' => 'Tuti Dwi Cahyani', 'divisi' => 'Keamanan', 'jabatan' => 'Karyawan'],
            ['fid' => '137', 'nama_karyawan' => 'Wandi', 'divisi' => 'Keamanan', 'jabatan' => 'Karyawan'],
            
        ];

        foreach ($dataKaryawan as $karyawan) {
            DB::table('karyawans')->updateOrInsert(
                ['fid' => $karyawan['fid']],
                [
                    'nama_karyawan' => $karyawan['nama_karyawan'],
                    'divisi' => $karyawan['divisi'] ?? null,
                    'jabatan' => $karyawan['jabatan'] ?? null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}