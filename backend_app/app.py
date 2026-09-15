import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename

# Mengimpor modul algoritma dari folder utils
# (Fungsi-fungsi ini akan Anda tulis nanti di file masing-masing)
from utils.aes_cipher import encrypt_data, decrypt_data
from utils.lsb_stego import hide_data, extract_data

app = Flask(__name__)
CORS(app) # Mengizinkan React (Frontend) untuk mengakses API Flask

# Konfigurasi folder penyimpanan sementara
UPLOAD_FOLDER = 'temp_uploads'
OUTPUT_FOLDER = 'temp_outputs'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER

# Memastikan folder sementara tersedia saat server berjalan
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# ---------------------------------------------------------
# ENDPOINT 1: PROSES PENGIRIM (ENKRIPSI & SISIPKAN LSB)
# ---------------------------------------------------------
@app.route('/api/encrypt', methods=['POST'])
def encrypt_process():
    # 1. Menangkap data dari React (FormData)
    if 'image' not in request.files:
        return jsonify({"error": "File gambar tidak ditemukan"}), 400
    
    file = request.files['image']
    plaintext = request.form.get('plaintext')
    secret_key = request.form.get('secret_key')

    if not plaintext or not secret_key:
        return jsonify({"error": "Plaintext dan Secret Key wajib diisi"}), 400

    # 2. Menyimpan gambar asli secara sementara
    filename = secure_filename(file.filename)
    input_image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(input_image_path)

    try:
        # 3. Proses Enkripsi Teks (AES-256)
        ciphertext = encrypt_data(plaintext, secret_key)

        # 4. Proses Penyisipan Teks ke Gambar (LSB)
        output_filename = f"stego_{filename}"
        output_image_path = os.path.join(app.config['OUTPUT_FOLDER'], output_filename)
        
        hide_data(input_image_path, ciphertext, output_image_path)

        # 5. Menghapus gambar asli dari server (Pembersihan)
        os.remove(input_image_path)

        # 6. Mengirimkan Stego Image kembali ke React untuk diunduh pengirim
        return send_file(output_image_path, as_attachment=True)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------------------------------------------------
# ENDPOINT 2: PROSES PENERIMA (EKSTRAKSI LSB & DEKRIPSI)
# ---------------------------------------------------------
@app.route('/api/decrypt', methods=['POST'])
def decrypt_process():
    # 1. Menangkap data dari React (FormData)
    if 'image' not in request.files:
        return jsonify({"error": "File gambar (Stego Image) tidak ditemukan"}), 400
    
    file = request.files['image']
    secret_key = request.form.get('secret_key')

    if not secret_key:
        return jsonify({"error": "Secret Key wajib diisi"}), 400

    # 2. Menyimpan Stego Image secara sementara
    filename = secure_filename(file.filename)
    stego_image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(stego_image_path)

    try:
        # 3. Proses Ekstraksi Teks dari Gambar (LSB)
        extracted_ciphertext = extract_data(stego_image_path)

        # 4. Proses Dekripsi Teks (AES-256)
        decrypted_plaintext = decrypt_data(extracted_ciphertext, secret_key)

        # 5. Menghapus Stego Image dari server (Pembersihan)
        os.remove(stego_image_path)

        # 6. Mengirimkan Plaintext (Pesan Asli) kembali ke React untuk ditampilkan
        return jsonify({
            "status": "success",
            "plaintext": decrypted_plaintext
        }), 200

    except Exception as e:
        # Jika kunci salah atau gambar rusak/tidak ada pesan rahasia
        return jsonify({"error": "Gagal membaca pesan. Pastikan gambar tidak rusak dan Secret Key benar."}), 400


if __name__ == '__main__':
    app.run(debug=True, port=5000)