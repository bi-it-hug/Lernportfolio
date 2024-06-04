import os
import csv
import random
import string
import zipfile
import requests
import smtplib
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders



def get_data(import_location):
    
    data = []
    
    with open(import_location, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            
            id = row['id']
            first_name = row['Vorname']
            last_name = row['Nachname']
            gender = row['Geschl']
            street = row['Strasse']
            street_number = row['StrNummer']
            zip_code = row['Postleitzahl']
            city = row['Ort']
            
            data.append({
                'id': id,
                'first_name': first_name,
                'last_name': last_name,
                'gender': gender,
                'street': street,
                'street_number': street_number,
                'zip_code': zip_code,
                'city': city
                })
            
        return data



def set_data(export_location, data, fields):
    
    delimiter = '|'
    quotechar = '"'
    
    with open(export_location, mode='w', encoding='utf-8', newline='') as file:
        
        writer = csv.DictWriter(file, fieldnames=fields, delimiter=delimiter, quotechar=quotechar, quoting=csv.QUOTE_ALL)
        writer.writeheader()
        
        for entry in data:
            writer.writerow({field: entry[field] for field in fields})
            


def append_data_for_export(export_data, email, password):
    export_data.append({
        'email': email,
        'password': password
    })



def create_password(length, pieces, password):
    
    allowed_characters = (
        string.ascii_uppercase +
        string.ascii_lowercase +
        string.digits +
        '#$%&@'
    )
    
    password = [
        ''.join(random.choices(allowed_characters, k=length))
        for _ in range(pieces)
    ]
    
    return '-'.join(password)

    

def replace_uncommon_chars(x_name, uncommon_chars):
    return ''.join(uncommon_chars.get(char, char) for char in x_name).replace("'", '')



def create_email(first_name, last_name, uncommon_chars):
    
    first_name = replace_uncommon_chars(first_name, uncommon_chars)
    last_name = replace_uncommon_chars(last_name, uncommon_chars)
    
    return f'{first_name.replace(' ', '')}.{last_name.replace(' ', '')}@edu.tbz.ch'.lower()



def get_time(format):
    return datetime.now().strftime(format)



def create_zip_file(zip_name, folders):
    with zipfile.ZipFile(zip_name, 'w') as zipf:
        for folder in folders:
            for root, _, files in os.walk(folder):
                for file in files:
                    zipf.write(os.path.join(root, file), os.path.relpath(os.path.join(root, file), os.path.join(folder, '..')))
    


def create_letter(date, first_name, last_name, gender, street, street_number, zip_code, city, email, password, author):
    
    message = f'''
Technische Berufsschule Zürich
Ausstellungsstrasse 70
8005 Zürich

Zürich, den {date}

                        {first_name} {last_name}
                        {street} {street_number}
                        {zip_code} {city}
								

{define_salutation(gender)} {first_name}

Es freut uns, Sie im neuen Schuljahr begrüssen zu dürfen.

Damit Sie am ersten Tag sich in unsere Systeme einloggen
können, erhalten Sie hier Ihre neue Emailadresse und Ihr
Initialpasswort, das Sie beim ersten Login wechseln müssen.

Emailadresse:   {email}
Passwort:       {password}


Mit freundlichen Grüssen

{author['first_name']} {author['last_name']}
(TBZ-IT-Service)


admin.it@tbz.ch, Abt. IT: +41 44 446 96 60
'''

    with open(f'letters/{email}.brf', mode='w', encoding='utf-8') as file:
        file.write(message)



def define_salutation(gender):
        
    match(gender):
        case 'Male':
            salutation = 'Lieber'
            
        case 'Female':
            salutation = 'Liebe'
            
        case _:
            salutation = 'Liebe/r'
    
    return salutation


  
def get_info(data):
    
    width = 45
    
    for entry in data:
        
        print(f'{'':-^{width}}')
        
        for x, y in entry.items():
            length = width - len(x) - 2
            y = '' if y is None else y
            print(f'{x}: {y:>{length}}')
            
        print(f'{'':-^{width}}\n')



def send_mail(archive_file_name, amount_of_new_mails, author):
    
    # Email server configuration
    smtp_server = 'test.mailgenerator.com'
    smtp_port = 25

    # Email details
    from_address = 'sibby.hug@outlook.com'
    to_address = 'lorenzo.hug@icloud.com'
    subject = f'Neue TBZ-Mailadressen {amount_of_new_mails}'
    body = f'''
Lieber Lorenzo,

Die Emailadressen-Generierung ist beendet.
Es wurden {amount_of_new_mails} erzeugt.

Bei Fragen kontaktiere bitte lorenzo.hug@bsfh-lernende.ch

Gruss {author['first_name']} {author['last_name']}
    '''

    # Create the MIME message
    msg = MIMEMultipart()
    msg['From'] = from_address
    msg['To'] = to_address
    msg['Subject'] = subject

    # Attach the body text
    msg.attach(MIMEText(body, 'plain'))

    # Attach the file
    with open(archive_file_name, 'rb') as attachment:
        mime_base = MIMEBase('application', 'octet-stream')
        mime_base.set_payload(attachment.read())
        encoders.encode_base64(mime_base)
        mime_base.add_header('Content-Disposition', f'attachment; filename={archive_file_name}')
        msg.attach(mime_base)

    try:
        # Connect to the server and send the email
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.send_message(msg)
        server.quit()

        print("Email sent successfully")
        
    except Exception as e:
        print(f"Failed to send email: {e}")



def main():
    
    author = {
        'first_name': 'Lorenzo',
        'last_name': 'Hug',
    }
    
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
    
    import_location = 'import/MOCK_DATA.CSV'
    export_location = f'export/{get_time('%Y-%m-%d_%H-%M')}.csv'
    
    import_data = get_data(import_location)
    export_data = []
    
    password = []
    password_piece_length = 6
    password_pieces_amount = 3
    
    archive_file_name = f'{get_time('%Y-%m-%d')}_newMailadr_{author['last_name'].lower()}.zip'
    
    for entry in import_data:
        
        first_name = entry['first_name']
        last_name = entry['last_name']
        gender = entry['gender']
        street = entry['street']
        street_number = entry['street_number']
        zip_code = entry['zip_code']
        city = entry['city']
        email = entry['email'] = create_email(first_name, last_name, uncommon_chars)
        password = entry['password'] = create_password(password_piece_length, password_pieces_amount, password)
        
        create_letter(get_time('%d-%m-%Y'), first_name, last_name, gender, street, street_number, zip_code, city, email, password, author)
        append_data_for_export(export_data, email, password)
    
    set_data(export_location, export_data, ['email', 'password'])
    create_zip_file(archive_file_name, ['export', 'letters'])
    
    send_mail(archive_file_name, len(import_data), author)
    
    #get_info(import_data)
    


main()
