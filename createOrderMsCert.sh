#!/bin/bash

# Define the directory where the certificates will be placed
CERT_DIR="./backend/microservices/order-ms/src/main/resources"

# Create the directory if it doesn't exist
mkdir -p $CERT_DIR

# Define certificate details
CERT_NAME="localhost"
CERT_FILE="$CERT_DIR/$CERT_NAME.pem"
KEY_FILE="$CERT_DIR/$CERT_NAME-key.pem"
PKCS12_FILE="$CERT_DIR/$CERT_NAME.p12"
PASSWORD="yourpassword" # Change this password

# Generate a certificate and key with mkcert
mkcert -key-file $KEY_FILE -cert-file $CERT_FILE $CERT_NAME

# Convert PEM to PKCS12 format
openssl pkcs12 -export -out $PKCS12_FILE -inkey $KEY_FILE -in $CERT_FILE -name "localhost" -password pass:$PASSWORD

echo "SSL certificate generated in $CERT_DIR"