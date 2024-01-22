FROM openjdk:17-slim as build

# Set a working directory for the application
WORKDIR /tmp1/tmp2/app

COPY ./backend/pom.xml ../../pom.xml

COPY ./backend/microservices/media-ms/ .

RUN apt-get update -y && apt-get upgrade -y && apt-get install -y maven

# Copy the pom.xml file into the container
# COPY ./user-ms/pom.xml .

RUN export MAVEN_OPTS="-Xmx6g"

RUN mvn clean install

FROM openjdk:17-slim

# Set a working directory for the application
WORKDIR /app

# Copy the JAR file into the container and rename it to app.jar
COPY --from=build /tmp1/tmp2/app/target/media.ms-0.0.1-SNAPSHOT.jar app.jar

# Copy the JAR file into the container and rename it to app.jar
# COPY target/user.ms-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the app runs on
EXPOSE 8083

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]