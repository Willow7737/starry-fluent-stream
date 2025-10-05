import os, aiohttp, logging
log = logging.getLogger('fallback_adapter')

async def translate_via_deepl(text, target_lang, auth_key):
    url = 'https://api-free.deepl.com/v2/translate'
    data = {'text': text, 'target_lang': target_lang}
    headers = {'Authorization': f'DeepL-Auth-Key {auth_key}'}
    async with aiohttp.ClientSession() as s:
        async with s.post(url, data=data, headers=headers) as resp:
            if resp.status == 200:
                j = await resp.json()
                return j.get('translations', [{}])[0].get('text')
    return None
