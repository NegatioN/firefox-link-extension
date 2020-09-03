import os
import argparse
import asyncio
from aiohttp import web
import aiohttp_cors
from youtube_dl import YoutubeDL
from eyed3.id3.tag import Tag

ydl_opts = {
    'format': 'bestaudio/best',
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '192',
    }],
}

parser = argparse.ArgumentParser(description='Youtube Song Downloader')
parser.add_argument(
    '--path',
    type=str,
    default='/media/pihdd/plex_music/',
    help='path to get files locally from')

parser.add_argument(
    '--request_size',
    type=int,
    default=10 * 1024**2,
    help='Max size per request')

parser.add_argument(
    '--port',
    type=int,
    default=8080,
    help='port')
args = parser.parse_args()


routes = web.RouteTableDef()

def add_mp3_metadata(filepath, data):
    tag = Tag()
    tag.parse(filepath + '.mp3')
    tag.artist = data['artist']
    tag.album_artist = data['artist']
    tag.title = data['song']
    tag.album = data['song']   # TODO fix this? Plex doesnt respect non-album inputs.

    tag.save()

@routes.post('/')
async def download_song(request):
    body = await request.json()
    link = body['url']
    opts = ydl_opts.copy()
    file_path = os.path.join(args.path, body['artist'], body['song'], body['song'])
    opts['outtmpl'] = file_path + '.%(ext)s'
    with YoutubeDL(opts) as y:
        y.download([link])

    add_mp3_metadata(file_path, body)

    return web.json_response('OK')


async def init(loop, args):
    app = web.Application(loop=loop, client_max_size=args.request_size)

    async def on_shutdown(app):
        for task in asyncio.Task.all_tasks():
            task.cancel()

    app.on_shutdown.append(on_shutdown)

    app.add_routes(routes)
    cors = aiohttp_cors.setup(
        app,
        defaults={
            "*":
                aiohttp_cors.ResourceOptions(
                    allow_credentials=True,
                    expose_headers="*",
                    allow_headers="*")
        })

    # disable cors on all routes.
    for r in list(app.router.routes()):
        cors.add(r)

    return app


def main(args):
    loop = asyncio.get_event_loop()
    web_app = loop.run_until_complete(init(loop, args))
    try:
        web.run_app(web_app, port=args.port)
    except asyncio.CancelledError:
        pass


if __name__ == '__main__':
    main(args)