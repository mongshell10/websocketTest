const WebSocket = require('ws');

module.exports = server => {
   //? express 서버와 웹소켓 서버를 연결 시킨다.
   // 변수이름은 wss(web socket server)
   const wss = new WebSocket.Server({ server }); 
   var alivelist = "" //alive array
   var alivearray = []  //alive array
   var uniqueArr = []  //alive 중복 방지용 Array

   var historylist = ""
   var historyarray = []
   var historyUniqueArr = []

   var exHistoryArray = []

   var today = new Date()

   var hours = ('0' + today.getHours()).slice(-2); 
   var minutes = ('0' + today.getMinutes()).slice(-2);
   var seconds = ('0' + today.getSeconds()).slice(-2); 

   //* 프론트에서 new WebSocket("ws://localhost:8005") 보냈을때, 웹소켓 연결 실행
   wss.on('connection', (ws, req) => {
      //* ip 파악
      // req.headers['x-forwarded-for'] : 프록시 서버를 경유할때 ip가 변조될수 있다. 이를 감지하고 본ip파악해줄 수 있다.
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      console.log('새로운 클라이언트 접속 ip : ', ip);
      

      //* 클라이언트로부터 온 메시지
      ws.on('message', message => {

         var incomming = message.toString()
         var words = incomming.split('/')


         console.log(message.toString());

         if(words[0] == 'Alive'){
            alivelist = alivelist + "/" + words[1]
            var sending = '나 서버인데 너 살아있다' + words[1]
            ws.send(sending);

            alivearray.push(words[1])

            uniqueArr = alivearray.filter((element, index) => {
               return alivearray.indexOf(element) === index;
           });

         }
         else if(words[0] == 'Message'){

            today = new Date()
            hours = ('0' + today.getHours()).slice(-2); 
            minutes = ('0' + today.getMinutes()).slice(-2);
            seconds = ('0' + today.getSeconds()).slice(-2); 

            var saveHistory = "ID : " + words[1] + " Time : " + hours + ":" + minutes + ":" + seconds + " M : " + words[2] + "\n"
            var sending = '나 서버인데 값 성공적으로 받았다' + message.toString() 
            historyarray.push(saveHistory)
            ws.send(sending);
         }
      });

      //* 에러 시
      ws.on('error', error => {
         console.error(error);
      });

      //* 연결 종료 시 (유저가 채팅방을 나간다거나)
      ws.on('close', () => {
         console.log('클라이언트 접속 해제', ip);
         uniqueArr = []
         alivearray = []
         clearInterval(ws.interval); // 연결 끊기면 setInterval 중지

      });

      // 10초마다 클라이언트로 메시지 전송
      ws.interval = setInterval(() => {
         //! 웹소켓은 비동기이기 때문에 삑 날 수 있어, 웹소켓이 클라이언트랑 연결이 되었는지 검사하는 안전 장치
         if (ws.readyState !== ws.OPEN) {
            return;
         }

         var Alivelists = "Alive," + uniqueArr

         ws.send(Alivelists);

         
      }, 10000);

      // 5초마다 클라이언트로 메시지 전송
      ws.interval = setInterval(() => {
      //! 웹소켓은 비동기이기 때문에 삑 날 수 있어, 웹소켓이 클라이언트랑 연결이 되었는지 검사하는 안전 장치
         if (ws.readyState !== ws.OPEN) {
            return;
         }
      
         var Alivelists = "Message," + historyarray

         /*if (exHistoryArray != Alivelists){
            ws.send(Alivelists);
            exHistoryArray = Alivelists;  //젠장 비동기식
         } */

         ws.send(Alivelists);
         exHistoryArray = Alivelists;
      
               
         }, 5000);

   });
};