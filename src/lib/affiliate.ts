// Gerenciador de Rotação Sequencial de Links de Afiliado (Amazon, AliExpress e Mercado Livre)
// Substitui a lista anterior pelos 11 links fornecidos, alternando em ordem a cada clique

export const AFFILIATE_LINKS: string[] = [
  'https://link.amazon/B01IRMR4F',
  'https://s.click.aliexpress.com/e/_mPq0raB',
  'https://meli.la/16Zz5Re',
  'https://meli.la/2Ga4Kp3',
  'https://meli.la/119W5m2',
  'https://s.click.aliexpress.com/e/_mrHftML',
  'https://meli.la/1BZ9ckM',
  'https://meli.la/1ikErww',
  'https://s.click.aliexpress.com/e/_mtuQIFl',
  'https://s.click.aliexpress.com/e/_m02VD9N',
  'https://meli.la/2uuSaJN',
];

export const MELI_AFFILIATE_LINKS = AFFILIATE_LINKS;

const STORAGE_KEY = 'hg_affiliate_rotation_index_v2';
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
