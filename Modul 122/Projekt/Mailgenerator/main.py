import os
import csv
import random
import string
import zipfile
import requests
from datetime import datetime



def get_csv():
    
    url = 'https://haraldmueller.ch/schueler/m122_projektunterlagen/b/MOCK_DATA.csv'
    directory = 'import/'
    
    os.makedirs(directory, exist_ok=True)
    file_path = os.path.join(directory, 'mock_data.csv')
    
    response = requests.get(url)
    with open(file_path, 'wb') as file:
        file.write(response.content)
        
    return file_path



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
    


def create_password(length, pieces):
    
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
    
    return f'{first_name}.{last_name}@edu.tbz.ch'.lower()



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

E-Mail:         {email}
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
            salutation = 'Sehr geehrter Herr'
            
        case 'Female':
            salutation = 'Sehr geehrte Frau'
            
        case _:
            salutation = 'Sehr geehrte*r'
    
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



def send_mail(archive_file_name, amount_of_new_mails, author, server_url, generation_date):
    
    mail_data = {
        'from': author['mails']['school'],
        'to': author['mails']['outlook'],
        'subject': f'Neue TBZ-E-Mail-Adressen: {amount_of_new_mails}',
        'message': f'''
{define_salutation(author['gender'])} {author['last_name']}

die Generierung der E-Mail-Adressen wurde um {generation_date} abgeschlossen. Insgesamt wurden {amount_of_new_mails} neue Adressen erstellt.
Im Anhang finden Sie alle Briefe, sowie eine Tabelle mit allen generierten Adressen.

Bei Fragen können Sie mich gerne unter {author['mails']['school']} kontaktieren.

Freundliche Grüsse

{author['first_name']} {author['last_name']}
        '''
    }

    archive_file = {'attachment': open(archive_file_name, 'rb')}
    response = requests.post(server_url, data=mail_data, files=archive_file)
    
    try:
        response.raise_for_status()
        result = response.json()
        
        if result['status'] == 'success':
            print(result['message'])
            
        else:
            print(f"Fehler: {result['message']}")
            
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP-Fehler: {http_err}")
        
    except requests.exceptions.RequestException as req_err:
        print(f"Anfrage-Fehler: {req_err}")
        
    except ValueError:
        print(f"Ungültige JSON-Antwort: {response.text}")
        
    finally:
        archive_file['attachment'].close()



def process_entries(import_data, uncommon_chars, author, password_piece_length, password_pieces_amount):
    
    export_data = []
    
    for entry in import_data:
        
        first_name = entry['first_name']
        last_name = entry['last_name']
        gender = entry['gender']
        street = entry['street']
        street_number = entry['street_number']
        zip_code = entry['zip_code']
        city = entry['city']
        email = entry['email'] = create_email(first_name, last_name, uncommon_chars)
        password = entry['password'] = create_password(password_piece_length, password_pieces_amount)
        
        create_letter(get_time('%d-%m-%Y'), first_name, last_name, gender, street, street_number, zip_code, city, email, password, author)
        append_data_for_export(export_data, email, password)

    return export_data



def main():
    
    author = {
        'first_name': 'Lorenzo',
        'last_name': 'Hug',
        'gender': 'Male',
        'mails': {
            'outlook': 'sibby.hug@outlook.com',
            'school': 'lorenzo.hug@bsfh-lernende.ch',
            'work': 'lorenzo.hug@espas.ch'
        }
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
        '’': "'",
        ' ': ''
    }
    
    generation_date = get_time('%H:%M:%S')
    
    password_piece_length = 6
    password_pieces_amount = 3
    
    server_url = 'https://mailgenerator.bm-it.ch/mail.php'
    archive_file_name = f'{get_time('%Y-%m-%d')}_newMailadr_{author['last_name'].lower()}.zip'
    
    import_location = get_csv()
    export_location = f'export/{get_time('%Y-%m-%d_%H-%M')}.csv'

    import_data = get_data(import_location)
    export_data = process_entries(import_data, uncommon_chars, author, password_piece_length, password_pieces_amount)
    
    set_data(export_location, export_data, ['email', 'password'])
    create_zip_file(archive_file_name, ['export', 'letters'])
    send_mail(archive_file_name, len(import_data), author, server_url, generation_date)



main()
