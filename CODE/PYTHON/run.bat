set SCRIPT_DIR=%~dp0
pushd "%SCRIPT_DIR%"
set PYTHONIOENCODING=utf-8
call build.bat
for %%f in ("lib\dist\senselogic_gson-*.whl") do (
    python -m pip install --upgrade --force-reinstall "%%f"
)
mkdir OUT
python test.py
popd
