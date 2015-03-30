mongo localhost:3001/meteor --eval "
db.users.remove({ 'profile.firstName': 'CasperJS' });
db.users.remove({ 'emails.0.address': 'casperAdmin@gmail.com' });
"