// Gerenciador de Rotação de Links de Afiliado (Mercado Livre)
// Substitui a lista anterior pelos 5 links fornecidos, mantendo o padrão de 1 página extra por clique

export const AFFILIATE_LINKS: string[] = [
  'https://meli.la/2SMYU1C',
  'https://meli.la/157kRDu',
  'https://meli.la/2TKrt37',
  'https://meli.la/19uGpgV',
  'https://meli.la/2FHVSb8',
];

export const MELI_AFFILIATE_LINKS = AFFILIATE_LINKS;

const STORAGE_KEY = 'hg_affiliate_rotation_index_v3';
let inMemoryIndex = 0;
const listeners = new Set<() => void>();

function readIndex(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const parsed = parseInt(raw, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < AFFILIATE_LINKS.length) {
        inMemoryIndex = parsed;
        return parsed;
      }
    }
  } catch {
    // Fallback em memória se localStorage estiver bloqueado
  }
  return inMemoryIndex;
}

function writeIndex(nextIndex: number): void {
  const safeIndex = ((nextIndex % AFFILIATE_LINKS.length) + AFFILIATE_LINKS.length) % AFFILIATE_LINKS.length;
  inMemoryIndex = safeIndex;
  try {
    localStorage.setItem(STORAGE_KEY, String(safeIndex));
  } catch {
    // Ignora falha de escrita em modo privado/iframe restrito
  }
  listeners.forEach((listener) => listener());
}

/**
 * Inscreve componentes para atualizar o link atual quando a fila avançar
 */
export function subscribeAffiliateIndex(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Consulta o link de afiliado atual da rotação sem avançar o ponteiro
 */
export function getCurrentAffiliateLink(): string {
  const index = readIndex();
  return AFFILIATE_LINKS[index];
}

/**
 * Retorna o link atual e avança o ponteiro sequencialmente para o próximo link da fila
 */
export function advanceAffiliateLink(): string {
  const currentIndex = readIndex();
  const currentUrl = AFFILIATE_LINKS[currentIndex];
  writeIndex(currentIndex + 1);
  return currentUrl;
}
