https://hyeongjin-kim.github.io/fearless-project/
<br>
올해 새롭게 LCK 및 WORLDs에 도입된 Fearless Draft 방식으로 밴픽을 할 수 있는 시뮬레이션 사이트이다.
<div>주요 기능 설명 </div>

![세트 진행 화면](https://github.com/user-attachments/assets/cb32e018-3762-4ae4-923f-4df6f97d1458)
<div>
  1. 라인별 필터링
</div> 
<div>
  각 라인에서 주로 사용하는 챔피언을 필터링해 보여준다.
  <br/>
  롤 클라이언트에 분류된대로 반영하였으며, 대회에서 사용하는 메타를 아는대로 반영하였다. (ex. 정글 자이라, 정글 뽀삐 등)
</div>
<br/>
<div>
  2. 챔피언 검색 기능
</div> 
<div>
  검색어에 해당하는 챔피언들을 필터링하여 보여준다.
  <br/>
  국문 검색, 영문 검색을 모두 지원하며, 국문의 경우, 챔피언의 별명으로도 검색할 수 있도록 하였다.(ex. 트타 -> 트리스타나, 삐뽀 -> 뽀삐)
  <br/>
  한영 변환 실수를 자주 하는 것도 고려하여 한영 변환을 잘못했더라도 검색이 가능하도록 하였다. (ex. rkfps -> 가렌, Tmfptnl -> 쓰레쉬)
</div>
<br/>
<div>
  3. 챔피언 목록
</div> 
<div>
  필터링, 검색 결과를 반영하여 챔피언들을 보여준다.
  <br/>
  패치 버전에 맞게 챔피언의 일러스트를 가져온다. (ex. 신규 챔피언, 기존 챔피언의 리메이크나 비주얼 업데이트 등을 자동으로 반영함)
  <br/>
  현재 클릭한 챔피언은 하얀색 테두리로 표시하고, 금지되었거나 이미 선택된 챔피언들은 빗금과 함께 흐리게 보이도록 하였다.
</div>
<br/>
<div>
  4. 글로벌 밴 목록
</div> 
<div>
  이전까지 있던 게임에 사용한 챔피언들을 팀별로 누적하여 보여준다.
  <br/>
  이 챔피언들은 전체 경기가 종료될 때까지 양팀 모두 사용할 수 없다.
</div>
<br/>
<div>
  5. 현재 게임 밴 목록
</div> 
<div>
  현재 게임에 밴 된 챔피언들을 보여준다.
  <br/>
  밴픽 페이즈에 맞게 현재 밴할 차례라면 빨간 테두리가 점멸하며 시각적으로 보여준다.
  <br/>
  만약 제한시간 내에 선택하지 않는다면 해당 벤카드는 공란으로 둔 채 다음으로 넘어간다.
</div>
<br/>
<div>
  5. 선택된 챔피언 목록
</div> 
<div>
  현재 게임에 선택 된 챔피언들을 보여준다.
  <br/>
  밴픽 페이즈에 맞게 현재 선택할 차례라면 빨간 테두리가 점멸하며 시각적으로 보여준다.
  <br/>
  만약 제한시간 내에 선택하지 않는다면 이미 선택되었거나 밴되지 않는 챔피언 중 하나를 임의로 선택하고 다음으로 넘어간다.
</div>
<br/>
<div>
  6. 패치 버전
</div> 
<div>
  웹사이트가 현재 사용 중인 최신 패치 버전을 보여준다.
</div>
<br/>

![세트 종료 화면](https://github.com/user-attachments/assets/00afcdd4-abd0-4186-818f-0b4a4c0d2eb1)
<div>
  1. 다음 세트 진행
</div> 
<div>
  현재 게임을 종료하고 다음 게임으로 넘어간다. (대회처럼 최대 5개의 게임 지원)
  <br/>
  다음 게임으로 넘어가면 현재 게임에서 선택된 챔피언들이 글로벌 밴으로 넘어가고. 현재 게임에 금지된 챔피언과 선택된 챔피언은 초기화된다.
</div>
<br/>
<div>
  2. 진영 변경 기능
</div> 
<div>
  경기 결과에 따라, 패자 팀이 선택한 대로 양팀의 진영을 변경할 수 있다.
  <br/>
  진영을 변경하면 글로벌 벤, 벤, 선택한 챔피언이 모두 서로 바뀐다.
</div>
<br/>
<div>
  3. 포지션 스왑 기능
</div> 
<div>
  선택한 챔피언들을 자신이 속한 팀 내에서 포지션에 맞게 위치를 바꿀 수 있다.
  <br/>
  챔피언 초상화를 클릭하면 빨간색 테두리가 깜박이고, 팀 내의 다른 챔피언을 클릭하면 두 챔피언의 위치가 바뀐다.
</div>
