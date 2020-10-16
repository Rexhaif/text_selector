#!/usr/bin/env sh

git clean -fdx
nvm use
python3 -m pip install -e .
jupyter nbextension install --py --symlink --sys-prefix text_selector
jupyter nbextension enable --py --sys-prefix text_selector
jupyter labextension install js
