@REM ----------------------------------------------------------------------------
@REM Maven Wrapper for Food Delivery Application
@REM ----------------------------------------------------------------------------

@echo off
@setlocal

@REM Convert the script directory to short (8.3) path to avoid spaces issue
for %%I in ("%~dp0.") do set "MAVEN_PROJECTBASEDIR=%%~sI\"

set "WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar"

@REM Find java.exe
set JAVA_EXE=java.exe
%JAVA_EXE% -version >NUL 2>&1
if "%ERRORLEVEL%" == "0" goto javaOk

echo Error: JAVA_HOME is not set and no 'java' command could be found in your PATH.
goto error

:javaOk
if not "%JAVA_HOME%"=="" (
    set "JAVA_EXE=%JAVA_HOME%\bin\java.exe"
)

if exist "%WRAPPER_JAR%" (
    echo Found "%WRAPPER_JAR%"
) else (
    echo Downloading Maven wrapper...
    powershell -Command "Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar' -OutFile '%WRAPPER_JAR%'"
)

"%JAVA_EXE%" "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" -cp "%WRAPPER_JAR%" org.apache.maven.wrapper.MavenWrapperMain %*
if ERRORLEVEL 1 goto error
goto end

:error
set ERROR_CODE=1

:end
@endlocal & set ERROR_CODE=%ERROR_CODE%
cmd /C exit /B %ERROR_CODE%
