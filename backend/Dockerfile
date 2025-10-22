# ----------- BUILD STAGE -----------
FROM maven:3.9.5-eclipse-temurin-17 AS build
WORKDIR /app

# Copia apenas o pom.xml primeiro (melhora cache)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copia o código e empacota
COPY src ./src
RUN mvn clean package -DskipTests

# ----------- RUN STAGE -----------
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

# Configura timezone
ENV TZ=America/Sao_Paulo

# Copia o artefato do estágio anterior
COPY --from=build /app/target/*.jar app.jar

# Exposição de porta
EXPOSE 8080

# Comando de execução
ENTRYPOINT ["java","-jar","app.jar"]
