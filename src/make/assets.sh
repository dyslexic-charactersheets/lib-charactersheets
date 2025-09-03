#!/bin/bash
# Copyright 2025 Marcus Downing
# Licensed under the Artistic License 2.0

cd "$(dirname "$0")"
cd ../assets

dofile() {
    file="$1"
    if [[ "$file" =~ \.base64$ ]]; then
        dest="../../lib/assets/$file"
        mkdir -p "$(dirname "$dest")"
        cp "$file" "$dest"
        return
    fi
    if [[ "$file" =~ \.svg$ ]]; then
        dest="../../lib/assets/$file"
        mkdir -p "$(dirname "$dest")"
        cp "$file" "$dest"
        return
    fi

    dest="../../lib/assets/$file.base64"
    mkdir -p "$(dirname "$dest")"
    base64 "$file" > "$dest"
}

export -f dofile
find . -type f -exec bash -c 'dofile "{}"' \;
