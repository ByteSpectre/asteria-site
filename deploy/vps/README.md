# VPS deploy (REG.RU / ISPmanager 6)

Полная инструкция на русском: **[INSTRUCTION.md](./INSTRUCTION.md)**

Локальная проверка в WSL Ubuntu (перед VPS): **[INSTRUCTION-WSL.md](./INSTRUCTION-WSL.md)**

Краткий чеклист: **[CHECKLIST.md](./CHECKLIST.md)**

```bash
# Сначала на ПК (WSL):
cp deploy/vps/env.wsl.example .env
# заполните .env → см. INSTRUCTION-WSL.md

# Потом на VPS:
cp deploy/vps/env.production.example .env
# заполните .env
bash deploy/vps/deploy.sh
```
