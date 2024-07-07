FROM openjdk:21-jdk-slim

RUN apt-get update && apt-get install -y maven

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean install

EXPOSE 8080

CMD ["java", "-jar", "target/employee-management.jar"]