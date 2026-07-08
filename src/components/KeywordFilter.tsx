type KeywordSummary = {
  label: string;
  count: number;
};

type KeywordFilterProps = {
  scope: string;
  keywords: KeywordSummary[];
  label: string;
};

const filterScript = `
(() => {
  if (window.__contentKeywordFilterReady) return;
  window.__contentKeywordFilterReady = true;
  window.filterContentByKeyword = function filterContentByKeyword(scope, keyword) {
    const root = document.querySelector('[data-filter-scope="' + scope + '"]');
    if (!root) return;
    const normalized = String(keyword || '').trim().toLowerCase();
    const current = root.getAttribute('data-active-filter') || '';
    const next = current === normalized ? '' : normalized;
    root.setAttribute('data-active-filter', next);
    root.querySelectorAll('[data-filter-keyword]').forEach((button) => {
      button.classList.toggle('active', next !== '' && button.getAttribute('data-filter-keyword') === next);
    });
    root.querySelectorAll('[data-filter-item]').forEach((item) => {
      const keywords = (item.getAttribute('data-filter-keywords') || '').split('|');
      item.hidden = next !== '' && !keywords.includes(next);
    });
  };
  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('[data-filter-keyword][data-filter-scope-target]') : null;
    if (!target) return;
    window.filterContentByKeyword(target.getAttribute('data-filter-scope-target'), target.getAttribute('data-filter-keyword'));
  });
})();
`;

export function KeywordFilter({ scope, keywords, label }: KeywordFilterProps) {
  if (keywords.length === 0) return null;

  return (
    <>
      <p className="caption">{label}</p>
      <div className="keyword-list" aria-label={label}>
        {keywords.map((keyword) => (
          <button
            className="keyword"
            data-filter-keyword={keyword.label.trim().replace(/\s+/g, " ").toLowerCase()}
            data-filter-scope-target={scope}
            key={keyword.label}
            type="button"
          >
            {keyword.label} <span>{keyword.count}</span>
          </button>
        ))}
      </div>
      <script dangerouslySetInnerHTML={{ __html: filterScript }} />
    </>
  );
}
