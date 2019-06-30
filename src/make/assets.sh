#!/bin/bash
cd "$(dirname "$0")"
cd ../assets

dofile() {
    file="$1"
    if [[ "$file" =~ \.base64$ ]]; then
        return
    fi

    dest="../../lib/assets/$file.base64"
    mkdir -p "$(dirname "$dest")"
    base64 "$file" > "$dest"
}

export -f dofile
find . -type f -exec bash -c 'dofile "{}"' \;