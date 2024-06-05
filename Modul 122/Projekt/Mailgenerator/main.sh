#!/bin/bash

import_location="import/mock_data.csv"
export_location="export/$(date +'%Y-%m-%d_%H-%M').csv"
archive_file_name="$(date +'%Y-%m-%d')_newMailadr_hug.zip"
server_url="https://mailgenerator.bm-it.ch/mail.php"

author_first_name="Lorenzo"
author_last_name="Hug"
author_mails_outlook="sibby.hug@outlook.com"
author_mails_school="lorenzo.hug@bsfh-lernende.ch"

declare -A uncommon_chars=(
    ["Á"]="A" ["Ä"]="Ae" ["Å"]="A" ["Ç"]="C" ["É"]="E" ["Ö"]="Oe"
    ["à"]="a" ["á"]="a" ["â"]="a" ["ã"]="a" ["ä"]="ae" ["å"]="a"
    ["ç"]="c" ["è"]="e" ["é"]="e" ["ê"]="e" ["ë"]="e" ["ì"]="i"
    ["í"]="i" ["î"]="i" ["ï"]="i" ["ñ"]="n" ["ò"]="o" ["ó"]="o"
    ["ô"]="o" ["õ"]="o" ["ö"]="oe" ["ø"]="o" ["ù"]="u" ["ú"]="u"
    ["ü"]="ue" ["ý"]="y" ["ā"]="a" ["ć"]="c" ["č"]="c" ["Đ"]="D"
    ["ē"]="e" ["ę"]="e" ["ě"]="e" ["ī"]="i" ["ł"]="l" ["ń"]="n"
    ["Ō"]="O" ["ō"]="o" ["ř"]="r" ["Ś"]="S" ["ś"]="s" ["Ş"]="S"
    ["ş"]="s" ["š"]="s" ["ũ"]="u" ["ū"]="u" ["ŭ"]="u" ["ż"]="z"
    ["ž"]="z" ["̀"]="'" ["К"]="K" ["М"]="M" ["Р"]="P" ["а"]="a"
    ["в"]="v" ["д"]="d" ["и"]="i" ["л"]="l" ["н"]="n" ["о"]="o"
    ["р"]="r" ["т"]="t" ["ш"]="sh" ["ḏ"]="d" ["ḑ"]="d" ["Ḩ"]="H"
    ["ằ"]="a" ["ố"]="o" ["ộ"]="o" ["ớ"]="o" ["ợ"]="o" ["ủ"]="u"
    ["ừ"]="u" ["ữ"]="u" ["‘"]="'" ["’"]="'" [" "]=""
)

get_data() {
    local import_location=$1
    local data=()
    
    while IFS=',' read -r id first_name last_name gender street street_number zip_code city; do
        data+=("$id,$first_name,$last_name,$gender,$street,$street_number,$zip_code,$city")
    done < <(tail -n +2 "$import_location")

    echo "${data[@]}"
}

set_data() {
    local export_location=$1
    shift
    local data=("$@")
    local fields=("email" "password")

    {
        IFS="|"; echo "${fields[*]}"
        for entry in "${data[@]}"; do
            IFS="|"; echo "$entry"
        done
    } > "$export_location"
}

append_data_for_export() {
    local -n export_data=$1
    local email=$2
    local password=$3
    export_data+=("$email|$password")
}

create_password() {
    local length=$1
    local pieces=$2
    local allowed_characters='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$%&@'
    local password=()

    for ((i = 0; i < pieces; i++)); do
        password+=($(head /dev/urandom | tr -dc "$allowed_characters" | head -c "$length"))
    done

    IFS="-"; echo "${password[*]}"
}

replace_uncommon_chars() {
    local x_name=$1
    local new_name=""

    for ((i = 0; i < ${#x_name}; i++)); do
        char="${x_name:i:1}"
        new_name+="${uncommon_chars[$char]:-$char}"
    done

    echo "$new_name" | tr -d "'"
}

create_email() {
    local first_name=$(replace_uncommon_chars "$1")
    local last_name=$(replace_uncommon_chars "$2")
    echo "${first_name,,}.${last_name,,}@edu.tbz.ch"
}

create_letter() {
    local date=$1
    local first_name=$2
    local last_name=$3
    local gender=$4
    local street=$5
    local street_number=$6
    local zip_code=$7
    local city=$8
    local email=$9
    local password=${10}
    local author_first_name=${11}
    local author_last_name=${12}
    local salutation="Liebe/r"

    if [ "$gender" == "Male" ]; then
        salutation="Lieber"
    elif [ "$gender" == "Female" ]; then
        salutation="Liebe"
    fi

    local message="Technische Berufsschule Zürich
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

Emailadresse:   $email
Passwort:       $password


Mit freundlichen Grüssen

$author_first_name $author_last_name
(TBZ-IT-Service)


admin.it@tbz.ch, Abt. IT: +41 44 446 96 60
"

    echo "$message" > "letters/${email}.brf"
}

process_entries() {
    local import_data=("$@")
    local export_data=()

    for entry in "${import_data[@]}"; do
        IFS=',' read -r id first_name last_name gender street street_number zip_code city <<< "$entry"
        email=$(create_email "$first_name" "$last_name")
        password=$(create_password 6 3)
        
        create_letter "$(date +'%d-%m-%Y')" "$first_name" "$last_name" "$gender" "$street" "$street_number" "$zip_code" "$city" "$email" "$password" "$author_first_name" "$author_last_name"
        append_data_for_export export_data "$email" "$password"
    done

    echo "${export_data[@]}"
}

create_zip_file() {
    local zip_name=$1
    shift
    local folders=("$@")
    
    zip -r "$zip_name" "${folders[@]}"
}

send_mail() {
    local archive_file_name=$1
    local amount_of_new_mails=$2

    curl -X POST "$server_url" \
         -F "to=$author_mails_school" \
         -F "subject=Neue TBZ-Mailadressen $amount_of_new_mails" \
         -F "message=Lieber Lorenzo\n\nDie Emailadressen-Generierung ist beendet. Es wurden $amount_of_new_mails erzeugt.\n\nBei Fragen kontaktiere bitte sibby.hug@outlook.com\n\nGruss $author_first_name $author_last_name" \
         -F "from=$author_mails_outlook" \
         -F "attachment=@$archive_file_name"
}

main() {
    curl https://haraldmueller.ch/schueler/m122_projektunterlagen/b/MOCK_DATA.csv -o "import/$import_location"
    import_data=($(get_data "$import_location"))
    export_data=($(process_entries "${import_data[@]}"))
    
    set_data "$export_location" "${export_data[@]}"
    create_zip_file "$archive_file_name" "export" "letters"
    send_mail "$archive_file_name" "${#import_data[@]}"
}

main
