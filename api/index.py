from http.server import BaseHTTPRequestHandler
import json
import urllib.parse
import os
import sys

# Ensure root directory is in sys.path to import server.py DATA
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.append(ROOT_DIR)

from server import DATA

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        if path in ('/api/all', '/api/all/'):
            res = DATA
        elif path in ('/api/incidents', '/api/incidents/'):
            res = DATA.get('incidents', [])
        elif path in ('/api/alerts', '/api/alerts/'):
            res = DATA.get('alerts', [])
        elif path in ('/api/evolutions', '/api/evolutions/'):
            res = DATA.get('evolution_requests', [])
        elif path in ('/api/jira', '/api/jira/'):
            res = DATA.get('jira_board', {})
        elif path in ('/api/metrics', '/api/metrics/'):
            res = DATA.get('framework_metrics', {})
        else:
            res = {"status": "ok", "message": "DMIS API Active on Vercel"}

        self.wfile.write(json.dumps(res).encode('utf-8'))

    def do_POST(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps({"status": "ok", "message": "Request logged"}).encode('utf-8'))
