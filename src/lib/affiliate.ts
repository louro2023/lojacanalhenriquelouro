// Gerenciador de Rotação de Links de Afiliado Mercado Livre
// Lista fornecida com 14 links alternados a cada clique

export const MELI_AFFILIATE_LINKS: string[] = [
  'https://meli.la/228QpuZ',
  'https://meli.la/1BZ9ckM',
  'https://meli.la/1ikErww',
  'https://meli.la/2EBwarN',
  'https://meli.la/294hvEp',
  'https://meli.la/24YC3rq',
  'https://meli.la/2nXsGGC',
  'https://meli.la/12RUq5Y',
  'https://meli.la/2tbuDdz',
  'https://meli.la/2DEaWAh',
  'https://meli.la/2718YHM',
  'https://meli.la/2UsEXaa',
  'https://meli.la/1PUkZJi',
  'https://meli.la/2JrJapP',
];

const STORAGE_KEY = 'hg_meli_affiliate_index_v1';

/**
 * Retorna o próximo link de afiliado da lista alternada e atualiza o ponteiro
 */
export function getNextAffiliateLink(): string {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let index = raw !== null ? parseInt(raw, 10) : 0;
    if (isNaN(index) || index < 0 || index >= MELI_AFFILIATE_LINKS.length) {
      index = 0;
    }

    const selectedLink = MELI_AFFILIATE_LINKS[index];
    const nextIndex = (index + 1) % MELI_AFFILIATE_LINKS.length;
    localStorage.setItem(STORAGE_KEY, String(nextIndex));

    return selectedLink;
  } catch {
    // Fallback randômico caso o localStorage esteja indisponível
    const randIndex = Math.floor(Math.random() * MELI_AFFILIATE_LINKS.length);
    return MELI_AFFILIATE_LINKS[randIndex];
  }
}

/**
 * Consulta o link atual da rotação sem avançar o ponteiro (para previews ou links estáticos)
 */
export function getCurrentAffiliateLink(): string {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let index = raw !== null ? parseInt(raw, 10) : 0;
    if (isNaN(index) || index < 0 || index >= MELI_AFFILIATE_LINKS.length) {
      index = 0;
    }
    return MELI_AFFILIATE_LINKS[index];
  } catch {
    return MELI_AFFILIATE_LINKS[0];
  }
}

/**
 * Abre o próximo link de afiliado alternado em uma nova aba
 */
export function triggerAffiliateLink(): string {
  const url = getNextAffiliateLink();
  try {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  } catch (err) {
    console.warn('Falha ao abrir link de afiliado:', err);
  }
  return url;
}
