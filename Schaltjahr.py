year = int(input("Jahr: "))

if year % 4 == 0:
    isLeapYear = True
    
    if year % 100 == 0:
        isLeapYear = False
        
        if year % 400 == 0:
            isLeapYear = True
            
        else:
            isLeapYear = False
        
    else:
        isLeapYear = True

else:
    isLeapYear = False
    
if isLeapYear:
    print(f"{year} ist ein Schaltjahr")
    
else:
    print(f"{year} ist kein Schaltjahr")