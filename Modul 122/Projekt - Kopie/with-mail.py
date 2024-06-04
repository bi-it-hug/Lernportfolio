""""
def send_mail(sender_email, sender_password, receiver_email, mail_subject, mail_body, mail_attachment):
    
    msg = EmailMessage()
    msg.set_content(mail_body)
    msg['Subject'] = mail_subject
    msg['From'] = sender_email
    msg['To'] = receiver_email

    mime_type, _ = mimetypes.guess_type(mail_attachment)
    if mime_type is None:
        mime_type = 'application/octet-stream'
    
    main_type, sub_type = mime_type.split('/', 1)
    
    with open(mail_attachment, 'rb') as file:
        msg.add_attachment(file.read(), maintype=main_type, subtype=sub_type, filename=mail_attachment)
        
    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
        
        print(f'Email with attachment sent to {receiver_email}')
        
    except Exception as error:
        print(f'Failed to send mail: {error}')
"""""
