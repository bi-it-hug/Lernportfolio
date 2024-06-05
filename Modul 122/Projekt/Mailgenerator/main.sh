#!/bin/bash

set -e
set -o pipefail

URL="https://haraldmueller.ch/schueler/m122_projektunterlagen/b/MOCK_DATA.csv"
IMPORT_DIR="import"
EXPORT_DIR="export"
LETTERS_DIR="letters"
AUTHOR_FIRST_NAME="Lorenzo"
AUTHOR_LAST_NAME="Hug"
AUTHOR_GENDER="Male"
AUTHOR_EMAIL_OUTLOOK="sibby.hug@outlook.com"
AUTHOR_EMAIL_SCHOOL="lorenzo.hug@bsfh-lernende.ch"
AUTHOR_EMAIL_WORK="lorenzo.hug@espas.ch"
SERVER_URL="https://mailgenerator.bm-it.ch/mail_bash.php"
PASSWORD_PIECE_LENGTH=6
PASSWORD_PIECES_AMOUNT=3
DELIMITER="|"
QUOTECHAR='"'

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

get_csv() {
    local file_path="$IMPORT_DIR/mock_data.csv"
    mkdir -p "$IMPORT_DIR"
    curl -o "$file_path" "$URL"
    printf "%s" "$file_path"
}

get_data() {
    local import_location="$1"
    local data=()
    while IFS=, read -r id first_name last_name gender street street_number zip_code city; do
        data+=("$id|$first_name|$last_name|$gender|$street|$street_number|$zip_code|$city")
    done < <(tail -n +2 "$import_location")
    printf "%s\n" "${data[@]}"
}

set_data() {
    local export_location="$1"
    shift
    local data=("$@")
    local fields=("email" "password")
    mkdir -p "$(dirname "$export_location")"
    {
        printf "%s%s%s\n" "$QUOTECHAR${fields[0]}$QUOTECHAR" "$DELIMITER" "$QUOTECHAR${fields[1]}$QUOTECHAR"
        for entry in "${data[@]}"; do
            printf "%s%s%s\n" "$QUOTECHAR${entry%%|*}$QUOTECHAR" "$DELIMITER" "$QUOTECHAR${entry##*|}$QUOTECHAR"
        done
    } > "$export_location"
}

create_password() {
    local length="$1"
    local pieces="$2"
    local allowed_characters='A-Za-z0-9#$%&@'
    local passwords=()
    for _ in $(seq 1 "$pieces"); do
        passwords+=("$(LC_ALL=C tr -dc "$allowed_characters" < /dev/urandom | head -c "$length")")
    done
    printf "%s" "$(IFS=-; echo "${passwords[*]}")"
}

replace_uncommon_chars() {
    local name="$1"
    local replaced=""
    local char
    for ((i = 0; i < ${#name}; i++)); do
        char="${name:i:1}"
        replaced+="${UNCOMMON_CHARS[$char]:-$char}"
    done
    replaced="${replaced//\'/}"
    printf "%s" "$replaced"
}

create_email() {
    local first_name last_name
    first_name="$(replace_uncommon_chars "$1")"
    last_name="$(replace_uncommon_chars "$2")"
    printf "%s.%s@edu.tbz.ch" "${first_name,,}" "${last_name,,}"
}

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
    mkdir -p "$LETTERS_DIR"
    printf "%s" "$message" > "$LETTERS_DIR/$email.brf"
}

create_zip_file() {
    local zip_name="$1"
    shift
    local folders=("$@")
    zip -r "$zip_name" "${folders[@]}"
}

send_mail() {
    local archive_file_name="$1"
    local amount_of_new_mails="$2"
    local author_first_name="$3"
    local author_last_name="$4"
    local author_gender="$5"
    local author_email_school="$6"
    local author_email_outlook="$7"
    local server_url="$8"
    local generation_date="$9"

    local salutation
    case "$author_gender" in
        Male) salutation="Sehr geehrter Herr" ;;
        Female) salutation="Sehr geehrte Frau" ;;
        *) salutation="Sehr geehrte*r" ;;
    esac

    local mail_data
    mail_data=$(jq -n --arg from "$author_email_school" \
                      --arg to "$author_email_outlook" \
                      --arg subject "Neue TBZ-E-Mail-Adressen: $amount_of_new_mails" \
                      --arg message "$salutation $author_last_name,\n\ndie Generierung der E-Mail-Adressen wurde um $generation_date abgeschlossen. Insgesamt wurden $amount_of_new_mails neue Adressen erstellt.\nIm Anhang finden Sie alle Briefe, sowie eine Tabelle mit allen generierten Adressen.\n\nBei Fragen können Sie mich gerne unter $author_email_school kontaktieren.\n\nFreundliche Grüsse\n\n$author_first_name $author_last_name" \
                      '{from: $from, to: $to, subject: $subject, message: $message}')

    echo "Sending mail with the following payload:"
    echo "$mail_data" | jq .

    curl -X POST -F "mail_data=$mail_data" \
         -F "attachment=@$archive_file_name" \
         "$server_url"
}

process_entries() {
    local import_data=("$@")
    local export_data=()
    local password
    local email

    for entry in "${import_data[@]}"; do
        IFS="|" read -r _ first_name last_name gender street street_number zip_code city <<< "$entry"
        email=$(create_email "$first_name" "$last_name")
        password=$(create_password "$PASSWORD_PIECE_LENGTH" "$PASSWORD_PIECES_AMOUNT")
        create_letter "$(date +'%d-%m-%Y')" "$first_name" "$last_name" "$gender" "$street" "$street_number" "$zip_code" "$city" "$email" "$password" "$AUTHOR_FIRST_NAME" "$AUTHOR_LAST_NAME"
        export_data+=("$email|$password")
    done

    printf "%s\n" "${export_data[@]}"
}

main() {
    local import_location
    import_location=$(get_csv)
    local export_location
    export_location="$EXPORT_DIR/$(date +'%Y-%m-%d_%H-%M').csv"
    local archive_file_name
    archive_file_name="$(date +'%Y-%m-%d')_newMailadr_${AUTHOR_LAST_NAME,,}.zip"
    local generation_date
    generation_date="$(date +'%H:%M:%S')"

    mapfile -t import_data < <(get_data "$import_location")
    mapfile -t export_data < <(process_entries "${import_data[@]}")

    set_data "$export_location" "${export_data[@]}"
    create_zip_file "$archive_file_name" "$EXPORT_DIR" "$LETTERS_DIR"
    send_mail "$archive_file_name" "${#import_data[@]}" "$AUTHOR_FIRST_NAME" "$AUTHOR_LAST_NAME" "$AUTHOR_GENDER" "$AUTHOR_EMAIL_SCHOOL" "$AUTHOR_EMAIL_OUTLOOK" "$SERVER_URL" "$generation_date"
}

main
