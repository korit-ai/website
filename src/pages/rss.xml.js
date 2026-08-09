import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

// Single combined feed across both locales — split into per-locale feeds
// later if that's ever actually needed once there's real content.
export async function GET(context) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  return rss({
    title: 'korit.ai — Updates',
    description: 'News and updates from korit.ai.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/${post.data.locale}/blog/${post.id}/`,
    })),
  });
}
