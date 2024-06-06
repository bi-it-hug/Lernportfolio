#!/bin/bash

# Beendet das Skript, wenn ein Fehler auftritt.
set -e

# Beendet das Skript, wenn ein Befehl in einer Pipe fehlschlägt.
set -o pipefail

# Definiere die URL der CSV-Datei und andere Konfigurationsvariablen.
URL="https://haraldmueller.ch/schueler/m122_projektunterlagen/b/MOCK_DATA.csv"
IMPORT_DIR="import"
EXPORT_DIR="export"
LETTERS_DIR="letters"
AUTHOR_FIRST_NAME="Lorenzo"
AUTHOR_LAST_NAME="Hug"
AUTHOR_GENDER="Male"
AUTHOR_EMAIL_OUTLOOK="sibby.hug@outlook.com"
AUTHOR_EMAIL_SCHOOL="lorenzo.hug@bsfh-lernende.ch"
SERVER_URL="https://mailgenerator.bm-it.ch/mail_bash.php"
PASSWORD_PIECE_LENGTH=6
PASSWORD_PIECES_AMOUNT=3
DELIMITER="|"
QUOTECHAR='"'

# Definiere eine assoziative Array zur Ersetzung ungewöhnlicher Zeichen.
declare -A UNCOMMON_CHARS=(
    ["Á"]="A" ["Ä"]="Ae" ["Å"]="A" ["Ç"]="C" ["É"]="E" ["Ö"]="Oe" ["à"]="a" ["á"]="a" ["â"]="a"
    ["ã"]="a" ["ä"]="ae" ["å"]="a" ["ç"]="c" ["è"]="e" ["é"]="e" ["ê"]="e" ["ë"]="e" ["ì"]="i"
    ["í"]="i" ["î"]="i" ["ï"]="i" ["ñ"]="n" ["ò"]="o" ["ó"]="o" ["ô"]="o" ["õ"]="o" ["ö"]="oe"
    ["ø"]="o" ["ù"]="u" ["ú"]="u" ["ü"]="ue" ["ý"]="y" ["ā"]="a" ["ć"]="c" ["č"]="c" ["Đ"]="D"
    ["ē"]="e" ["ę"]="e" ["ě"]="e" ["ī"]="i" ["ł"]="l" ["ń"]="n" ["Ō"]="O" ["ō"]="o" ["ř"]="r"
    ["Ś"]="S" ["ś"]="s" ["Ş"]="S" ["ş"]="s" ["š"]="s" ["ũ"]="u" ["ū"]="u" ["ŭ"]="u" ["ż"]="z"
    ["ž"]="z" ["̀"]="" ["К"]="K" ["М"]="M" ["Р"]="P" ["а"]="a" ["в"]="v" ["д"]="d" ["и"]="i"
    ["л"]="l" ["н"]="n" ["о"]="o" ["р"]="r" ["т"]="t" ["ш"]="sh" ["ḏ"]="d" ["ḑ"]="d" ["Ḩ"]="H"
    ["ằ"]="a" ["ố"]="o" ["ộ"]="o" ["ớ"]="o" ["ợ"]="o" ["ủ"]="u" ["ừ"]="u" ["ữ"]="u" ["‘"]="'"
    ["’"]="'"
)

# Funktion zum Herunterladen der CSV-Datei.
get_csv() {
    local file_path="$IMPORT_DIR/mock_data.csv"

    # Erstelle das Import-Verzeichnis, falls es nicht existiert.
    mkdir -p "$IMPORT_DIR"

    # Lade die CSV-Datei herunter und speichere sie unter file_path.
    curl -o "$file_path" "$URL"

    # Gebe den Pfad der heruntergeladenen Datei zurück.
    printf "%s" "$file_path"
}

# Funktion zum Extrahieren und Formatieren der Daten aus der CSV-Datei.
get_data() {
    local import_location="$1"
    local data=()

    # Lese jede Zeile der CSV-Datei ein und trenne die Felder durch Kommata.
    while IFS=, read -r id first_name last_name gender street street_number zip_code city; do

        # Füge die gelesenen Daten dem Array hinzu, wobei die Felder durch das DELIMITER-Zeichen getrennt werden.
        data+=("$id|$first_name|$last_name|$gender|$street|$street_number|$zip_code|$city")

    # Überspringe die Kopfzeile der CSV-Datei.
    done < <(tail -n +2 "$import_location")

    # Gebe die formatierten Daten zurück.
    printf "%s\n" "${data[@]}"
}

