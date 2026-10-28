"""Read curated DC album bodies; no comments, sidebar links, or whole-gallery crawl."""
import argparse
import hashlib
import json
import os
import re
import time
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, parse_qs
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
LIST_URL = 'https://gall.dcinside.com/mgallery/board/lists/?id=bx&sort_type=N&search_head=60&page=1'
SEEDS = {'25291': '장비', '25823': '꿀팁', '25292': '치료·재활', '25735': '만화'}
# Reviewed topic indexes, not every article whose title happens to say "꿀팁".
TIP_INDEX_IDS = {'25809', '25810', '25820', '25821', '25822', '25824',
                 '25812', '25813', '25814', '25816', '25817', '25818'}
# Audited store directory explicitly curates three shop-visit reports.
EQUIPMENT_INDEX_IDS = {'20799'}

def post_id(url):
    u = urlparse(url)
    if u.hostname not in ('gall.dcinside.com', 'm.dcinside.com'):
        return None
    q = parse_qs(u.query)
    if q.get('id') == ['bx'] and q.get('no', [''])[0].isdigit():
        return q['no'][0]
    match = re.fullmatch(r'/(?:board/)?bx/(\d+)/?', u.path)
    return match[1] if match else None

def canonical(pid):
    return f'https://gall.dcinside.com/mgallery/board/view/?id=bx&no={pid}'

def is_collection_link(title, pid=None):
    return pid in TIP_INDEX_IDS | EQUIPMENT_INDEX_IDS or bool(re.search(r'모음|꿀팁.*편|번역 시리즈|만화(?:일기)? 시리즈', title))

