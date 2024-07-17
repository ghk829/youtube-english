# YOUTUBE-ENGLISH

### 협업 관리
https://docs.google.com/spreadsheets/d/1Uqh8JR2SoscJpUAgcGCXgbUEHmPQwM8WK4gipAonWwE/edit?usp=sharing

Mimos Dev: 작업해야 하는 목록 / 작업된 목록
Mimos Dev Structure: 폴더 구조
Mimos API: (FE) 컴포넌트 / (BE) API / (BE) DB 구조 

작업해야 하는 목록 좌측 작업자 필드에 이름 작성 후 진행

### 기술
 Node.js Express / React.js / Vercel

 기술적으로는 MVP 마무리되면 Redux 같은 라이브러리 하나씩 추가로 사용하면서 개선시켜볼 계획이 있으니 그 전까지 더 사용해 보고 싶은 기술들 있으시면 편히 말씀 주세요 ㅎㅎ

#### FE 테스트
.env
REACT_APP_MOD = "https://youtube-english-jep4-jooeun-parks-projects.vercel.app" 

Terminal
```
cd frontend
npm i 
npm run start
```

#### BE 테스트 (임시)
.env
REACT_APP_MOD = "" 
endpoint에서 /api 삭제

##### BE 테스트 예시
```
        const response = await axios.post(`${process.env.REACT_APP_MOD || ""}/api/translator`, { subtitle: data });
를 
        const response = await axios.post(`${process.env.REACT_APP_MOD || ""}/translator`, { subtitle: data });
으로 변경

```


### Git
피쳐 브랜치 사용
양식: 이름/기능명 (예시: jooeun/new-step ) 
작업 완료 이후 Pull Request 

원래는 PR 후에 본인이 바로 머지하는데, 저희가 처음 함께 작업해 보니까 한 일이주간 서로 코드 확인하고 머지하면 좋을 것 같아요

### 배포
저희 프로젝트는 현재 Vercel로 배포하고 있는데, 무료 플랜이다보니 팀원 추가가 안 되네요 ㅠ BE쪽 작업하실 거면 우선 로그는 클라이언트 쪽에 임시로 출력하는 방식으로 진행하셔야 할 것 같아요! 

빠른 시일 내에 메인 브랜치에 머지하면 바로 배포되도록 조치해 둘게요
그 전까지는 gitHub에 PR 올려주시면 확인하고 바로바로 배포해 두도록 하겠습니다 ㅎㅎ 