# Funktion zum Speichern der generierten Daten in einer CSV-Datei.
set_data() {
    local export_location="$1"
    shift
    local data=("$@")
    local fields=("email" "password")

    # Erstelle das Export-Verzeichnis, falls es nicht existiert.
    mkdir -p "$(dirname "$export_location")"
    {   

        # Schreibe die Kopfzeile in die Export-Datei.
        printf "%s%s%s\n" "$QUOTECHAR${fields[0]}$QUOTECHAR" "$DELIMITER" "$QUOTECHAR${fields[1]}$QUOTECHAR"
        for entry in "${data[@]}"; do

            # Schreibe die Daten in die Export-Datei.
            printf "%s%s%s\n" "$QUOTECHAR${entry%%|*}$QUOTECHAR" "$DELIMITER" "$QUOTECHAR${entry##*|}$QUOTECHAR"
        done
    } > "$export_location"
}

# Funktion zum Erstellen eines zufälligen Passworts.
create_password() {
    local length="$1"
    local pieces="$2"
    local allowed_characters='A-Za-z0-9#$%&@'
    local passwords=()

    # Generiere ein zufälliges Passwortstück der angegebenen Länge.
    for _ in $(seq 1 "$pieces"); do
        passwords+=("$(LC_ALL=C tr -dc "$allowed_characters" < /dev/urandom | head -c "$length")")
    done

    # Verbinde die Passwortstücke mit einem Bindestrich und gebe das Ergebnis zurück.
    printf "%s" "$(IFS=-; echo "${passwords[*]}")"
}

# Funktion zum Ersetzen von Sonderzeichen in Namen.
replace_uncommon_chars() {
    local name="$1"
    local replaced=""
    local char

    # Ersetze jedes Zeichen im Namen durch das entsprechende Zeichen in UNCOMMON_CHARS.
    for ((i = 0; i < ${#name}; i++)); do
        char="${name:i:1}"
        replaced+="${UNCOMMON_CHARS[$char]:-$char}"
    done

    # Entferne alle Apostrophe aus dem ersetzten Namen.
    replaced="${replaced//\'/}"
    printf "%s" "$replaced"
}

# Funktion zum Erstellen einer E-Mail-Adresse basierend auf dem Vor- und Nachnamen.
create_email() {

    # Konvertiere die Namen zu Kleinbuchstaben und erstelle die E-Mail-Adresse.
    local first_name last_name
    first_name="$(replace_uncommon_chars "$1")"
    last_name="$(replace_uncommon_chars "$2")"
    printf "%s.%s@edu.tbz.ch" "${first_name,,}" "${last_name,,}"
}

# Funktion zum Erstellen eines Briefes mit den Benutzerinformationen.
create_letter() {
    local date="$1"
    local first_name="$2"
    local last_name="$3"
    local gender="$4"
    local street="$5"
    local street_number="$6"
    local zip_code="$7"
    local city="$8"
    local email="$9"
    local password="${10}"
    local author_first_name="${11}"
    local author_last_name="${12}"

    local salutation
    
    case "$gender" in
        Male) salutation="Sehr geehrter Herr" ;;
        Female) salutation="Sehr geehrte Frau" ;;
        *) salutation="Sehr geehrte*r" ;;
    esac

    local message
    message=$(cat <<EOF
Technische Berufsschule Zürich
Ausstellungsstrasse 70
8005 Zürich

Zürich, den $date

                        $first_name $last_name
                        $street $street_number
                        $zip_code $city

$salutation $first_name

Es freut uns, Sie im neuen Schuljahr begrüssen zu dürfen.

Damit Sie am ersten Tag sich in unsere Systeme einloggen
können, erhalten Sie hier Ihre neue Emailadresse und Ihr
Initialpasswort, das Sie beim ersten Login wechseln müssen.

E-Mail:         $email
Passwort:       $password


Mit freundlichen Grüssen

$author_first_name $author_last_name
(TBZ-IT-Service)


admin.it@tbz.ch, Abt. IT: +41 44 446 96 60
EOF
    )

    # Erstelle das Letters-Verzeichnis, falls es nicht existiert.
    mkdir -p "$LETTERS_DIR"

    # Speichere den Brief im Letters-Verzeichnis mit der E-Mail-Adresse als Dateiname.
    printf "%s" "$message" > "$LETTERS_DIR/$email.brf"
}

# Funktion zum Erstellen einer ZIP-Datei mit den generierten Daten.
create_zip_file() {

    # Erstelle eine ZIP-Datei mit den angegebenen Ordnern.
    local zip_name="$1"
    shift
    local folders=("$@")
    zip -r "$zip_name" "${folders[@]}"
}

