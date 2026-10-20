
import os
import re

# Regex for emojis (broad)
emoji_regex = re.compile(r'[\U00010000-\U0010ffff]', flags=re.UNICODE)

def find_emojis(root_dir):
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.css')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        if emoji_regex.search(content):
                            print(f"Emoji found in {file_path}")
                            # Print a snippet
                            match = emoji_regex.search(content)
                            start = max(0, match.start() - 20)
                            end = min(len(content), match.end() + 20)
                            print(f"Snippet: {content[start:end]}")
                except Exception as e:
                    print(f"Error reading {file_path}: {e}")

find_emojis('/src')