class Document(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.depth = 0
        self.body_depth = None
        self.title_depth = None
        self.body = []
        self.title = []
        self.links = []
        self.anchor = None
        self.rows = []
        self.row = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        classes = a.get('class', '').split()
        if tag not in ('br','img','hr','input','meta','link','source','wbr','embed','area','base','col','param','track'):
            self.depth += 1
        if 'write_div' in classes:
            self.body_depth = self.depth
        if 'title_subject' in classes:
            self.title_depth = self.depth
        if tag == 'tr' and 'ub-content' in classes:
            self.row = []
        if tag == 'a':
            self.anchor = {'url': a.get('href', ''), 'parts': [], 'inBody': self.body_depth is not None}
        if self.body_depth is not None and tag in ('br','p','div'):
            self.body.append('\n')

    def handle_data(self, data):
        if self.body_depth is not None:
            self.body.append(data)
        if self.title_depth is not None:
            self.title.append(data)
        if self.anchor is not None:
            self.anchor['parts'].append(data)

    def handle_endtag(self, tag):
        if tag == 'a' and self.anchor is not None:
            link = self.anchor
            link['title'] = re.sub(r'\s+', ' ', ''.join(link.pop('parts'))).strip(' ·\n')
            if link['inBody']:
                self.links.append(link)
            if self.row is not None:
                self.row.append(link)
            self.anchor = None
        if tag == 'tr' and self.row is not None:
            self.rows.append(self.row)
            self.row = None
        if self.body_depth == self.depth:
            self.body_depth = None
        if self.title_depth == self.depth:
            self.title_depth = None
        if tag not in ('br','img','hr','input','meta','link','source','wbr','embed','area','base','col','param','track'):
            self.depth = max(0, self.depth - 1)

def fetch_document(url):
    request = Request(url, headers={'User-Agent': 'BoxingArchive/1.0 (curated album link index)', 'Accept-Language': 'ko'})
    with urlopen(request, timeout=25) as response:
        html = response.read().decode('utf-8')
    doc = Document()
    doc.feed(html)
    return doc

def collect(output, delay):
    previous = json.loads(output.read_text(encoding='utf-8')) if output.exists() else {'posts': []}
    old = {p['id']: p for p in previous['posts']}
    now = datetime.now(timezone.utc).isoformat(timespec='seconds')
    listing = fetch_document(LIST_URL)
    roots = dict(SEEDS)
    for row in listing.rows:
        for link in row:
            pid = post_id(link['url'])
            if pid and link['title'] and not re.fullmatch(r'\[?\d+\]?', link['title']):
                roots.setdefault(pid, '기타 정보')
                break
    if not listing.rows:
        raise RuntimeError('정보앨범 목록을 읽지 못했습니다. 기존 데이터를 유지합니다.')
    queue = [(pid, cat, 0) for pid, cat in roots.items()]
    visited, posts, collections, errors = set(), {}, [], []
    while queue:
        pid, category, depth = queue.pop(0)
        if pid in visited:
            continue
        visited.add(pid)
        if len(visited) > 60:
            raise RuntimeError('모음글 수가 안전 한도를 초과했습니다. 수집 설정을 확인하세요.')
        time.sleep(delay)
        try:
            doc = fetch_document(canonical(pid))
            title = ''.join(doc.title).strip()
            if not title or not doc.body:
                raise ValueError('게시물 본문 또는 제목을 찾지 못함')
            links = [l for l in doc.links if post_id(l['url']) and l['title']]
            collection = {'id': pid, 'title': title, 'category': category, 'url': canonical(pid), 'checkedAt': now,
                          'linkHash': hashlib.sha256(json.dumps(links, ensure_ascii=False).encode()).hexdigest()}
            collections.append(collection)
            for link in links:
                child = post_id(link['url'])
                if child == pid:
                    continue
                text = link['title']
                is_collection = is_collection_link(text, child)
                p = posts.setdefault(child, {'id': child, 'title': text, 'url': canonical(child), 'categories': [], 'collections': [],
                                            'kind': 'collection' if is_collection else 'article', 'firstSeenAt': old.get(child, {}).get('firstSeenAt', now)})
                if category not in p['categories']:
                    p['categories'].append(category)
                if pid not in p['collections']:
                    p['collections'].append(pid)
                p['lastSeenAt'] = now
                p['status'] = 'active'
                if is_collection and depth < 3:
                    queue.append((child, category, depth + 1))
            print(f'{pid}: {len(links)} links', flush=True)
        except Exception as error:
            errors.append({'id': pid, 'message': str(error)})
            print(f'ERROR {pid}: {error}', flush=True)
    # Never replace a working index with a partial crawl.
    if errors:
        raise RuntimeError(f'{len(errors)}개 모음글 수집 실패. 기존 데이터를 유지합니다: {errors}')
    if not posts:
        raise RuntimeError('수집 링크가 없습니다. 기존 데이터를 유지합니다.')
    # Link cards often contain only a URL. Fetch each new article's actual title
    # once; subsequent refreshes reuse metadata for unchanged IDs.
    metadata_failures = []
    for pid, p in posts.items():
        if pid in old and old[pid].get('titleVerified'):
            p['title'] = old[pid]['title']
            p['titleVerified'] = True
            continue
        known = next((c for c in collections if c['id'] == pid), None)
        if known:
            p['title'] = known['title']
            p['titleVerified'] = True
            continue
        time.sleep(delay)
        try:
            doc = fetch_document(p['url'])
            title = ''.join(doc.title).strip()
            if not title or not doc.body:
                raise ValueError('원문 확인 불가')
            p['title'] = title
            p['titleVerified'] = True
            print(f'Title {pid}', flush=True)
        except Exception:
            p['status'] = 'unavailable'
            metadata_failures.append(pid)
            print(f'Unavailable {pid}', flush=True)
    for pid, p in old.items():
        if pid not in posts:
            posts[pid] = {**p, 'status': 'needs-review'}
    added = sorted(set(posts) - set(old))
    removed = sorted(pid for pid, p in posts.items() if p['status'] == 'needs-review')
    data = {'updatedAt': now, 'sourceUrl': LIST_URL, 'collections': collections, 'posts': list(posts.values()),
            'changes': {'added': added, 'needsReview': removed, 'unavailable': metadata_failures}}
    output.parent.mkdir(parents=True, exist_ok=True)
    temp = output.with_suffix('.tmp')
    temp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    os.replace(temp, output)
    print(f'Saved {len(posts)} unique links; {len(added)} added; {len(removed)} need review.')

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', type=Path, default=ROOT / 'data' / 'album.json')
    parser.add_argument('--delay', type=float, default=1.5)
    args = parser.parse_args()
    collect(args.output, max(1, args.delay))
