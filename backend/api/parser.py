import asyncio
import json

import aiohttp


async def send_request(session, url, semaphore, headers=None, params=None):
    async with semaphore:
        max_retries = 1
        retries = 0
        while retries < max_retries:
            async with session.get(url, headers=headers, params=params) as response:
                if response.status == 200:
                    try:
                        data = await response.text()
                        return data
                    except Exception as e:
                        print(e)
                        retries += 1
                else:
                    retries += 1
                    if retries >= 6:
                        await asyncio.sleep(80)
        return None


async def parse_data(raw_data):
    results = []

    data = json.loads(raw_data)
    for item in data['products']:
        name = item.get('name', '')
        sizes = item.get('sizes', [])
        price_basic, price_sale = None, None

        if sizes and 'price' in sizes[0]:
            price_basic = sizes[0]['price'].get('basic')
            price_sale = sizes[0]['price'].get('product')

        rating = item.get('reviewRating', None)
        feedbacks = item.get('feedbacks', 0)

        results.append({
            'Название': name,
            'Базовая цена': price_basic,
            'Цена со скидкой': price_sale,
            'Рейтинг': rating,
            'Отзывы': feedbacks
        })
    return results


async def insert_data(items):
    url = 'http://127.0.0.1:8000/api/products/'

    async with aiohttp.ClientSession() as session:
        for item in items:
            print(item)
            payload = {
                'name': item['Название'],
                'price_basic': item['Базовая цена'] / 100 if item['Базовая цена'] else None,
                'price_sale': item['Цена со скидкой'] / 100 if item['Цена со скидкой'] else None,
                'rating': item['Рейтинг'],
                'feedbacks': item['Отзывы']
            }

            async with session.post(url, json=payload) as response:
                if response.status == 201:
                    print(f"✓ Успешно добавлено: {payload['name']}")
                else:
                    error_text = await response.text()
                    print(f"✗ Ошибка ({response.status}) при добавлении '{payload['name']}': {error_text}")


async def run_parse(name):
    pages = 2
    url = 'https://search.wb.ru/exactmatch/ru/common/v14/search'
    tasks_request = []
    tasks_parce = []
    async with aiohttp.ClientSession() as session:
        semaphore = asyncio.Semaphore(2)
        for page in range(pages):
            params = {
                'ab_testid': 'no_action',
                'appType': '1',
                'curr': 'rub',
                'dest': '-1257786',
                'hide_dtype': '13',
                'lang': 'ru',
                'page': f'{page}',
                'query': f'{name}',
                'resultset': 'catalog',
                'sort': 'popular',
                'spp': '30',
                'suppressSpellcheck': 'false',
            }
            tasks_request.append(send_request(session, url, semaphore, params=params))

        results_request = await asyncio.gather(*tasks_request)

        for result in results_request:
            tasks_parce.append(parse_data(result))

        results_parce = await asyncio.gather(*tasks_parce)
        # "Плоский" список
        all_items = [item for sublist in results_parce for item in sublist]
        await insert_data(all_items)

