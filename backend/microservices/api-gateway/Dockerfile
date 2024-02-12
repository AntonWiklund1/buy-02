FROM openjdk:17-slim AS build

WORKDIR /tmp1/tmp2/app

COPY ./backend/pom.xml ../../pom.xml

COPY ./backend/microservices/api-gateway/ .

RUN apt-get update -y && apt-get upgrade -y && apt-get install -y maven

RUN mvn clean install

FROM openjdk:17-slim

WORKDIR /app

COPY --from=build /tmp1/tmp2/app/target/api-gateway-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]