# Étape 1 : Build de l'application avec Maven
FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Étape 2 : Exécution de l'application (Utilisation de Temurin au lieu d'OpenJDK)
FROM eclipse-temurin:17-jdk-focal
WORKDIR /app
# On s'assure de copier le bon fichier jar
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]