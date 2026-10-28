import sys
import unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from collect_album import Document, post_id, is_collection_link

class AlbumTests(unittest.TestCase):
    def test_cartoon_series_are_collections(self):
        self.assertTrue(is_collection_link('유니스트 복서, 유복의 만화 시리즈'))
        self.assertTrue(is_collection_link('봉냥씨의 만화일기 시리즈'))
        self.assertFalse(is_collection_link('복싱 3개월차인데 시비 붙었습니다.manhwa'))

    def test_topic_tip_indexes_are_collections(self):
        for pid in ['25809', '25810', '25820', '25812', '25818']:
            self.assertTrue(is_collection_link('생복이들을 위한 꿀팁 - 주제 -', pid))
        self.assertFalse(is_collection_link('생복이들을 위한 꿀팁 - 피지컬 -', '21064'))
        self.assertFalse(is_collection_link('러닝을 꼭 해야되는 이유'))
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
