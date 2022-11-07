const getNormalizedItem = async (item) => {
  const { frontmatter, Content, file } = item;
  const ID = file.split("/").pop().split(".").shift();

  return {
    id: ID,

    publishDate: frontmatter.publishDate,
    draft: frontmatter.draft,

    canonical: frontmatter.canonical,
    slug: frontmatter.slug || ID,
    link: frontmatter.link,

    title: frontmatter.title,
    description: frontmatter.description,
    image: frontmatter.image,

    Content: Content,
    // or 'body' in case you consume from API

    rank: frontmatter.rank,

    authors: frontmatter.authors,
    category: frontmatter.category,
    tags: frontmatter.tags,
  };
};

const load = async function () {
  const items = import.meta.glob("../data/portfolio/**/*.{md,mdx}", {
    eager: true,
  });

  const normalizedItems = Object.keys(items).map(async (key) => {
    const item = await items[key];
    return await getNormalizedItem(item);
  });

  const results = (await Promise.all(normalizedItems))
    .sort(
      (a, b) => a.rank - b.rank
      // new Date(b.publishDate).valueOf() - new Date(a.publishDate).valueOf()
    )
    .filter((post) => !post.draft);
  return results;
};

let _items;

/** */
export const fetchPortfolioItems = async () => {
  _items = _items || load();

  return await _items;
};

/** */
export const findItemsByIds = async (ids) => {
  if (!Array.isArray(ids)) return [];

  const items = await fetchPortfolioItems();

  return ids.reduce(function (r, id) {
    items.some(function (post) {
      return id === items.id && r.push(items);
    });
    return r;
  }, []);
};
