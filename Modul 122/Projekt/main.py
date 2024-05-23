import os
import csv
import random
import string
import zipfile
import smtplib
import mimetypes
from email.message import EmailMessage
from datetime import datetime



def import_data(import_location, data):
    with open(import_location, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            
            id = row['id']
            first_name = row['Vorname']
            last_name = row['Nachname']
            gender = row['Geschl']
            street = row['Strasse']
            street_number = row['StrNummer']
            zip = row['Postleitzahl']
            city = row['Ort']
            
            data.append({
                'id': id,
                'first_name': first_name,
                'last_name': last_name,
                'gender': gender,
                'street': street,
                'street_number': street_number,
                'zip': zip,
                'city': city
                })
            
        return data



def export_data(export_location, data, fields):
    
    delimiter = '|'
    quotechar = '"'
    
    with open(export_location, mode='w', encoding='utf-8', newline='') as file:
        
        writer = csv.DictWriter(file, fieldnames=fields, delimiter=delimiter, quotechar=quotechar, quoting=csv.QUOTE_ALL)
        writer.writeheader()
        
        for entry in data:
            writer.writerow({field: entry[field] for field in fields})



def append_data_for_export(exported_data, email, password):
    exported_data.append({
        'email': email,
        'password': password
    })



def generate_password(length, pieces):
    
    password = []
    allowed_special_chars = '#$%&@'
    
    allowed_characters = (
        string.ascii_uppercase +
        string.ascii_lowercase +
        string.digits +
        allowed_special_chars
    )
    
    for _ in range(0, pieces, 1):
        
        piece = ''.join(random.choice(allowed_characters) for _ in range(length))
        password.append(piece)
    
    password = '-'.join(password)
    return password
    


def replace_uncommon_chars(x_name, uncommon_chars):
    
    result = ''
    
    for char in x_name:
        result += uncommon_chars.get(char, char)
        
    return result.replace("'", '')



def generate_email(first_name, last_name, uncommon_chars):
    
    first_name = replace_uncommon_chars(first_name, uncommon_chars)
    last_name = replace_uncommon_chars(last_name, uncommon_chars)
    
    email = f'{first_name.replace(' ', '')}.{last_name.replace(' ', '')}@edu.tbz.ch'.lower()
    return email



def get_time(format):
    
    current_datetime = datetime.now()
    
    match(format):
        case ['year', 'month', 'day', 'hour', 'minute']:
            formatted_datetime = current_datetime.strftime('%Y-%m-%d_%H-%M')
            
        case ['day', 'month', 'year']:
            formatted_datetime = current_datetime.strftime('%d-%m-%Y')
            
    return formatted_datetime



def create_zip_file(zip_name, folders):
    with zipfile.ZipFile(zip_name, 'w') as zipf:
        for folder in folders:
            for root, _, files in os.walk(folder):
                for file in files:
                    zipf.write(os.path.join(root, file), os.path.relpath(os.path.join(root, file), os.path.join(folder, '..')))
    


def create_mail_message(date, first_name, last_name, gender, street, street_number, zip, city, email, password):
    
    match(gender):
        case 'Male':
            salutation = 'Lieber'
            
        case 'Female':
            salutation = 'Liebe'
            
        case _:
            salutation = 'Liebe/r'
    
    message = f'''
Technische Berufsschule Zürich
Ausstellungsstrasse 70
8005 Zürich

Zürich, den {date}

                        {first_name} {last_name}
                        {street} {street_number}
                        {zip} {city}
								

{salutation} {first_name}

Es freut uns, Sie im neuen Schuljahr begrüssen zu dürfen.

Damit Sie am ersten Tag sich in unsere Systeme einloggen
können, erhalten Sie hier Ihre neue Emailadresse und Ihr
Initialpasswort, das Sie beim ersten Login wechseln müssen.

Emailadresse:   {email}
Passwort:       {password}


Mit freundlichen Grüssen

Lorenzo Hug
(TBZ-IT-Service)


admin.it@tbz.ch, Abt. IT: +41 44 446 96 60
'''

    with open(f'letters/{email}.brf', mode='w', encoding='utf-8') as file:
        file.write(message)



def send_mail(subject, body, attachment, sender_email, sender_password, receiver_email):
    msg = EmailMessage()
    msg.set_content(body)   
    msg['Subject'] = subject
    msg['From'] = sender_email
    msg['to'] = receiver_email

    mime_type, _ = mimetypes.guess_type(attachment)
    if mime_type is None:
        mime_type = 'application/octet-stream'
    
    main_type, sub_type = mime_type.split('/', 1)
    
    with open(attachment, 'rb') as file:
        msg.add_attachment(file.read(), maintype=main_type, subtype=sub_type, filename=attachment)
        
    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(sender_email, sender_password)
            server.send_message(msg)
        
        print(f'Email with attachment sent to {receiver_email}')
        
    except Exception as error:
        print(f'Failed to send mail: {error}')


  
def print_all(data):
    
    width = 45
    
    for entry in data:
        
        print(f'{'':-^{width}}')
        
        for x, y in entry.items():
            length = width - len(x) - 2
            y = '' if y is None else y
            print(f'{x}: {y:>{length}}')
            
        print(f'{'':-^{width}}\n')



def main():
    
    uncommon_chars = {
        'Á': 'A',
        'Ä': 'Ae',
        'Å': 'A',
        'Ç': 'C',
        'É': 'E',
        'Ö': 'Oe',
        'à': 'a',
        'á': 'a',
        'â': 'a',
        'ã': 'a',
        'ä': 'ae',
        'å': 'a',
        'ç': 'c',
        'è': 'e',
        'é': 'e',
        'ê': 'e',
        'ë': 'e',
        'ì': 'i',
        'í': 'i',
        'î': 'i',
        'ï': 'i',
        'ñ': 'n',
        'ò': 'o',
        'ó': 'o',
        'ô': 'o',
        'õ': 'o',
        'ö': 'oe',
        'ø': 'o',
        'ù': 'u',
        'ú': 'u',
        'ü': 'ue',
        'ý': 'y',
        'ā': 'a',
        'ć': 'c',
        'č': 'c',
        'Đ': 'D',
        'ē': 'e',
        'ę': 'e',
        'ě': 'e',
        'ī': 'i',
        'ł': 'l',
        'ń': 'n',
        'Ō': 'O',
        'ō': 'o',
        'ř': 'r',
        'Ś': 'S',
        'ś': 's',
        'Ş': 'S',
        'ş': 's',
        'š': 's',
        'ũ': 'u',
        'ū': 'u',
        'ŭ': 'u',
        'ż': 'z',
        'ž': 'z',
        '̀': '',
        'К': 'K',
        'М': 'M',
        'Р': 'P',
        'а': 'a',
        'в': 'v',
        'д': 'd',
        'и': 'i',
        'л': 'l',
        'н': 'n',
        'о': 'o',
        'р': 'r',
        'т': 't',
        'ш': 'sh',
        'ḏ': 'd',
        'ḑ': 'd',
        'Ḩ': 'H',
        'ằ': 'a',
        'ố': 'o',
        'ộ': 'o',
        'ớ': 'o',
        'ợ': 'o',
        'ủ': 'u',
        'ừ': 'u',
        'ữ': 'u',
        '‘': "'",
        '’': "'"
    }
    
    imported_data = []
    exported_data = []
    
    import_location = 'import/MOCK_DATA.CSV'
    export_location = f'export/{get_time(['year', 'month', 'day', 'hour', 'minute'])}.csv'
    
    password_piece_length = 6
    password_pieces_amount = 3
    
    csv_data = import_data(import_location, imported_data)
    
    
    for entry in csv_data:
        
        first_name = entry['first_name']
        last_name = entry['last_name']
        gender = entry['gender']
        street = entry['street']
        street_number = entry['street_number']
        zip = entry['zip']
        city = entry['city']
        
        entry['email'] = generate_email(first_name, last_name, uncommon_chars)
        entry['password'] = generate_password(password_piece_length, password_pieces_amount)
        
        email = entry['email']
        password = entry['password']
        
        append_data_for_export(exported_data, email, password)
        create_mail_message(get_time(['day', 'month', 'year']), first_name, last_name, gender, street, street_number, zip, city, email, password)
    
    archive_file_name = 'archive.zip'
    
    create_zip_file(archive_file_name, ['export', 'letters'])
    export_data(export_location, exported_data, ['email', 'password'])
    
    new_mails_amount = len(exported_data)
    
    sender_email = 'lorenzo.hug@bsfh-lernende.ch'
    sender_password = 'HuLo981'
    receiver_email = 'lorenzo.hug@icloud.com'
    
    mail_subject = f'Neue TBZ-Mailadressen {new_mails_amount}'
    mail_body = f'''
Lieber Testmann

Die Emailadressen-Generierung ist beendet. 
Es wurden {new_mails_amount} erzeugt.

Bei Fragen kontaktiere bitte lorenzo.hug@bsfh-lernende.ch

Gruss Lorenzo Hug
'''
    mail_attachment = archive_file_name
    
    # send_mail(mail_subject, mail_body, mail_attachment, sender_email, sender_password, receiver_email)
    
    

main()
