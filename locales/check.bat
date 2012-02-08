for /d %%q in (*) do (
    del %%q.tags
    for %%w in (%%q\*.html) do (
	echo ==========%%~nxw========== >>%%q.tags
	rem clear lines without tags; clear text before first tag; clear text after last tag; clear test between tags; number lines | join numbers and lines together
	\0-save\1-soft\sed\csed.exe -e "/>/!s/.*//" -e "s/^[^<]*</</" -e "s/>[^<]*$/>/" -e "s/>[^<]*</></g" -e = %%w | \0-save\1-soft\sed\csed.exe "N;s/\n/:\t/" >>%%q.tags
	)
    )
