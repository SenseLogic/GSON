set SCRIPT_DIR=%~dp0
echo %SCRIPT_DIR%
pushd "%~dp0lib"
python -m pip install --upgrade build
python -m build
popd
