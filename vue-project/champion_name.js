import fs from 'fs';
import https from 'https';

const url = 'https://ddragon.leagueoflegends.com/cdn/15.8.1/data/ko_KR/champion.json';

https.get(url, res => {
  let data = '';

  res.on('data', chunk => {
    data += chunk;
  });

  res.on('end', () => {
    const json = JSON.parse(data);
    const championNames = Object.values(json.data).map(champ => ({
        id: champ.id,
        name: champ.name,
        image: champ.image.full
    })).sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));
    fs.writeFileSync('champion-names.json', JSON.stringify(championNames, null, 2), 'utf-8');
    console.log(`✅ 저장 완료! ${championNames.length}명의 챔피언 이름이 champion-names.json에 저장됐습니다.`);
  });

}).on('error', err => {
  console.error('🚨 다운로드 실패:', err.message);
});
