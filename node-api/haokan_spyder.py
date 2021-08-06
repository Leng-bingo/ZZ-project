# -*- coding: utf-8 -*-
# @Time : 2021/6/27 8:36 下午
# @Author : fancy
# @Email : Null
# @File : haokan_spyder.py

import json
import logging
import os
import re
import time
import requests
from lxml import etree
from lujing import lujing

logger = logging.getLogger(__name__)
logger.setLevel(level=logging.INFO)
handler = logging.FileHandler("log.txt")
handler.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)

console = logging.StreamHandler()
console.setLevel(logging.INFO)

logger.addHandler(handler)
logger.addHandler(console)

# 与代码同目录下新建video文件夹
# video_dir = "video/"
video_dir = lujing
if not os.path.exists(video_dir):
    os.mkdir(video_dir)

# headers
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) '
                  'Chrome/90.0.4430.212 Safari/537.36',
    'referer': 'https://haokan.baidu.com/'
}


def video_spider(video_title, video_url, keyword, sub_video_dir):
    """
    根据url获取视频的真实url，并且下载保存
    :param video_title:
    :param video_url:
    :return:
    """
    # 视频url的 get，获取html
    r = requests.get(video_url, headers=headers)
    r.raise_for_status()
    html_info = etree.HTML(r.text)

    try:
        # 解析获取的html，获取视频真实的url
        data = html_info.xpath('//script[@type="text/javascript"]')
        scripts = data[0].text
        res = re.findall('window.__PRELOADED_STATE__ += +(.+)};', scripts)
        r_json = json.loads(res[0] + '}')
        r_url = r_json['curVideoMeta']['playurl']

        # 视频真实url的抓取，保存为mp4文件
        r_video = requests.get(r_url, headers=headers, timeout=50)
        r_video.raise_for_status()  # 如果不是200，引发HTTPError异常
        video_size = int(r_video.headers['content-length']) / 1024 / 1024
        if video_size < 100: # 大于100MB的就不保存
            with open(sub_video_dir + video_title + '.mp4', mode='wb') as fout:
                fout.write(r_video.content)

    except Exception as e:
        logger.error("[%s]:爬取错误，爬取的视频名称{%s}，爬取的视频网址{%s}，错误日志:{%s}" % (keyword, video_title, video_url, str(e)))


def batch_spider(keyword):
    """
    输入搜索词，获取搜索词相关的top 10的视频
    :param keyword:
    :return:
    """
    pre_url = "https://haokan.baidu.com/web/search/api?pn=1&rn=10&type=video&query="

    # 文件夹创建
    sub_video_dir = lujing + str(keyword) + '/'
    if not os.path.exists(sub_video_dir):
        os.mkdir(sub_video_dir)

    url = pre_url + keyword
    r = requests.get(url, headers=headers)
    r.raise_for_status()
    info = r.json()["data"]["list"]
    if info.__len__() < 1:
        logger.warning("[%s]:无视频返回" % (keyword))
    else:
        for index, value in enumerate(info[:100]):
            video_title = value["title"]
            video_title = video_title.replace('\\', "").replace("/", "").replace("*", "").replace("?", "").replace("\"", "")\
                .replace("<", "").replace(">", "").replace("|", "").replace(":", "")
            video_url = value["url"]
            logger.info("[%s]:正在抓取第%d个视频:%s" % (keyword, index+1, video_title))
            video_spider(video_title, video_url, keyword, sub_video_dir)
            time.sleep(2)


def batch_keyword(file_name):
    with open(file_name, "r", encoding="utf8") as fin:
        for line in fin:
            line = line.strip()
            batch_spider(line)
            time.sleep(10)


def dir_get():
    """

    :return:
    """
    # 获取所有子目录
    sub_dirs = []
    for root, dirs, files in os.walk(video_dir):
        sub_dirs = dirs
        break

    # 将所有子目录下的文件获取并保存到列表中
    file_list = []
    for sub_dir in sub_dirs:
        sub_files = []
        for root, dirs, files in os.walk(video_dir + '/' + sub_dir):
            sub_files = files
        sub_files = ["\t".join([sub_dir, w]) for w in sub_files]
        file_list.extend(sub_files)

    # 将循环获取到结果保存到文件中
    with open("file_dirs.txt", "w", encoding="utf8") as fout:
        fout.write("\n".join(file_list))


if __name__ == '__main__':
    file_name = "spider_data.txt"
    batch_keyword(file_name)
    dir_get()
    pass
