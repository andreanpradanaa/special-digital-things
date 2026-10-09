# Dokumentasi — monorepo Special Digital Things

| Dokumen                                                      | Isi                                                                                     |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| [PROGRESS.md](PROGRESS.md)                                   | Status semua app, checklist, persen                                                     |
| [claude-setup.md](claude-setup.md)                           | Setup Claude Code di monorepo dan cara kerja harian                                     |
| [features/overview.md](features/overview.md)                 | Peta app, screen, navigasi, komponen, token, endpoint, pertanyaan terbuka               |
| [features/katalog-hub/spec.md](features/katalog-hub/spec.md) | Spec hub (Home, detail, landing momen, waitlist)                                        |
| [figma/sdt-hub-screens.md](figma/sdt-hub-screens.md)         | Ekstrak Figma per screen + node ID (hemat kuota MCP)                                    |
| [api/README.md](api/README.md)                               | Indeks kontrak API                                                                      |
| [api/goodiebox-server.md](api/goodiebox-server.md)           | Endpoint `services/api` (dari kode)                                                     |
| [api/waitlist.md](api/waitlist.md)                           | Kontrak waitlist "Kabari saya" (usulan, belum ada di API)                               |
| [db/schema.sql](db/schema.sql)                               | Skema PostgreSQL dari `services/api/migrations`                                         |
| [db/gap-analysis.md](db/gap-analysis.md)                     | Gap skema untuk multi-produk, waitlist, Hadiahku                                        |
| [postman/](postman/)                                         | Collection + environment Postman (regenerasi: `node docs/postman/build-collection.mjs`) |
| [prompt-ceria-redesign.md](prompt-ceria-redesign.md)         | Prompt redesign hub agar lebih ceria (dari sesi lain)                                   |

Cara menjalankan: [../README.md](../README.md). Aturan kerja Claude: [../CLAUDE.md](../CLAUDE.md).
