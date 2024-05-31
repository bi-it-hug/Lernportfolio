import hashlib

def calculate_file_hash(file_path, hash_algorithm='sha256'):
    hash_func = hashlib.new(hash_algorithm)
    with open(file_path, 'rb') as file:
        while chunk := file.read(8192):
            hash_func.update(chunk)
    return hash_func.hexdigest()

file_path = 'Verschlüsselung/colorInverter.py'
hash_value = calculate_file_hash(file_path)
print(f"Hash-Wert der Datei: {hash_value}")

#
#
#

def crack_md5_hash(target_hash, wordlist):
    for word in wordlist:
        hashed_word = hashlib.md5(word.encode()).hexdigest()
        if hashed_word == target_hash:
            return word
    return None

wordlist = [
    '123456', 'password', '123456789', '12345678', '12345', '1234567', 'password1',
    'abc123', 'qwerty', '111111', 'password123', 'letmein', 'welcome', 'monkey'
]

target_hash_md5 = 'b68a03c41c766d8c13e7a92ab18f7e58'
cracked_password = crack_md5_hash(target_hash_md5, wordlist)

if cracked_password:
    print(f"Der ursprüngliche Inhalt ist: {cracked_password}")
else:
    print("Der Hash konnte nicht geknackt werden.")