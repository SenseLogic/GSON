set SCRIPT_DIR=%~dp0
for %%f in ("..\LIBRARY\dist\senselogic_gson-*.whl") do (
    python -m pip install --upgrade --force-reinstall "%%f"
)
mkdir OUT
python test.py
