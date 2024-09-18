#!/bin/bash

# Define the volume name
VOLUME_NAME="mongo-data"

# Check if the named volume already exists
if [ $(docker volume inspect -f '{{ .Name }}' $VOLUME_NAME) == "" ]; then
  echo "Creating named volume '$VOLUME_NAME'..."
  docker volume create $VOLUME_NAME
fi

# Start the services with Docker Compose (assuming your docker-compose file defines the 'mongo' service)
docker-compose up -d

# Check if the 'mongo' container is already running
if [ $(docker ps --filter name=mongo --filter status=running -q | wc -l) -eq 0 ]; then
    echo "Starting 'mongo' container using docker run..."
    
    # Run the container with the specified options
    docker run --rm -d -p 27017:27017 -h $(hostname) --name mongo \
      -v $VOLUME_NAME:/data/db mongo:7.0 --replSet=rs0
    
    # Sleep for 5 seconds to wait for MongoDB to be up and running
    sleep 5
    
    # Initiate the replica set
    docker exec mongo mongosh --quiet --eval "rs.initiate();"
else
    echo "'mongo' container is already running."
fi