# Funktion zum Versenden einer E-Mail mit den generierten Daten.
send_mail() {
    local archive_file_name="$1"
    local amount_of_new_mails="$2"
    local author_first_name="$3"
    local author_last_name="$4"
    local author_gender="$5"
    local author_email_school="$6"
    local author_email_outlook="$7"
    local server_url="$8"

    local salutation
    case "$author_gender" in
        Male) salutation="Sehr geehrter Herr" ;;
        Female) salutation="Sehr geehrte Frau" ;;
        *) salutation="Sehr geehrte*r" ;;
    esac

    local message
    message=$(cat <<EOF
$salutation $author_last_name

Die Generierung der E-Mail-Adressen wurde soeben abgeschlossen. Insgesamt wurden $amount_of_new_mails neue Adressen erstellt.
Im Anhang finden Sie alle Briefe, sowie eine Tabelle mit allen generierten Adressen.

Bei Fragen können Sie mich gerne unter $author_email_school kontaktieren.

Freundliche Grüsse

$author_first_name $author_last_name
EOF
    )

    # Konvertiere die Nachricht in UTF-8.
    local message_utf8=$(echo "$message" | iconv -t UTF-8)
    local mail_data

    # Erstelle die JSON-Daten für die E-Mail.
    mail_data=$(jq -n --arg from "$author_email_school" \
                      --arg to "$author_email_outlook" \
                      --arg subject "Neue TBZ-E-Mail-Adressen: $amount_of_new_mails" \
                      --arg message "$message_utf8" \
                      '{from: $from, to: $to, subject: $subject, message: $message}')

    # Zeige die JSON-Daten an.
    echo "Sending mail with the following payload:"
    echo "$mail_data" | jq .

    # Sende die E-Mail mit dem Anhang über den angegebenen Server.
    curl -X POST -F "mail_data=$mail_data" \
         -F "attachment=@$archive_file_name" \
         "$server_url"
}

# Funktion zur Verarbeitung der CSV-Daten und Generierung von E-Mails und Passwörtern.
process_entries() {
    local import_data=("$@")
    local export_data=()
    local password
    local email

    for entry in "${import_data[@]}"; do

        # Lese die Daten aus dem CSV-Format.
        IFS="|" read -r _ first_name last_name gender street street_number zip_code city <<< "$entry"

        # Erstelle eine E-Mail-Adresse.
        email=$(create_email "$first_name" "$last_name")

        # Erstelle ein Passwort.
        password=$(create_password "$PASSWORD_PIECE_LENGTH" "$PASSWORD_PIECES_AMOUNT")

        # Erstelle einen Brief mit den Benutzerdaten.
        create_letter "$(date +'%d-%m-%Y')" "$first_name" "$last_name" "$gender" "$street" "$street_number" "$zip_code" "$city" "$email" "$password" "$AUTHOR_FIRST_NAME" "$AUTHOR_LAST_NAME"
        
        # Füge die E-Mail-Adresse und das Passwort dem Export-Daten-Array hinzu.
        export_data+=("$email|$password")
    done

    # Gebe die Export-Daten zurück.
    printf "%s\n" "${export_data[@]}"
}

# Hauptfunktion, die den gesamten Prozess orchestriert.
main() {

    # Lade die CSV-Datei herunter und speichere den Pfad.
    local import_location
    import_location=$(get_csv)

    # Definiere den Pfad für die Export-Datei.
    local export_location
    export_location="$EXPORT_DIR/$(date +'%Y-%m-%d_%H-%M').csv"

    # Definiere den Namen für die ZIP-Datei.
    local archive_file_name
    archive_file_name="$(date +'%Y-%m-%d')_newMailadr_${AUTHOR_LAST_NAME,,}.zip"

    # Lese die CSV-Daten ein und speichere sie in einem Array.
    mapfile -t import_data < <(get_data "$import_location")

    # Verarbeite die CSV-Daten und speichere die Ergebnisse in einem Array.
    mapfile -t export_data < <(process_entries "${import_data[@]}")

    # Speichere die Export-Daten in einer CSV-Datei.
    set_data "$export_location" "${export_data[@]}"

    # Erstelle eine ZIP-Datei mit den Export- und Briefdateien.
    create_zip_file "$archive_file_name" "$EXPORT_DIR" "$LETTERS_DIR"

    # Sende die E-Mail mit der ZIP-Datei als Anhang.
    send_mail "$archive_file_name" "${#import_data[@]}" "$AUTHOR_FIRST_NAME" "$AUTHOR_LAST_NAME" "$AUTHOR_GENDER" "$AUTHOR_EMAIL_SCHOOL" "$AUTHOR_EMAIL_OUTLOOK" "$SERVER_URL"
}

# Aufruf der Hauptfunktion.
main
