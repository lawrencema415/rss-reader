import { XMLParser } from 'fast-xml-parser';


const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  parseAttributeValue: true,
  trimValues: true,
});

/**
 * @param {string} url
 */
export async function fetchAndParseRSS(url) {
  const proxies = [
    (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
    (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
    (u) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
  ];

  let xmlText = null;
  let lastError = null;

  for (const proxy of proxies) {
    try {
      const response = await fetch(proxy(url));
      if (response.ok) {
        xmlText = await response.text();
        break;
      } else {
        lastError = new Error(`Proxy error: ${response.statusText}`);
      }
    } catch (error) {
      lastError = error;
    }
  }

  if (!xmlText) {
    throw new Error(`Failed to fetch RSS feed after trying multiple proxies. Last error: ${lastError?.message}`);
  }

  // Check if response is actually HTML (common with strict firewalls/proxies)
  if (xmlText.trim().toLowerCase().startsWith('<!doctype html') || 
      xmlText.trim().toLowerCase().startsWith('<html')) {
    throw new Error('Feed URL returned a webpage instead of an RSS feed (likely blocked by CORS/Firewall).');
  }

  let parsed;
  try {
    parsed = parser.parse(xmlText);
  } catch (error) {
    console.error('XML Parsing Error:', error);
    throw new Error('Failed to parse RSS feed content. The feed might be malformed.');
  }

  // Handle different RSS formats
  const rss = parsed.rss || parsed.feed;
  const channel = rss?.channel || rss;

  if (!channel) {
    throw new Error('Invalid RSS feed format: Missing channel/feed element');
  }

  const items = channel.item || channel.entry || [];
  const itemArray = Array.isArray(items) ? items : [items];

  const parsedItems = itemArray.map((item) => {
    // Handle content that might be in different fields
    const rawContent = item['content:encoded'] || item.content || item.description || '';
    const contentStr = typeof rawContent === 'string' ? rawContent : extractText(rawContent);

    return {
      title: extractText(item.title) || 'Untitled',
      link: extractLink(item) || '',
      description: cleanHtml(extractText(item.description) || ''),
      pubDate: extractText(item.pubDate) || extractText(item.published) || extractText(item.updated) || '',
      author: extractText(item.author?.name) || extractText(item['dc:creator']) || extractText(item.creator) || '',
      content: contentStr,
      thumbnail: extractFirstImage(contentStr) || extractFirstImage(item['media:content']?.['@_url'] || ''),
      feedName: extractText(channel.title) || 'Unknown Feed', // Useful for context
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

function extractFirstImage(html) {
  if (typeof html !== 'string') return '';
  // Match <img ... src="URL" ... > or just simple URL if passed directly
  if (html.startsWith('http')) return html;
  
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  return imgMatch ? imgMatch[1] : '';
}
