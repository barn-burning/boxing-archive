import sys
import unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from collect_album import Document, post_id

class AlbumTests(unittest.TestCase):
    def test_url_normalization(self):
        for url in ['https://m.dcinside.com/board/bx/12?headid=60', 'https://gall.dcinside.com/bx/12', 'https://gall.dcinside.com/mgallery/board/view/?id=bx&no=12']:
            self.assertEqual(post_id(url), '12')
        for url in ['https://evil.example/bx/12', 'https://gall.dcinside.com/mgallery/board/view/?id=other&no=12', 'javascript:alert(1)']:
            self.assertIsNone(post_id(url))

    def test_only_body_links(self):
        d = Document()
        d.feed('<a href="ad">ad</a><span class="title_subject">Title</span><div class="write_div"><p><a href="https://gall.dcinside.com/bx/12">A &amp; B</a><br><img src="image"></p></div><a href="comment">Comment</a>')
        self.assertEqual(''.join(d.title), 'Title')
        self.assertEqual([(l['title'], post_id(l['url'])) for l in d.links], [('A & B', '12')])

if __name__ == '__main__':
    unittest.main()
