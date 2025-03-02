# postgresql provide a default user to work with "postgres"

# the path /var/lib/postgresql/14/data is the path for the data for the database
# is going to be the same as the volume path
#
network_addr=$(ip r | grep `hostname -i` | cut -d' ' -f1)
line=$(echo -e -n "host\t$DB_NAME\t\t$DB_USER\t\t$network_addr\t\tpassword")


su postgres -c "pg_ctl start -D /var/lib/postgresql/14/data -s" 1>/dev/null

psql -q -U postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null
psql -q -U postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null
psql -q -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" 2>/dev/null

# manulally stop Postgrsql server

su postgres -c "pg_ctl stop -D /var/lib/postgresql/14/data -s" 1>/dev/null


# check if this listen for all incomming coonection for that client is not added the add it
# enable this container to get connection from other client
check=$(cat /var/lib/postgresql/14/data/pg_hba.conf | grep "$line")
 if [ -z "$check" ]; then
	echo "$line" >> /var/lib/postgresql/14/data/pg_hba.conf
fi

exec su postgres -c "postgres -D /var/lib/postgresql/14/data -c listen_addresses='0.0.0.0';"

# postgresql config all good
