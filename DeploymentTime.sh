#!/bin/bash

# Start time
Deployment_start_time=$(date +%s)

# Install dependencies

Server_start_time=$(date +%s)
npm install
Server_end_time=$(date +%s)
Server_duration=$((Server_end_time - Server_start_time))

Client_start_time=$(date +%s)
cd client
npm install
Client_end_time=$(date +%s)
Client_duration=$((Client_end_time - Client_start_time))

# Building

ServerBuild_start_time=$(date +%s)
npm run build
ServerBuild_end_time=$(date +%s)
ServerBuild_duration=$((ServerBuild_end_time - ServerBuild_start_time))

ClientBuild_start_time=$(date +%s)
cd client
npm run build
ClientBuild_end_time=$(date +%s)
ClientBuild_duration=$((ClientBuild_end_time - ClientBuild_start_time))

# Deployment End time
Deployment_end_time=$(date +%s)
Deployment_duration=$((Deployment_end_time - Deployment_start_time))

# Print the installation times
echo "Server Installation Deployment Time: $Server_duration Seconds"
echo "Client Installation Deployment Time: $Client_duration Seconds"
echo "Server Build Deployment Time: $ServerBuild_duration seconds"
echo "Client Build Deployment Time: $ClientBuild_duration Seconds"
echo "Total Deployment Time: $Deployment_duration Seconds"
