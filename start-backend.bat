@echo off
echo ============================================
echo    SCRIPT DE INICIALIZACAO DO BACKEND
echo ============================================

cd /d "C:\Users\pedro\Downloads\BackendUEG2025-02\BackendUEG202502"

echo.
echo [1/4] Limpando cache do Maven...
if exist "%USERPROFILE%\.m2\repository\org\springframework\boot" (
    rmdir /s /q "%USERPROFILE%\.m2\repository\org\springframework\boot"
)

echo.
echo [2/4] Limpando projeto...
if exist target rmdir /s /q target

echo.
echo [3/4] Compilando projeto...
call mvnw.cmd clean compile -DskipTests

echo.
echo [4/4] Iniciando Spring Boot...
call mvnw.cmd spring-boot:run

pause