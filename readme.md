# installation instruction
- clone this repo by entering `git clone https://github.com/fardeen-panjwani/poc.git` in the command line
- `cd` into the directory
- install the required packages by entering `npm install` in the command line
- to build app for Android, use `expo build:android`
- to build app for iOS, use `expo build:ios`

# Database Structure:
```
  -doctors
    -name (string)
    -speciality (string)
  
  -message
    -value (string)
    
  -specialities
    -value (string)
```

# Script to load data
to load data into the database(specialities, message...), use adminScripts' individual Python scripts.