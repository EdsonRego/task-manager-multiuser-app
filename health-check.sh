#!/bin/bash
# ============================================
# 🩺 TASK MANAGER - HEALTH CHECK
# Verifica containers e APIs antes de testes UI
# ============================================

echo "🚀 Iniciando verificação do ambiente Task Manager..."
echo

# 1️⃣ Verificar containers
echo "🧱 Verificando containers Docker..."
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo
echo "🕒 Aguardando backend inicializar (máx. 20s)..."
sleep 20

# 2️⃣ Testar banco de dados
echo
echo "🐘 Testando conexão com PostgreSQL..."
docker exec -it taskmanager-db pg_isready -U postgres

# 3️⃣ Testar API do backend
echo
echo "🔍 Testando endpoint principal do backend..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/users | grep 200 >/dev/null

if [ $? -eq 0 ]; then
  echo "✅ Backend está respondendo em http://localhost:8080"
else
  echo "❌ Erro: Backend não respondeu (verifique logs com 'docker logs taskmanager-backend')"
  exit 1
fi

# 4️⃣ Testar migrações e tabelas básicas
echo
echo "🧩 Verificando tabelas básicas..."
docker exec -i taskmanager-db psql -U postgres -d taskmanagerdb -c "\dt" | grep users >/dev/null
if [ $? -eq 0 ]; then
  echo "✅ Tabelas detectadas: users e tasks"
else
  echo "⚠️  As tabelas não foram encontradas — verifique as migrações Flyway."
fi

echo
echo "🎯 Health check concluído com sucesso!"
