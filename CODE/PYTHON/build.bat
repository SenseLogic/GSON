cd lib
set SCRIPT_DIR=%~dp0
echo %SCRIPT_DIR%
python -m pip install --upgrade build
python -m build
cd ..
