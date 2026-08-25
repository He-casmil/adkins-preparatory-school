from html.parser import HTMLParser
from pathlib import Path
import sys

class TagParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.errors = []

    def handle_starttag(self, tag, attrs):
        if tag in ('area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'):
            return
        self.stack.append((tag, self.getpos()))

    def handle_startendtag(self, tag, attrs):
        # HTMLParser emits an end tag for self-closing tags in some cases.
        return

    def handle_endtag(self, tag):
        if tag in ('area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'):
            return
        if not self.stack:
            self.errors.append(f'Unexpected closing </{tag}> at {self.getpos()}')
            return
        last, pos = self.stack.pop()
        if last != tag:
            self.errors.append(f'Mismatched closing </{tag}> at {self.getpos()}, expected </{last}> from {pos}')

    def close(self):
        super().close()
        if self.stack:
            for tag, pos in self.stack:
                self.errors.append(f'Unclosed <{tag}> from {pos}')

root = Path('.')
all_ok = True
for html_file in sorted(root.glob('*.html')):
    text = html_file.read_text(encoding='utf-8')
    parser = TagParser()
    parser.feed(text)
    parser.close()
    print(f'{html_file.name} errors={len(parser.errors)}')
    if parser.errors:
        all_ok = False
        for e in parser.errors:
            print(' ', e)

sys.exit(0 if all_ok else 1)
