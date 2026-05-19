cd lib
set SCRIPT_DIR=%~dp0
echo %SCRIPT_DIR%
python -m pip install --upgrade build twine
python -m build
python -m twine upload dist/*
cd ..
