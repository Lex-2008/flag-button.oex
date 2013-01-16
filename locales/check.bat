for /d %%q in (*) do (
    del %%q.tags
    for %%w in (%%q\*.html) do (
	echo ==========%%~nxw========== >>%%q.tags
	rem clear lines without tags; clear text before first tag; clear text after last tag; clear text between tags; number lines | join numbers and lines together
	..\csed.exe -e "/>/!s/.*//" -e "s/^[^<]*</</" -e "s/>[^<]*$/>/" -e "s/>[^<]*</></g" -e = %%w | ..\csed.exe "N;s/\n/:\t/" >>%%q.tags
	REM ~ ..\csed.exe -e "/>/s/.*//" -e = %%w | ..\csed.exe "N;s/\n/:\t/" >>%%q.tags
	)
    echo ==========lang.js========== >>%%q.tags
    rem delete all lines not starting as expected; leave only names in lines (use previous match for s//)
    ..\csed.exe -e "/^    \([a-zA-Z]\+\)\:.*/!d" -e "s//\1/" %%q\lang.js >>%%q.tags
    )

cmd /v:on /c cmp.bat
