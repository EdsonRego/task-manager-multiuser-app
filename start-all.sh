#!/bin/bash
# ============================================
# 🚀 TASK MANAGER - START ALL (Interactive Version)
# Sobe backend (Docker + Spring Boot) e frontend (Vite)
# ============================================

# === Funções auxiliares ===
spinner() {
  local pid=$1
  local delay=0.1
  local spin='|/-\'
  while [ -d /proc/$pid ]; do
    for i in $(seq 0 3); do
      printf "\r\033[1;34m🌀 %s\033[0m" "${spin:$i:1}"
      sleep $delay
    done
  done
  printf "\r"
}

info()    { echo -e "\033[1;34mℹ️  $1\033[0m"; }
success() { echo -e "\033[1;32m✅ $1\033[0m"; }
warn()    { echo -e "\033[1;33m⚠️  $1\033[0m"; }
error()   { echo -e "\033[1;31m❌ $1\033[0m"; }

# === Início ===
echo -e "\n\033[1;36m🚀 Iniciando ambiente completo do Task Manager...\033[0m\n"

# 1️⃣ Verifica se Docker está ativo
if ! docker info >/dev/null 2>&1; then
  error "Docker não está em execução. Abra o Docker Desktop e tente novamente."
  exit 1
fi

# 2️⃣ Inicia o backend
info "Subindo backend (Docker + Spring Boot)..."
bash start-taskmanager.sh >/dev/null 2>&1 &
pid=$!
spinner $pid
wait $pid

if [ $? -ne 0 ]; then
  error "Falha ao iniciar o backend."
  exit 1
else
  success "Backend inicializado com sucesso!"
fi

# 3️⃣ Health-check automático
if [ -f "health-check.sh" ]; then
  info "Executando verificação de integridade..."
  bash health-check.sh >/dev/null 2>&1 &
  pid=$!
  spinner $pid
  wait $pid
  if [ $? -eq 0 ]; then
    success "Health-check: Backend operacional."
  else
    warn "Health-check retornou problemas. Verifique logs."
  fi
else
  warn "health-check.sh não encontrado — verificação pulada."
fi

# 4️⃣ Inicia o frontend
echo
info "Subindo o frontend (Vite + React)..."
bash start-frontend.sh &
pid=$!
spinner $pid
wait $pid

if [ $? -ne 0 ]; then
  error "Falha ao iniciar o frontend."
  exit 1
else
  success "Frontend em execução."
fi

# 5️⃣ Finalização
echo
success "Ambiente completo do Task Manager iniciado com sucesso!"
echo -e "\n🌐 Frontend: \033[1;36mhttp://localhost:5173\033[0m"
echo -e "🔗 Backend:  \033[1;36mhttp://localhost:8080/api\033[0m\n"
echo "🛑 Para encerrar tudo, execute: bash stop-taskmanager.sh"
echo
