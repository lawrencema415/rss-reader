import { XMLParser } from 'fast-xml-parser';

/**
 * @typedef {import('@/types/rss').RSSFeed} RSSFeed
 * @typedef {import('@/types/rss').RSSItem} RSSItem
 */

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  parseAttributeValue: true,
  trimValues: true,
});

/**
 * @param {string} url
 * @returns {Promise<RSSFeed>}
 */
export async function fetchAndParseRSS(url) {
  // Use a CORS proxy to fetch RSS feeds
  // Alternative proxies: 
  // - 'https://corsproxy.io/?'
  // - 'https://api.allorigins.win/raw?url='
  const corsProxy = 'https://corsproxy.io/?';
  const response = await fetch(corsProxy + encodeURIComponent(url));

  if (!response.ok) {
    throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
  }

  const xmlText = await response.text();
  const parsed = parser.parse(xmlText);

  // Handle different RSS formats
  const rss = parsed.rss || parsed.feed;
  const channel = rss?.channel || rss;

  if (!channel) {
    throw new Error('Invalid RSS feed format');
  }

  const items = channel.item || channel.entry || [];
  const itemArray = Array.isArray(items) ? items : [items];

  const parsedItems = itemArray.map((item) => {
    // Handle content that might be in different fields
    const content = item['content:encoded'] || item.content || item.description || '';

    return {
      title: extractText(item.title) || 'Untitled',
      link: extractLink(item) || '',
      description: cleanHtml(extractText(item.description) || ''),
      pubDate: extractText(item.pubDate) || extractText(item.published) || extractText(item.updated) || '',
      author: extractText(item.author?.name) || extractText(item['dc:creator']) || extractText(item.creator) || '',
      content: typeof content === 'string' ? content : extractText(content),
      guid: extractText(item.guid) || extractText(item.id) || extractLink(item) || '',
    };
  });

  return {
    title: extractText(channel.title) || 'Unknown Feed',
    description: extractText(channel.description) || extractText(channel.subtitle) || '',
    link: extractLink(channel) || '',
    items: parsedItems,
  };
}

function extractText(value) {
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    if (value['#text']) return value['#text'];
    if (Array.isArray(value)) return value.map(extractText).join(', ');
  }
  return '';
}

function extractLink(item) {
  if (typeof item.link === 'string') return item.link;
  if (typeof item.link === 'object') {
    if (item.link['@_href']) return item.link['@_href'];
    if (item.link['#text']) return item.link['#text'];
  }
  if (item['atom:link']?.['@_href']) return item['atom:link']['@_href'];
  return '';
}

function cleanHtml(html) {
  if (typeof html !== 'string') return '';
  // Remove HTML tags for preview text
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}
