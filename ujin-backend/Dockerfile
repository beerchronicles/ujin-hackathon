FROM eclipse-temurin:25-jre-alpine
LABEL authors="fiwka"
WORKDIR /app
COPY build/libs/ujin-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]