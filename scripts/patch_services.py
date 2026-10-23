import re

# 1. Update directoryService.ts
with open("web/src/lib/directoryService.ts", "r", encoding="utf-8") as f:
    dir_code = f.read()

dir_code = dir_code.replace(
    'import { supabase } from "./supabase";',
    'import { supabase, supabaseAdmin } from "./supabase";'
)
dir_code = dir_code.replace(
    'if (!supabase) {',
    'const client = supabaseAdmin || supabase;\n  if (!client) {'
)
dir_code = dir_code.replace(
    'if (supabase) {',
    'const client = supabaseAdmin || supabase;\n  if (client) {'
)
dir_code = dir_code.replace('await supabase', 'await client')
with open("web/src/lib/directoryService.ts", "w", encoding="utf-8") as f:
    f.write(dir_code)
print("Updated directoryService.ts")

# 2. Update newsStoreService.ts
with open("web/src/lib/newsStoreService.ts", "r", encoding="utf-8") as f:
    news_code = f.read()

news_code = news_code.replace(
    'import { supabase } from "./supabase";',
    'import { supabase, supabaseAdmin } from "./supabase";'
)
news_code = news_code.replace(
    'if (supabase) {',
    'const client = supabaseAdmin || supabase;\n  if (client) {'
)
news_code = news_code.replace('await supabase', 'await client')
news_code = news_code.replace('supabase.from', 'client.from')
with open("web/src/lib/newsStoreService.ts", "w", encoding="utf-8") as f:
    f.write(news_code)
print("Updated newsStoreService.ts")
