FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean install

FROM openjdk:17
WORKDIR /app
COPY --from=build /app/target/employee-management-1.0.jar /app/employee-management.jar
ENTRYPOINT ["java", "-jar", "employee-management.jar"]
