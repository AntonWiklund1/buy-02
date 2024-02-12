FROM openjdk:17-slim as build

WORKDIR /tmp1/tmp2/app

COPY ./backend/pom.xml ../../pom.xml

COPY ./backend/microservices/order-ms/ .

RUN apt-get update -y && apt-get upgrade -y && apt-get install -y maven

RUN mvn clean install

FROM openjdk:17-slim

WORKDIR /app

COPY --from=build /tmp1/tmp2/app/target/order-ms-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8084

ENTRYPOINT ["java", "-jar", "app.jar"]