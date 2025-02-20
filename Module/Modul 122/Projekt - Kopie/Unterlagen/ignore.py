import csv

uncommon_chars = {
    'ö': 'oe',
    'ä': 'ae',
    'ü': 'ue',
    'é': 'e',
    'à': 'a',
    'è': 'e',
    'ï': 'i'
}

customers = [
    {
        'name': 'Thomas Purger'
    },
    {
        'name': 'Peter Sauger'
    },
    {
        'name': 'Sibylle Püllnis'
    }
]

with open('MOCK_DATA.csv', mode='r', encoding='utf-8') as file:
    reader = csv.DictReader(file)
    for row in reader:
        first_name = row['Vorname']
        last_name = row['Nachname']
        customers.append({'name': f'{first_name} {last_name}'})

def replace_uncommon_chars(name):
    
    result = ''
    i = 0
    
    while i < len(name):
        if name[i] in uncommon_chars:
            result += uncommon_chars[name[i]]
            
        else:
            result += name[i]
            
        i += 1
    
    return result

def generate_mail(name):
    
    name = name.lower()
    result = replace_uncommon_chars(name)
    final = f'{result.split()[0]}.{result.split()[1]}@edu.tbz.ch'
    return final

def print_all_customers():
    for entry in customers:
        entry['mail'] = generate_mail(entry['name'])
        print(f"\n{''.join(list(entry.keys())[0])}: {''.join(list(entry.values())[0])}\n{''.join(list(entry.keys())[1])}: {''.join(list(entry.values())[1])}\n")
        
print_all_customers()
