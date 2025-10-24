#!/bin/bash
# ============================================
# ⚛️ TASK MANAGER - FRONTEND START SCRIPT
# Sobe o ambiente React + Vite
# ============================================

echo "🚀 Iniciando o frontend do Task Manager..."
echo

# 1️⃣ Verifica se a pasta existe
if [ ! -d "frontend" ]; then
  echo "❌ Pasta 'frontend' não encontrada! Verifique o diretório atual."
  exit 1
fi

cd frontend || exit 1

# 2️⃣ Verifica se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
  echo "📦 Instalando dependências (npm install)..."
  npm install

  if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências."
    exit 1
  fi
else
  echo "✅ Dependências já instaladas."
fi

# 3️⃣ Inicia o servidor de desenvolvimento
echo
echo "⚙️ Iniciando servidor Vite..."
echo "🌐 Acesse em: http://localhost:5173/"
echo "🛑 Pressione CTRL + C para encerrar."
echo

npm run dev
