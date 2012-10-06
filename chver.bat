echo off
rem ver should set "n", "v", "tagsep", "tag".
call ver.bat

rem get data from user
echo.
echo tag: %n%-%v%%tag%
echo %1. Use space for empty, hit enter to leave as is
set /p tag=tag: %n%-%v%%tagsep%
if "%tag%"==" " (
    rem space = delete tag
    set tag=
) else (
    rem prepend tagsep if it not starts yet
    if not "%tag:~0,1%"=="%tagsep%" set tag=%tagsep%%tag%
)

rem save data to file
echo.>ver.bat
echo set n=%n%>>ver.bat
echo set v=%v%>>ver.bat
echo set tagsep=%tagsep%>>ver.bat
echo set tag=%tag%>>ver.bat

rem update config.xml
set ver=%v%%tag%
csed "2s/version=""".*"""/version="""%ver%"""/;s/Copyright [0-9]\{4\}/Copyright %date:~6,4%/" config.xml.bak >config.xml
