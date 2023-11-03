const Pinyin = require('pinyin');
const Fuse = require('fuse.js');

// 将中文转换为拼音和拼音简写
const chineseToPinyin = (input) => {
  const fullPinyin = Pinyin.pinyin(input, { style: Pinyin.STYLE_NORMAL }).join('');
  const abbreviation = Pinyin.pinyin(input, { style: Pinyin.STYLE_FIRST_LETTER }).join('');
  const initial = Pinyin.pinyin(input, { style: Pinyin.STYLE_FIRST_LETTER }).map(item => item[0]).join('');
  return { fullPinyin, abbreviation, initial };
};

// 配置fuse.js的选项
const options = {
  shouldSort: true,
  threshold: 0.4,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ['title', 'fullPinyin', 'abbreviation', 'initial'],
};

export function preprocess(list, key = 'title') {
  list?.forEach(el => {
    if (el[key]) {
      const pinyin = chineseToPinyin(el[key]);
      el.fullPinyin = pinyin.fullPinyin
      el.abbreviation = pinyin.abbreviation
      el.initial = pinyin.initial
    }
  });
  return list
}

export class Search {
  constructor(list) {
    this.fuse = new Fuse(list, options)
  }

  search(input) {
    return this.fuse.search(input)
  }
}

