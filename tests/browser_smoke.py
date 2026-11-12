"""Compatibility entrypoint for legacy CI: test the current UI-first-2 shell.

The frozen v2 shell and its original test remain on the frozen branch.
"""
from ui_first_2_browser import check_browser


if __name__ == "__main__":
    check_browser()
