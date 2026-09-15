from PIL import Image

# Penanda khusus untuk memberi tahu program kapan pesan rahasia berakhir.
# Jika tidak ada penanda ini, program akan terus mengekstraksi piksel sampai gambar habis,
# yang akan menghasilkan teks sampah (garbage text) di akhir pesan.
DELIMITER = "#####END#####"

def text_to_binary(text):
    """
    Mengubah teks string (termasuk karakter Base64) menjadi urutan bit biner (0 dan 1).
    Contoh: 'A' -> '01000001'
    """
    return ''.join(format(ord(char), '08b') for char in text)

def hide_data(image_path, secret_data, output_path):
    """
    Menyisipkan teks rahasia ke dalam bit paling tidak signifikan (LSB) pada piksel gambar.
    """
    try:
        # 1. Buka gambar dan pastikan formatnya adalah RGB (Red, Green, Blue)
        img = Image.open(image_path)
        if img.mode != 'RGB':
            img = img.convert('RGB')
            
        pixels = img.load()
        width, height = img.size
        
        # 2. Tambahkan delimiter di akhir pesan agar tahu kapan harus berhenti saat ekstraksi
        data_with_delimiter = secret_data + DELIMITER
        
        # 3. Ubah teks yang sudah ditambah delimiter menjadi biner
        binary_data = text_to_binary(data_with_delimiter)
        data_len = len(binary_data)
        
        # 4. Validasi Kapasitas Gambar
        # 1 piksel RGB punya 3 channel (R, G, B), jadi bisa menampung 3 bit.
        max_capacity = width * height * 3
        if data_len > max_capacity:
            raise Exception(f"Kapasitas gambar terlalu kecil. Butuh {data_len} bit, tapi gambar hanya menampung {max_capacity} bit.")
            
        data_index = 0
        
        # 5. Mulai proses penyisipan dengan mengubah LSB (Least Significant Bit)
        for y in range(height):
            for x in range(width):
                if data_index < data_len:
                    r, g, b = pixels[x, y]
                    
                    # --- Operasi Bitwise ---
                    # (r & ~1) berfungsi mengosongkan bit terakhir (menjadi 0).
                    # | int(binary_data[data_index]) berfungsi mengisi bit terakhir dengan data rahasia kita.
                    
                    # Sisipkan ke channel Merah (Red)
                    if data_index < data_len:
                        r = (r & ~1) | int(binary_data[data_index])
                        data_index += 1
                        
                    # Sisipkan ke channel Hijau (Green)
                    if data_index < data_len:
                        g = (g & ~1) | int(binary_data[data_index])
                        data_index += 1
                        
                    # Sisipkan ke channel Biru (Blue)
                    if data_index < data_len:
                        b = (b & ~1) | int(binary_data[data_index])
                        data_index += 1
                        
                    # Terapkan perubahan warna kembali ke piksel
                    pixels[x, y] = (r, g, b)
                else:
                    break # Hentikan loop jika semua data sudah tersisip
            if data_index >= data_len:
                break
                
        # 6. Simpan gambar hasil steganografi 
        # WAJIB disimpan dalam format PNG (lossless) agar bit yang diubah tidak hancur saat disimpan.
        img.save(output_path, format="PNG")
        
    except Exception as e:
        raise Exception(f"Proses Steganografi Gagal: {str(e)}")


def extract_data(image_path):
    """
    Mengekstrak data biner dari LSB piksel gambar dan mengubahnya kembali menjadi teks.
    """
    try:
        img = Image.open(image_path)
        if img.mode != 'RGB':
            img = img.convert('RGB')
            
        pixels = img.load()
        width, height = img.size
        
        binary_data = ""
        extracted_text = ""
        
        # 1. Ekstrak bit terakhir (LSB) dari setiap piksel
        for y in range(height):
            for x in range(width):
                r, g, b = pixels[x, y]
                
                # Mengambil sisa bagi 2 (sama dengan mengambil bit paling akhir)
                binary_data += str(r & 1)
                binary_data += str(g & 1)
                binary_data += str(b & 1)
                
        # 2. Kelompokkan setiap 8 bit menjadi 1 karakter
        for i in range(0, len(binary_data), 8):
            byte = binary_data[i:i+8]
            
            # Pastikan panjang bit utuh 8 untuk membentuk 1 huruf ASCII
            if len(byte) == 8:
                extracted_text += chr(int(byte, 2))
                
                # 3. Cek apakah Delimiter sudah tercapai
                if extracted_text.endswith(DELIMITER):
                    # Jika ya, buang delimiter-nya dan kembalikan teks aslinya
                    return extracted_text[:-len(DELIMITER)]
                    
        # Jika loop selesai tapi tidak menemukan delimiter, artinya gambar tersebut tidak berisi pesan kita
        raise Exception("Penanda akhir (delimiter) tidak ditemukan. Gambar mungkin bukan stego image atau telah rusak (terkompresi).")
        
    except Exception as e:
        raise Exception(f"Proses Ekstraksi Gagal: {str(e)}")