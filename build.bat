if "%1"=="" (
    call %0 %cd%
    goto :eof
    )
move config.xml config.xml.bak
@call chver.bat "Enter CURRENT tag (will be zipped to oex)"
rem ver should set "n", "v", "tagsep", "tag".
call ver.bat

set ver=%v%%tag%
set name=%n%-%ver%
del %name%.oex
zip -R %name%.oex * -x@exclude.txt

@call chver.bat "Enter NEXT tag (will be in your local version)"
