# Etapa de build
FROM openjdk:21-jdk-slim AS build

WORKDIR /app

# Copia arquivos do projeto
COPY gradlew gradlew.bat build.gradle settings.gradle /app/
COPY gradle /app/gradle
COPY src /app/src

# Dá permissão ao gradlew e roda build
RUN chmod +x ./gradlew
RUN ./gradlew build --no-daemon

# Etapa final: imagem menor com JDK
FROM openjdk:21-jdk-slim
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
