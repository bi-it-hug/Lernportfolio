<?php
$ihrname = "Lorenzo Hug";
$imgSrc = "https://unsplash.com/photos/closeup-photography-of-brown-and-gray-concrete-bricks-cnEzFsV4Y-k";
$imgUrl = "https://lorenzobuckettest.s3.us-east-1.amazonaws.com/annie-spratt-cnEzFsV4Y-k-unsplash.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAX7CUGNT5N3Z3GAIZ%2F20241219%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241219T132734Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEK7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQDIVPCC0%2Fo%2FvjCrQjfGm%2BpVtzhTxfsyQHbYDuBvWtDr3AIhAKmBeZUXDnWujN%2FXvSX6DEWTJf%2BRwCl6gMB4d2gykiZ7KucCCHYQABoMNTQ3Nzg0OTEyMTIyIgxfbsr%2BIiT8Xr5w8z0qxAJ2xr7MDjC5PfULy522stbo6kZisobuOCrqZ%2Bpl6ZKXaVtyfXQ3cQoS9OrNbRg%2FYVBjaVBb7In0VN5BaE%2BLBExd3OiLH00Og2O83pOwa3PJbRb%2BEmzbXSqG5zV8gJCevPpHA0ZMZU0h%2BadubmoAxcSBkbbs6QBVSsEkpyjNR5DEsAHcXZCZ0hq6yA9HUbIOQ1fHzfdIt22eyHT25XyJm5XESs3wXZR6qK1gqFLbPJdwz4Lm9KpWLan6%2Biuw%2Fex%2FISClpgIGDYjobPl%2BFFcte8mHgg2CZZLUC2%2BLZOKweMHhcCJfZXr%2F%2BSaMQPcr6FE1EaAeb9xJa3%2FXKGPXMNrh6YH17kRPPnnV2Emv8Z3hMhaLjSwkVHrnS1NytxfKe2SQJ633%2F70u3vK0IfTq93C5%2FN5x0vrb%2FPpGq61qs2Na10pDFLUW%2B0ow4LSQuwY6hgKhSR38yFnP5jXp1Rcca0eXJd%2BCzmhZVM%2FU%2FmjDwq%2B%2Ff4YZE3Y0ns9uCvKd15fYbWoWh4VL6vADTTu2Tz6eztU61j%2Bh4P6vP%2FkgHI79NhVIxC8c6wXALm7xzS%2BjD6zy3wnn8MEulICyvT6G8tCCeO5cfJwQLg8el0P%2BZMcZ0VPRJuH8ceutFi13mtroR5OB82dCalTer72uUhlgrA5y5ExNTGQJ%2F4VngV27V7nEzPlXg06XY6yxZxOpegTjq41SziW4VZPLm5coIXqh7DcwpK0v5xY54BXD2m715VQcEWCkgB8XUPnv0b8kG4T4wFCSQt9Ux7NoQtpYEWNVOj3BypxAM%2FaXSO3Z&X-Amz-Signature=a6c11a2c5cf494991784e2072352ef773217b8db37671d7f3abe7775a0e049c9&X-Amz-SignedHeaders=host&response-content-disposition=inline";
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $ihrname; ?></title>
</head>

<body>
    <h1>Ziegelwand</h1>
    <br />
    <img src="<?php echo $imgUrl; ?>" alt="Bild" style="max-width: 100%; height: auto;" />
    <p>Quelle: <?php echo $imgSrc; ?></p>
</body>

</html>