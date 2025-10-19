/**
 * UI Configuration — Task Manager
 *
 * Este arquivo controla o comportamento visual das notificações da aplicação.
 * Aqui você pode definir:
 *  - Quais tipos de mensagem serão exibidos como Toasts (notificações flutuantes)
 *  - Quais serão exibidos como Alerts (fixos no topo)
 *  - O tempo de exibição de cada tipo
 *  - (Opcional) A posição dos toasts na tela
 */

export const UI_CONFIG = {
  /**
   * Tipos de mensagens que serão exibidas como Toasts
   * Opções possíveis: "success", "danger", "warning", "info"
   *
   * Exemplo: ["success", "warning", "info"]
   * → Mostra toasts apenas para sucesso, aviso e informação
   */
  useToastsFor: ["success", "warning", "info"],

  /**
   * Tipos de mensagens que serão exibidas como Alerts fixos
   * Opções possíveis: "success", "danger", "warning", "info"
   *
   * Exemplo: ["danger"]
   * → Mostra alertas fixos apenas para mensagens de erro
   */
  useAlertsFor: ["danger"],

  /**
   * Tempo de exibição automática (em milissegundos)
   *
   * Exemplo:
   *  toast: 4000 → os toasts somem após 4 segundos
   *  alert: 5000 → os alertas somem após 5 segundos
   */
  autoHide: {
    toast: 4000,
    alert: 5000,
  },

  /**
   * (Opcional) Posição padrão dos Toasts na tela
   *
   * Opções válidas:
   *  - "top-start"     → canto superior esquerdo
   *  - "top-center"    → topo centralizado
   *  - "top-end"       → canto superior direito
   *  - "middle-start"  → centro esquerdo
   *  - "middle-center" → centro da tela
   *  - "middle-end"    → centro direito
   *  - "bottom-start"  → canto inferior esquerdo
   *  - "bottom-center" → inferior centralizado
   *  - "bottom-end"    → canto inferior direito (padrão)
   */
  toastPosition: "bottom-end",

  /**
   * 💡 Exemplos de configuração futura:
   *
   * 1️⃣ Para mostrar tudo como Toasts:
   * useToastsFor: ["success", "danger", "warning", "info"],
   * useAlertsFor: [],
   *
   * 2️⃣ Para mostrar tudo como Alerts fixos:
   * useToastsFor: [],
   * useAlertsFor: ["success", "danger", "warning", "info"],
   *
   * 3️⃣ Para mudar a posição dos Toasts:
   * toastPosition: "top-end", // Exibe no canto superior direito
   */
};
