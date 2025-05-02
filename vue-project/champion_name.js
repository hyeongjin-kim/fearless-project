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
    const nicknamemap = {};
  
    // 챔피언 배열 만들면서 nicknameMap 채우기
    const championList = Object.values(json.data).sort((a, b) =>
      a.name.localeCompare(b.name, 'ko-KR')
    );
  
    championList.forEach(champ => {
      nicknamemap[champ.id] = [champ.name]; // 기본 이름만 먼저 넣음
    });
  
    fs.writeFileSync('champion-names.json', JSON.stringify(nicknamemap, null, 2), 'utf-8');
    console.log(`✅ 저장 완료! ${championList.length}명의 챔피언 이름이 champion-names.json에 저장됐습니다.`);
  });

}).on('error', err => {
  console.error('🚨 다운로드 실패:', err.message);
});
