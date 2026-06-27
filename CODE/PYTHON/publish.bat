set SCRIPT_DIR=%~dp0
pushd "%SCRIPT_DIR%"
call build.bat
if errorlevel 1 (
    popd
    exit /b 1
)
python -m pip install --upgrade twine
for %%f in ("lib\dist\senselogic_gson-*.whl" "lib\dist\senselogic_gson-*.tar.gz") do (
    python -m twine upload "%%f"
)
popd
