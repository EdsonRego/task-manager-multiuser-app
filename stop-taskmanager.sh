#!/bin/bash
# ============================================
# 🛑 TASK MANAGER - STOP SCRIPT
# Encerra containers e limpa ambiente
# ============================================

echo "🛑 Encerrando Task Manager..."
echo

# 1️⃣ Navega até backend
cd backend || { echo "❌ Pasta backend não encontrada!"; exit 1; }

# 2️⃣ Para e remove containers
echo "🐳 Parando containers Docker..."
docker compose down

if [ $? -ne 0 ]; then
  echo "⚠️  Falha ao parar containers — verifique manualmente com 'docker ps'."
else
  echo "✅ Containers parados com sucesso."
fi

# 3️⃣ Opcional: limpar volumes (se quiser resetar banco)
if [ "$1" == "--clean" ]; then
  echo
  echo "🧹 Limpando volumes e dados persistentes..."
  docker compose down -v
  echo "✅ Volumes removidos."
fi

echo
echo "🏁 Task Manager desligado com segurança."
