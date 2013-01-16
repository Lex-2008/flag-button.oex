rem check for /v:on switch, if not present --- restart
if not "%path%"=="!path!" (
    cmd /v:on /c %0
    goto :eof
)

echo off

set err=
for %%q in (*.tags) do (
    fc en.tags %%q
    if not "!errorlevel!"=="0" set err=!err! %%q
    )
if not "%err%"=="" (
    echo fail:%err%
    pause
    )
