FROM openjdk:17-slim as build

WORKDIR /tmp1/tmp2/app

COPY ./backend/pom.xml ../../pom.xml

COPY ./backend/microservices/order-ms/ .

COPY ./backend/microservices/api-gateway/src/main/resources/localhost.pem /etc/ssl/certs/
COPY ./backend/microservices/api-gateway/src/main/resources/localhost.p12 /etc/ssl/certs/
COPY ./backend/microservices/api-gateway/src/main/resources/localhost-key.pem /etc/ssl/private/

COPY ./backend/microservices/api-gateway/src/main/resources/localhost-key.pem ./src/main/resources/localhost-key.pem
COPY ./backend/microservices/api-gateway/src/main/resources/localhost.pem ./src/main/resources/localhost.pem
COPY ./backend/microservices/api-gateway/src/main/resources/localhost.p12 ./src/main/resources/localhost.p12

RUN apt-get update -y && apt-get upgrade -y && apt-get install -y maven

RUN mvn clean install

FROM openjdk:17-slim

WORKDIR /app

COPY --from=build /tmp1/tmp2/app/target/order-ms-0.0.1-SNAPSHOT.jar app.jar

# copy the keystore and truststore to the container
COPY --from=build /etc/ssl/certs/localhost.pem /etc/ssl/certs/localhost.pem
COPY --from=build /etc/ssl/certs/localhost.p12 /etc/ssl/certs/localhost.p12
COPY --from=build /etc/ssl/private/localhost-key.pem /etc/ssl/private/localhost-key.pem

EXPOSE 8084

ENTRYPOINT ["java", "-jar", "app.jar"]