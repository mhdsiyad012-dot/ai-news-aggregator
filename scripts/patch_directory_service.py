import re

path = 'web/src/lib/directoryService.ts'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

pattern = r'// Direct fallback to AI_DIRECTORY_DATA[\s\S]*?return staticMatch \|\| null;'
replacement = 'return null;'
text = re.sub(pattern, replacement, text)

# Put import at top
if 'import { AI_DIRECTORY_DATA }' not in text:
    text = 'import { AI_DIRECTORY_DATA } from "@/data/aiDirectoryData";\n' + text

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)
print("Finished patching directoryService.ts")
