import base64
from Cryptodome.Cipher import AES
from Cryptodome.Util.Padding import pad, unpad
from Cryptodome.Protocol.KDF import PBKDF2
from Cryptodome.Random import get_random_bytes

# Ukuran standar AES (Block Size = 16 bytes, Key Size untuk AES-256 = 32 bytes)
BLOCK_SIZE = 16
KEY_SIZE = 32

def derive_key(secret_key_string, salt):
    """
    Fungsi untuk mengubah secret key (berupa teks bebas dari user) 
    menjadi kunci 32-byte (256-bit) yang valid untuk AES-256 menggunakan PBKDF2.
    """
    # Menggunakan 1.000.000 iterasi agar tahan terhadap brute-force (standar keamanan modern)
    key = PBKDF2(secret_key_string, salt, dkLen=KEY_SIZE, count=1000000)
    return key

def encrypt_data(plaintext_string, secret_key_string):
    """
    Fungsi untuk mengenkripsi teks asli menjadi ciphertext.
    """
    try:
        # 1. Konversi teks ke dalam bentuk bytes
        plaintext_bytes = plaintext_string.encode('utf-8')
        
        # 2. Buat Salt dan IV (Initialization Vector) secara acak
        # Salt mengamankan password, IV mengamankan blok pertama AES
        salt = get_random_bytes(16)
        
        # 3. Hasilkan Kunci 256-bit
        key = derive_key(secret_key_string, salt)
        
        # 4. Inisialisasi mesin AES dengan Mode CBC
        cipher = AES.new(key, AES.MODE_CBC)
        iv = cipher.iv
        
        # 5. Tambahkan padding agar panjang teks kelipatan 16 byte, lalu enkripsi
        padded_data = pad(plaintext_bytes, BLOCK_SIZE)
        encrypted_bytes = cipher.encrypt(padded_data)
        
        # 6. Gabungkan komponen (Salt + IV + Ciphertext) agar bisa didekripsi nanti
        # Susunan: 16 byte pertama = salt, 16 byte kedua = IV, sisanya = ciphertext
        final_payload = salt + iv + encrypted_bytes
        
        # 7. Ubah ke format Base64 string agar mudah disisipkan ke dalam gambar oleh LSB
        b64_encoded_payload = base64.b64encode(final_payload).decode('utf-8')
        
        return b64_encoded_payload

    except Exception as e:
        raise Exception(f"Proses Enkripsi Gagal: {str(e)}")

def decrypt_data(b64_ciphertext_string, secret_key_string):
    """
    Fungsi untuk mendekripsi ciphertext kembali menjadi teks asli.
    """
    try:
        # 1. Ubah kembali Base64 string menjadi bytes
        final_payload = base64.b64decode(b64_ciphertext_string)
        
        # 2. Pisahkan komponen (Salt, IV, dan Ciphertext)
        # Ingat susunan saat mengenkripsi: 16 byte salt, 16 byte IV
        salt = final_payload[:16]
        iv = final_payload[16:32]
        encrypted_bytes = final_payload[32:]
        
        # 3. Hasilkan kembali Kunci 256-bit menggunakan Salt yang diekstrak
        key = derive_key(secret_key_string, salt)
        
        # 4. Inisialisasi mesin AES yang sama untuk membongkar
        cipher = AES.new(key, AES.MODE_CBC, iv)
        
        # 5. Dekripsi dan buang padding-nya
        decrypted_padded_bytes = cipher.decrypt(encrypted_bytes)
        plaintext_bytes = unpad(decrypted_padded_bytes, BLOCK_SIZE)
        
        # 6. Ubah bytes kembali menjadi teks string
        return plaintext_bytes.decode('utf-8')

    except ValueError:
        # ValueError biasanya terjadi di fungsi unpad() jika kunci salah
        raise Exception("Secret Key salah atau data telah rusak!")
    except Exception as e:
        raise Exception(f"Proses Dekripsi Gagal: {str(e)}")