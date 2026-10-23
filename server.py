import functools
import http.server
import os
import socketserver

# Serve the folder this script lives in, so the project is portable.
ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = 4787

Handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
    print("SiteWell Studio preview on http://127.0.0.1:%d" % PORT)
    httpd.serve_forever()
