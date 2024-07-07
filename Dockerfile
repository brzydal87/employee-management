FROM openjdk:21-jdk-slim

WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

COPY src ./src

RUN chmod +x mvnw

RUN mvn clean package

EXPOSE 8080

CMD ["java", "-jar", "target/employee-management.jar"]
