# @sdt/design

Design token bersama untuk semua app di monorepo. Sumber kebenaran: Variables Figma `SDT Tokens` di file [Special Digital Things](https://www.figma.com/design/FIN7tOZUXwIk7Br9Adf1MS).

```ts
// di entry app (mis. src/main.tsx)
import '@sdt/design/tokens.css'
```

Lalu pakai variabel CSS di komponen: `var(--accent)`, `var(--text-muted)`, `var(--radius-card)`, dst. Daftar lengkap di [tokens.css](tokens.css).

Tambahkan app ke dependency dengan `"@sdt/design": "*"` di `package.json` app tersebut (workspace).

Status pemakaian: `apps/hub` ✅ · `apps/goodiebox` ❌ (masih memakai style sendiri; migrasi bertahap).
