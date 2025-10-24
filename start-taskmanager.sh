#!/bin/bash
# ============================================
# 🚀 TASK MANAGER - START SCRIPT
# Sobe containers Docker e inicia o backend
# ============================================

echo "🚀 Iniciando Task Manager..."
echo

# 1️⃣ Navega até o backend
cd backend || { echo "❌ Pasta backend não encontrada!"; exit 1; }

# 2️⃣ Recria containers e sobe em background
echo "🐳 Subindo containers com Docker Compose..."
docker compose up -d --build

if [ $? -ne 0 ]; then
  echo "❌ Falha ao subir containers Docker."
  exit 1
fi

# 3️⃣ Aguarda o backend iniciar
echo
echo "🕒 Aguardando inicialização do backend (20s)..."
sleep 20

# 4️⃣ Executa health check automático (se existir)
if [ -f "../health-check.sh" ]; then
  echo
  echo "🩺 Executando health-check..."
  bash ../health-check.sh
else
  echo
  echo "⚠️ health-check.sh não encontrado — verifique manualmente em http://localhost:8080/api/users"
fi

echo
echo "✅ Task Manager inicializado com sucesso!"
echo "🌐 Frontend: http://localhost:5173"
echo "🔗 Backend:  http://localhost:8080/api"
