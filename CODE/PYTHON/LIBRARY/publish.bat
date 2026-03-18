@echo off
setlocal

rem Resolve this script's directory
set SCRIPT_DIR=%~dp0
pushd "%SCRIPT_DIR%"

rem Ensure build and upload tooling is available
python -m pip install --upgrade build twine

rem Build source and wheel distributions into dist/
python -m build

rem Upload everything in dist/ to PyPI (or configured repository)
python -m twine upload dist/*

popd
endlocal

